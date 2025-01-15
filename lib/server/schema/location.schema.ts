import {
   bigserial,
   pgTable,
   real,
   text,
   timestamp,
   boolean,
   integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

import { house } from "./house.schema";

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
export const locationTemplate = pgTable("location_template", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   type: text("type"),
   isDefault: boolean("is_default").default(false).notNull(),
   description: text("description"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const locationType = pgTable("location_type", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   isDefault: boolean("is_default").default(false).notNull(),
   houseId: integer("house_id").references(() => house.id),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const location = pgTable("location", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   typeId: bigserial("type_id", { mode: "number" })
      .references(() => locationType.id)
      .notNull(),
   houseId: bigserial("house_id", { mode: "number" })
      .notNull()
      .references(() => house.id),
   description: text("description"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
   templateId: integer("template_id").references(() => locationTemplate.id),
   isCustom: boolean("is_custom").default(false).notNull(),
});

export const itemCategory = pgTable("item_category", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   description: text("description"),
   isDefault: boolean("is_default").default(false).notNull(),
   houseId: integer("house_id").references(() => house.id),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const item = pgTable("item", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   locationId: integer("location_id")
      .notNull()
      .references(() => location.id),
   categoryId: integer("category_id").references(() => itemCategory.id),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit | null>(),
   expiryDate: timestamp("expiry_date"),
   openedDate: timestamp("opened_date"),
   purchaseDate: timestamp("purchase_date"),
   brand: text("brand"),
   notes: text("notes"),
   barcode: text("barcode"),
   alertThreshold: real("alert_threshold"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const locationSettings = pgTable("location_settings", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   locationId: integer("location_id")
      .references(() => location.id)
      .notNull(),
   defaultUnit: text("default_unit").$type<QuantityUnit | null>(),
   alertEnabled: boolean("alert_enabled").default(true),
   sortOrder: integer("sort_order"),
   isVisible: boolean("is_visible").default(true),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod Schemas
export const LocationSelectSchema = createSelectSchema(location);
export const LocationInsertSchema = createInsertSchema(location);
export const LocationUpdateSchema = createUpdateSchema(location);

export type LocationSelect = typeof location.$inferSelect;
export type LocationInsert = typeof location.$inferInsert;

export const ItemSelectSchema = createSelectSchema(item);
export const ItemInsertSchema = createInsertSchema(item);
export const ItemUpdateSchema = createUpdateSchema(item);

export type ItemSelect = typeof item.$inferSelect;
export type ItemInsert = typeof item.$inferInsert;

export type LocationTypeSelect = typeof locationType.$inferSelect;
