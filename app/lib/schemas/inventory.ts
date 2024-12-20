import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { inventoryItem, product, location } from "~/server/db/schema";

// Generate base schemas from Drizzle tables
export const insertInventorySchema = createInsertSchema(inventoryItem, {
  // Add refinements for additional validation
  quantity: (schema) => schema.min(0),
  expiry_date: (schema) => schema.min(new Date()),
  notes: (schema) => schema.max(500).optional(),
});

export const selectInventorySchema = createSelectSchema(inventoryItem);
