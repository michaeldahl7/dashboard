import { createServerFn } from "@tanstack/start";
import { and, eq, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { house, user, houseMember, locationType, location } from "~/lib/server/schema";
import { KitchenError } from "~/lib/server/utils/errors";

export const addHouse = createServerFn()
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

         // Get or create default location types
         const defaultTypes = {
            fridge: { name: "Fridge", isDefault: true },
            freezer: { name: "Freezer", isDefault: true },
            pantry: { name: "Pantry", isDefault: true },
            counter: { name: "Counter", isDefault: true },
         } as const;

         const locationTypes = await tx
            .select()
            .from(locationType)
            .where(and(isNull(locationType.houseId), eq(locationType.isDefault, true)));

         // Create all default types if any are missing
         if (locationTypes.length !== 4) {
            locationTypes.push(
               ...(await tx
                  .insert(locationType)
                  .values(Object.values(defaultTypes))
                  .returning()),
            );
         }

         // Create locations with types
         const locations = await tx
            .insert(location)
            .values(
               locationTypes.map((type) => ({
                  name: `${type.name}`,
                  typeId: type.id,
                  houseId: newHouse.id,
               })),
            )
            .returning();

         if (data.setAsCurrent) {
            await tx
               .update(user)
               .set({
                  currentHouseId: newHouse.id,
               })
               .where(eq(user.id, context.auth.user.id));
         }

         return { house: newHouse, locations };
      });
   });

export const updateHouse = createServerFn()
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
            eq(houseMember.userId, context.auth.user!.id),
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

export const deleteHouse = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId, context }) => {
      const member = await db.query.houseMember.findFirst({
         where: and(
            eq(houseMember.houseId, houseId),
            eq(houseMember.userId, context.auth.user!.id),
            eq(houseMember.role, "admin"),
         ),
      });

      if (!member) throw new Error("Not authorized to delete house");

      await db.delete(house).where(eq(house.id, houseId));
   });

// export const getCurrentHouse = createServerFn()
//    .middleware([authMiddleware])
//    .handler(async ({ context }) => {
//       return db.query.user.findFirst({
//          where: eq(user.id, context.auth.user!.id),
//          with: {
//             currentHouse: true,
//          },
//       });
//    });

export const getCurrentHouse = createServerFn()
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

export const createDefaultHouse = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      return await db.transaction(async (tx) => {
         const [newHouse] = await tx
            .insert(house)
            .values({
               name: "My House",
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

         // Get or create default location types
         const defaultTypes = {
            fridge: { name: "Fridge", isDefault: true },
            freezer: { name: "Freezer", isDefault: true },
            pantry: { name: "Pantry", isDefault: true },
            counter: { name: "Counter", isDefault: true },
         } as const;

         const locationTypes = await tx
            .select()
            .from(locationType)
            .where(and(isNull(locationType.houseId), eq(locationType.isDefault, true)));

         // Create all default types if any are missing
         if (locationTypes.length !== 4) {
            locationTypes.push(
               ...(await tx
                  .insert(locationType)
                  .values(Object.values(defaultTypes))
                  .returning()),
            );
         }

         // Create locations with types
         const locations = await tx
            .insert(location)
            .values(
               locationTypes.map((type) => ({
                  name: `${type.name}`,
                  typeId: type.id,
                  houseId: newHouse.id,
               })),
            )
            .returning();

         await tx
            .update(user)
            .set({ currentHouseId: newHouse.id })
            .where(eq(user.id, context.auth.user.id));

         return {
            house: { ...newHouse, role: "admin" as const },
            locations,
         };
      });
   });

// export const getHousesOfUser = createServerFn()
//    .middleware([authMiddleware])
//    .handler(async ({ context }) => {
//       return db.query.houseMember.findMany({
//          where: eq(houseMember.userId, context.auth.user!.id),
//          with: {
//             house: true,
//          },
//       });
//    });

export const getUserHouses = createServerFn()
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

export const getHouseMembers = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db.query.houseMember.findMany({
         where: eq(houseMember.houseId, houseId),
         with: {
            user: true,
         },
      });
   });
