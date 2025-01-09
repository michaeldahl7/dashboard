import { createServerFn } from "@tanstack/start";
import { ulid } from "ulid";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
  house as houseTable,
  houseMember,
  HouseFormSchema,
  HouseMemberFormSchema,
  type HouseForm,
  type HouseMemberForm,
} from "~/lib/server/schema";
import { createDefaultLocations } from "~/lib/server/utils/defaultLocations";

// Create a new house
export const addHouse = createServerFn()
  .middleware([authMiddleware])
  .validator((data: HouseForm) => HouseFormSchema.parse(data))
  .handler(async ({ data, context }) => {
    const houseId = ulid();
    
    return await db.transaction(async (tx) => {
      const [house] = await tx.insert(houseTable).values({
        id: houseId,
        name: data.name,
        owner_id: context.auth.user!.id,
      }).returning();

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