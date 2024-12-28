// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
   inventoryItem,
   location,
   insertInventorySchema,
   type InsertInventoryItem,
} from "~/lib/server/db/schema";

export const getInventoryItems = createServerFn()
   .middleware([authMiddleware])
   .handler(async () => {
      return db.select().from(inventoryItem).leftJoin(location, eq(inventoryItem.location_id, location.id));
   });

export const getInventoryItem = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: id }) => {
      return db
         .select()
         .from(inventoryItem)
         .where(eq(inventoryItem.id, id))
         .then((rows) => rows[0]);
   });

export const addInventoryItem = createServerFn()
   .middleware([authMiddleware])
   .validator((data: unknown) => insertInventorySchema.parse(data))
   .handler(async ({ data }) => {
      return db
         .insert(inventoryItem)
         .values(data)
         .returning()
         .then((rows) => rows[0]);
   });

export const updateInventoryItem = createServerFn()
   .middleware([authMiddleware])
   .validator(
      insertInventorySchema.partial().extend({
         id: z.number(),
      }),
   )
   .handler(async ({ data }) => {
      const { id, ...updates } = data;
      return db
         .update(inventoryItem)
         .set(updates)
         .where(eq(inventoryItem.id, id))
         .returning()
         .then((rows) => rows[0]);
   });

export const deleteInventoryItem = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: id }) => {
      return db
         .delete(inventoryItem)
         .where(eq(inventoryItem.id, id))
         .returning()
         .then((rows) => rows[0]);
   });
