// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import {
   item,
   location,
   ItemInsertSchema,
   type ItemInsert,
   type ItemSelect,
   LocationInsertSchema,
   type LocationInsert,
} from "~/lib/server/schema/location.schema";
import type { LocationWithItems } from "~/lib/server/schema/types";

export const getInventories = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db.select().from(location).where(eq(location.houseId, houseId));
   });

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: locationId }) => {
      return db.select().from(item).where(eq(item.locationId, locationId));
   });

export const getLocations = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db.select().from(location).where(eq(location.houseId, houseId));
   });

// export const addInventory = createServerFn()
//    .middleware([authMiddleware])
//    .validator(LocationInsertSchema)
//    .handler(async ({ data }) => {
//       return db.insert(location).values(data).returning();
//    });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator(ItemInsertSchema)
   .handler(async ({ data }) => {
      return db.insert(item).values(data).returning();
   });
// export const addItem = createServerFn()
//    .middleware([authMiddleware])
//    .validator((data: unknown) => {
//       return ItemInsertSchema.parse(data);
//    })
//    .handler(async ({ data }) => {
//       return db.insert(item).values(data).returning();
//    });

export const addLocation = createServerFn()
   .middleware([authMiddleware])
   .validator(LocationInsertSchema)
   .handler(async ({ data }) => {
      const [newLocation] = await db
         .insert(location)
         .values({
            name: data.name,
            type: data.type,
            houseId: data.houseId,
         })
         .returning();

      return newLocation;
   });

export const getLocationsWithItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      const results = await db
         .select()
         .from(location)
         .leftJoin(item, eq(location.id, item.locationId))
         .where(eq(location.houseId, houseId));

      // Group items by location
      return Object.values(
         results.reduce(
            (acc, row) => {
               const locationId = row.location.id;
               if (!acc[locationId]) {
                  acc[locationId] = {
                     ...row.location,
                     items: [],
                  };
               }
               if (row.item) {
                  acc[locationId].items.push(row.item);
               }
               return acc;
            },
            {} as Record<number, LocationWithItems>,
         ),
      );
   });
