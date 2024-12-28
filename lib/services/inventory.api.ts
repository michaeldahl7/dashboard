// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
   inventory,
   item,
   InsertInventorySchema,
   InsertItemSchema,
   type InsertInventory,
   type InsertItem,
} from "~/lib/server/db/schema";

export const getInventories = createServerFn()
   .middleware([authMiddleware])
   .handler(async () => {
      return db.select().from(inventory);
   });

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: inventoryId }) => {
      return db
         .select()
         .from(item)
         .where(eq(item.inventory_id, inventoryId));
   });

const inventoryTypeEnum = z.enum(["fridge", "freezer", "pantry", "counter"]);

export const addInventory = createServerFn()
   .middleware([authMiddleware])
   .validator((data: unknown) => InsertInventorySchema.parse(data))
   .handler(async ({ data }) => {
      return db.insert(inventory).values(data as InsertInventory).returning();
   });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator((data: unknown) => InsertItemSchema.parse(data))
   .handler(async ({ data }) => {
      return db.insert(item).values(data as InsertItem).returning();
   });
