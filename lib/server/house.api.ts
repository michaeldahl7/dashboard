import { createServerFn } from "@tanstack/start";
import { and, eq } from "drizzle-orm";
import { ulid } from "ulid";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import {
   type HouseForm,
   HouseFormSchema,
   type HouseMemberForm,
   HouseMemberFormSchema,
   houseMember,
   house as houseTable,
} from "~/lib/server/schema";
import { createDefaultLocations } from "~/lib/server/utils/defaultLocations";

// Create a new house
export const addHouse = createServerFn()
   .middleware([authMiddleware])
   .validator((data: HouseForm) => HouseFormSchema.parse(data))
   .handler(async ({ data, context }) => {
      const houseId = ulid();

      return await db.transaction(async (tx) => {
         const [house] = await tx
            .insert(houseTable)
            .values({
               id: houseId,
               name: data.name,
               owner_id: context.auth.user!.id,
            })
            .returning();

         await tx.insert(houseMember).values({
            id: ulid(),
            house_id: houseId,
            user_id: context.auth.user!.id,
            role: "admin",
         });

         const locations = await createDefaultLocations(houseId);

         return { house, locations };
      });
   });
