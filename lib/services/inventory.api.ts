// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { ulid } from "ulid";
import { z } from "zod";
import { db } from "~/lib/server/db";
import { eq } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
   inventory,
   item,
   InventoryFormSchema,
   ItemFormSchema,
   type InsertInventory,
   type InsertItem,
   type InventoryForm,
   type ItemForm,
} from "~/lib/server/schema/inventory.schema";

export const getInventories = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: houseId }) => {
      return db.select()
         .from(inventory)
         .where(eq(inventory.house_id, houseId));
   });

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.string())
   .handler(async ({ data: inventoryId, context }) => {
      return db.select().from(item).where(eq(item.inventory_id, inventoryId));
   });

export const addInventory = createServerFn()
   .middleware([authMiddleware])
   .validator((data: InventoryForm) => InventoryFormSchema.parse(data))
   .handler(async ({ data }) => {
      const inventoryData: InsertInventory = {
         id: ulid(),
         name: data.name,
         type: data.type,
         house_id: data.houseId,
      };
      return db.insert(inventory).values(inventoryData).returning();
   });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator((data: ItemForm) => ItemFormSchema.parse(data))
   .handler(async ({ data }) => {
      const itemData: InsertItem = {
         id: ulid(),
         name: data.name,
         inventory_id: data.inventoryId,
         quantity: data.quantity,
         unit: data.unit,
      };

      return db.insert(item).values(itemData).returning();
   });
