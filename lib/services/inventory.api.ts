// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
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
} from "~/lib/server/db/schema";

export const getInventories = createServerFn()
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return db.select()
      .from(inventory)
      .where(eq(inventory.user_id, context.user.id));
  });

export const getItems = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: inventoryId, context }) => {
    return db
      .select()
      .from(item)
      .where(eq(item.inventory_id, inventoryId));
  });

export const addInventory = createServerFn()
  .middleware([authMiddleware])
  .validator((data: InventoryForm) => InventoryFormSchema.parse(data))
  .handler(async ({ data, context }) => {
    const inventoryData: InsertInventory = {
      ...data,
      user_id: context.user.id,
    };
    
    return db.insert(inventory)
      .values(inventoryData)
      .returning();
  });

export const addItem = createServerFn()
  .middleware([authMiddleware])
  .validator((data: ItemForm) => ItemFormSchema.parse(data))
  .handler(async ({ data }) => {
    const itemData: InsertItem = {
      ...data,
    };
    
    return db.insert(item)
      .values(itemData)
      .returning();
  });