import { pgTable, real, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
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

// Categories for organizing items
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
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   type: text("type").notNull().$type<LocationType>(),
   house_id: text("house_id")
      .notNull()
      .references(() => house.id),
   description: text("description"),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

export const item = pgTable("item", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   location_id: text("location_id")
      .notNull()
      .references(() => location.id),
   category: text("category").$type<ItemCategory>(),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit>(),
   expiry_date: timestamp("expiry_date"),
   opened_date: timestamp("opened_date"),
   purchase_date: timestamp("purchase_date"),
   brand: text("brand"),
   notes: text("notes"),
   barcode: text("barcode"), // For future barcode scanning
   alert_threshold: real("alert_threshold"), // Minimum quantity before alert
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

// Form Schemas
export const LocationFormSchema = z.object({
   name: z.string().min(1).max(50),
   type: z.enum(locationType),
   houseId: z.string(),
   description: z.string().max(200).optional(),
});

export const ItemFormSchema = z.object({
   name: z.string().min(1).max(50),
   locationId: z.string(),
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
export type LocationForm = z.infer<typeof LocationFormSchema>;
export type ItemForm = z.infer<typeof ItemFormSchema>;
export type SelectLocation = typeof location.$inferSelect;
export type InsertLocation = typeof location.$inferInsert;
export type SelectItem = typeof item.$inferSelect;
export type InsertItem = typeof item.$inferInsert;
