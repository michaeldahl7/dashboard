// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
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

export const addInventory = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         name: z.string().min(1).max(50),
         type: z.enum(["fridge", "freezer", "pantry", "counter"]),
         houseId: z.number(),
         description: z.string().max(200).optional(),
      }),
   )
   .handler(async ({ data }) => {
      return db.insert(location).values(data).returning();
   });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator((data: ItemForm) => ItemFormSchema.parse(data))
   .handler(async ({ data }) => {
      return db
         .insert(item)
         .values({
            name: data.name,
            locationId: data.locationId,
            quantity: data.quantity,
            unit: data.unit,
         })
         .returning();
   });

export const addLocation = createServerFn()
   .middleware([authMiddleware])
   .validator(
      z.object({
         name: z.string().min(2).max(50),
         type: z.enum(["fridge", "freezer", "pantry", "counter"]),
         houseId: z.number(),
      }),
   )
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
