import { bigserial, pgTable, real, text, timestamp, json } from "drizzle-orm/pg-core";
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
   type: text("type").$type<LocationType | null>(),
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
   category: text("category").$type<ItemCategory | null>(),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit | null>(),
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
// export const LocationInsertSchema = createInsertSchema(location, {
//    type: z.enum(locationType).nullable().default(null),
//    houseId: z.number().min(1),
// });
// export const LocationUpdateSchema = createUpdateSchema(location, {
//    type: z.enum(locationType).nullable(),
// });

export type LocationSelect = typeof location.$inferSelect;
export type LocationInsert = typeof location.$inferInsert;

export const ItemSelectSchema = createSelectSchema(item);
export const ItemInsertSchema = createInsertSchema(item);
export const ItemUpdateSchema = createUpdateSchema(item);
// export const ItemInsertSchema = createInsertSchema(item, {
//    category: z.enum(itemCategories).nullable(),
//    unit: z.enum(quantityUnits).nullable(),
// });
// export const ItemUpdateSchema = createUpdateSchema(item, {
//    category: z.enum(itemCategories).nullable(),
//    unit: z.enum(quantityUnits).nullable(),
// });

export type ItemSelect = typeof item.$inferSelect;
export type ItemInsert = typeof item.$inferInsert;
