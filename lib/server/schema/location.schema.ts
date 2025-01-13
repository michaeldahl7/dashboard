import { bigserial, pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { house } from "./house.schema";

// ============= Enums & Types =============
export const locationType = ["fridge", "freezer", "pantry", "counter"] as const;
export type LocationType = (typeof locationType)[number];

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
export type QuantityUnit = (typeof quantityUnits)[number];

export const itemCategories = [
   "dairy",
   "meat",
   "produce",
   "grains",
   "canned",
   "condiments",
   "snacks",
   "beverages",
   "frozen",
   "spices",
   "baking",
   "other",
] as const;
export type ItemCategory = (typeof itemCategories)[number];

// ============= Schemas =============
export const location = pgTable("location", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   type: text("type").notNull().$type<LocationType>(),
   houseId: bigserial("house_id", { mode: "number" })
      .notNull()
      .references(() => house.id),
   description: text("description"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const item = pgTable("item", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   locationId: bigserial("location_id", { mode: "number" })
      .notNull()
      .references(() => location.id),
   category: text("category").$type<ItemCategory>(),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit>(),
   expiryDate: timestamp("expiry_date"),
   openedDate: timestamp("opened_date"),
   purchaseDate: timestamp("purchase_date"),
   brand: text("brand"),
   notes: text("notes"),
   barcode: text("barcode"), // For future barcode scanning
   alertThreshold: real("alert_threshold"), // Minimum quantity before alert
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas
export const LocationSelectSchema = createSelectSchema(location);
export const LocationInsertSchema = createInsertSchema(location);
export const LocationUpdateSchema = createUpdateSchema(location);

export const ItemSelectSchema = createSelectSchema(item);
export const ItemInsertSchema = createInsertSchema(item);
export const ItemUpdateSchema = createUpdateSchema(item);

// Form Schemas (for API validation)
export const LocationFormSchema = z.object({
   name: z.string().min(1).max(50),
   type: z.enum(locationType),
   houseId: z.number(),
   description: z.string().max(200).optional(),
});

export const ItemFormSchema = z.object({
   name: z.string().min(1).max(50),
   locationId: z.number(),
   category: z.enum(itemCategories).optional(),
   quantity: z.number().positive().default(1),
   unit: z.enum(quantityUnits).optional(),
   expiryDate: z.date().optional(),
   openedDate: z.date().optional(),
   purchaseDate: z.date().optional(),
   brand: z.string().max(50).optional(),
   notes: z.string().max(200).optional(),
   barcode: z.string().max(50).optional(),
   alertThreshold: z.number().positive().optional(),
});

// Types
export type SelectLocation = typeof location.$inferSelect;
export type InsertLocation = typeof location.$inferInsert;
export type SelectItem = typeof item.$inferSelect;
export type InsertItem = typeof item.$inferInsert;

// Form types can stay as they are
export type LocationForm = z.infer<typeof LocationFormSchema>;
export type ItemForm = z.infer<typeof ItemFormSchema>;

// Add to your existing types
export interface LocationWithItemCount extends SelectLocation {
   itemCount: number;
}
