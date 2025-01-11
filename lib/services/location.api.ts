// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { ulid } from "ulid";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
   location,
   item,
   LocationFormSchema,
   ItemFormSchema,
   type InsertLocation,
   type InsertItem,
   type LocationForm,
   type ItemForm,
} from "~/lib/server/schema/location.schema";

export const getInventories = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: houseId }) => {
      return db.select().from(location).where(eq(location.house_id, houseId));
   });

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: locationId }) => {
      return db.select().from(item).where(eq(item.location_id, locationId));
   });

export const addInventory = createServerFn()
   .middleware([authMiddleware])
   .validator((data: LocationForm) => LocationFormSchema.parse(data))
   .handler(async ({ data }) => {
      const locationData: InsertLocation = {
         id: ulid(),
         name: data.name,
         type: data.type,
         house_id: data.houseId,
      };
      return db.insert(location).values(locationData).returning();
   });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator((data: ItemForm) => ItemFormSchema.parse(data))
   .handler(async ({ data }) => {
      const itemData: InsertItem = {
         id: ulid(),
         name: data.name,
         location_id: data.locationId,
         quantity: data.quantity,
         unit: data.unit,
      };

      return db.insert(item).values(itemData).returning();
   });
