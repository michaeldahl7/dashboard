import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { house, user, houseMember, locationType, location } from "~/lib/server/schema";
import { DEFAULT_LOCATIONS } from "~/lib/server/schema/location.schema";
import { KitchenError } from "~/lib/server/utils/errors";

const getAllHouses = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const results = await db.query.houseMember.findMany({
         where: eq(houseMember.userId, context.auth.user.id),
         with: {
            house: {
               with: {
                  owner: true,
               },
            },
         },
      });

      return results.map((member) => ({
         ...member.house,
         role: member.role,
      }));
   });

const getCurrentHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      if (!context.auth.user.currentHouseId) {
         throw new KitchenError("No current house selected", "NO_CURRENT_HOUSE");
      }

      const result = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, context.auth.user.currentHouseId),
            eq(houseMember.userId, context.auth.user.id),
         ),
         with: {
            house: {
               with: {
                  owner: true,
               },
            },
         },
      });

      if (!result) {
         throw new KitchenError("House not found", "HOUSE_NOT_FOUND");
      }

      return {
         ...result.house,
         role: result.role,
      };
   });

const createHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         name: z.string().min(2).max(50),
         setAsCurrent: z.boolean().default(true),
      }),
   )
   .handler(async ({ context, data }) => {
      return await db.transaction(async (tx) => {
         const [newHouse] = await tx
            .insert(house)
            .values({
               name: data.name,
               ownerId: context.auth.user.id,
            })
            .returning();

         if (!newHouse) {
            throw new KitchenError("Failed to create house", "HOUSE_CREATION_FAILED");
         }

         await tx.insert(houseMember).values({
            houseId: newHouse.id,
            userId: context.auth.user.id,
            role: "admin",
         });

         const locationTypes = await Promise.all(
            DEFAULT_LOCATIONS.map(async (loc) => {
               const existing = await tx.query.locationType.findFirst({
                  where: and(
                     eq(locationType.name, loc.type as string),
                     eq(locationType.isDefault, true),
                  ),
               });

               if (existing) return existing;

               const [newType] = await tx
                  .insert(locationType)
                  .values({
                     name: loc.type as string,
                     isDefault: true,
                  })
                  .returning();
               return newType;
            }),
         );

         await tx.insert(location).values(
            locationTypes.map((type, index) => {
               const defaultLocation = DEFAULT_LOCATIONS[index];
               if (!defaultLocation) {
                  throw new KitchenError(
                     "Invalid location type",
                     "LOCATION_CREATION_FAILED",
                  );
               }
               return {
                  name: defaultLocation.name,
                  typeId: type.id,
                  houseId: newHouse.id,
                  isCustom: false,
               };
            }),
         );

         if (data.setAsCurrent) {
            await tx
               .update(user)
               .set({ currentHouseId: newHouse.id })
               .where(eq(user.id, context.auth.user.id));
         }

         return { ...newHouse, role: "admin" as const };
      });
   });

const updateHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         houseId: z.number(),
         name: z.string().min(2).max(50),
      }),
   )
   .handler(async ({ data, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, data.houseId),
            eq(houseMember.userId, context.auth.user.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to update house");

      const [updatedHouse] = await db
         .update(house)
         .set({ name: data.name })
         .where(eq(house.id, data.houseId))
         .returning();

      return updatedHouse;
   });

const deleteHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, houseId),
            eq(houseMember.userId, context.auth.user.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to delete house");

      await db.delete(house).where(eq(house.id, houseId));
   });

const setCurrentHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId, context }) => {
      await db
         .update(user)
         .set({ currentHouseId: houseId })
         .where(eq(user.id, context.auth.user.id));
   });

const createDefaultHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return createHouse({
         data: {
            name: "My House",
            setAsCurrent: true,
         },
      });
   });

export const houseApi = {
   getAll: getAllHouses,
   getCurrent: getCurrentHouse,
   create: createHouse,
   update: updateHouse,
   delete: deleteHouse,
   setCurrent: setCurrentHouse,
   createDefault: createDefaultHouse,
};
