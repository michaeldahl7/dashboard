// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { ulid } from "ulid";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import {
   type InsertItem,
   type InsertLocation,
   type ItemForm,
   ItemFormSchema,
   type LocationForm,
   LocationFormSchema,
   item,
   location,
} from "~/lib/server/schema/location.schema";

export const getInventories = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: houseId }) => {
      return db.select().from(location).where(eq(location.houseId, houseId));
   });

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: locationId }) => {
      return db.select().from(item).where(eq(item.locationId, locationId));
   });

export const addInventory = createServerFn()
   .middleware([authMiddleware])
   .validator((data: LocationForm) => LocationFormSchema.parse(data))
   .handler(async ({ data }) => {
      const locationData: InsertLocation = {
         id: ulid(),
         name: data.name,
         type: data.type,
         houseId: data.houseId,
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
         locationId: data.locationId,
         quantity: data.quantity,
         unit: data.unit,
      };

      return db.insert(item).values(itemData).returning();
   });
