// app/services/inventory.schema.ts
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { inventoryItem } from "~/server/db/schema";

// Base schemas from Drizzle
export const insertInventorySchema = createInsertSchema(inventoryItem, {
  quantity: (schema) => schema.positive(),
  expiry_date: (schema) => schema.optional(),
  notes: (schema) => schema.max(500).optional(),
});

export const updateInventorySchema = z.object({
  id: z.number(),
  data: insertInventorySchema.partial(),
});

export const deleteInventorySchema = z.number();

export type InsertInventoryInput = z.infer<typeof insertInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type DeleteInventoryInput = z.infer<typeof deleteInventorySchema>;
