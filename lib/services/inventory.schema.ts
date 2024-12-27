// app/services/inventory.schema.ts
import { z } from "zod";

// Enums
export const quantityUnits = [
   "pieces",
   "items",
   "packs",
   "grams",
   "kg",
   "oz",
   "lbs",
   "ml",
   "liters",
   "fl oz",
   "cups",
] as const;

export const locationTypes = ["fridge", "freezer", "pantry", "counter"] as const;

// Base schema
export const inventoryItemSchema = z.object({
   id: z.number().optional(),
   name: z.string().min(1, "Name is required"),
   location_id: z.number(),
   quantity: z.number().positive("Quantity must be positive"),
   unit: z.enum(quantityUnits).optional(),
   expiry_date: z.date().nullable(),
   notes: z.string().max(500).nullable(),
});

// Insert schema (omit id and timestamps)
export const insertInventorySchema = inventoryItemSchema.omit({ id: true });

// Update schema (all fields optional except id)
export const updateInventorySchema = inventoryItemSchema.partial().required({ id: true });

// Types
export type InventoryItem = z.infer<typeof inventoryItemSchema>;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;
export type UpdateInventoryItem = z.infer<typeof updateInventorySchema>;
