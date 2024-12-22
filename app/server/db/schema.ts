import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

// Storage locations
export const locationTypes = ["fridge", "freezer", "pantry", "counter"] as const;
export type LocationType = (typeof locationTypes)[number];

// Food categories
export const categoryTypes = [
  "dairy",
  "produce",
  "meat",
  "seafood",
  "grains",
  "baked goods",
  "snacks",
  "beverages",
  "condiments",
  "canned goods",
  "spices",
  "other",
] as const;
export type CategoryType = (typeof categoryTypes)[number];

// Units for measurement
export const unitTypes = [
  // Count
  "items",
  "pieces",
  // Weight
  "lbs",
  "oz",
  "grams",
  "kg",
  // Volume
  "cups",
  "ml",
  "liters",
  "fl oz",
  // Package sizes
  "cans",
  "boxes",
  "bags",
  "bottles",
] as const;
export type UnitType = (typeof unitTypes)[number];

// Base table definition
export const foodItems = pgTable("food_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull(),
  name: text().notNull(),
  category: text(),
  location: text().notNull(),
  quantity: real().notNull().default(1),
  unit: text(),
  expiry_date: timestamp(),
  purchased_at: timestamp().defaultNow(),
  notes: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Create base schemas
const insertBaseSchema = createInsertSchema(foodItems);
const selectBaseSchema = createSelectSchema(foodItems);

// Create the final schemas with refined validations
export const insertFoodItemSchema = insertBaseSchema
  .extend({
    name: z.string().min(1, "Name is required"),
    location: z.enum(locationTypes, {
      errorMap: () => ({ message: "Invalid storage location" }),
    }),
    category: z
      .enum(categoryTypes, {
        errorMap: () => ({ message: "Invalid food category" }),
      })
      .optional(),
    unit: z
      .enum(unitTypes, {
        errorMap: () => ({ message: "Invalid unit type" }),
      })
      .optional(),
    expiry_date: z.string().optional(),
    quantity: z.number().positive(),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
  })
  .omit({
    user_id: true,
    created_at: true,
    updated_at: true,
  });

export const updateFoodItemSchema = selectBaseSchema
  .extend({
    location: z.enum(locationTypes).optional(),
    category: z.enum(categoryTypes).optional(),
    unit: z.enum(unitTypes).optional(),
  })
  .partial()
  .omit({
    user_id: true,
    created_at: true,
    updated_at: true,
  });

export type ValidatedInsertFoodItem = z.infer<typeof insertFoodItemSchema>;
export type ValidatedUpdateFoodItem = z.infer<typeof updateFoodItemSchema>;

// ============= Auth Tables =============
export const user = pgTable("user", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  avatar_url: text(),
  email: text().unique().notNull(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
  setup_at: timestamp(),
  terms_accepted_at: timestamp(),
});

export const oauthAccount = pgTable(
  "oauth_account",
  {
    provider_id: text(),
    provider_user_id: text(),
    user_id: integer()
      .notNull()
      .references(() => user.id),
  },
  (table) => [primaryKey({ columns: [table.provider_id, table.provider_user_id] })],
);

export const session = pgTable("session", {
  id: text().primaryKey(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  expires_at: timestamp({
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

// ============= Location Tables =============

export const location = pgTable("location", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  type: text().notNull(), // one of locationTypes
  name: text().notNull(), // e.g., "Main Fridge", "Garage Freezer"
  is_default: boolean().default(false),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const locationZone = pgTable("location_zone", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  location_id: integer()
    .notNull()
    .references(() => location.id),
  name: text().notNull(), // e.g., "Top Shelf", "Crisper Drawer"
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ============= Product & Inventory Tables =============
export const quantityUnits = [
  // Count
  "pieces",
  "items",
  "packs",
  // Weight
  "grams",
  "kg",
  "oz",
  "lbs",
  // Volume
  "ml",
  "liters",
  "fl oz",
  "cups",
  // Package sizes
  "cans",
  "boxes",
  "bags",
  "bottles",
] as const;

export type QuantityUnit = (typeof quantityUnits)[number];

export const product = pgTable("product", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  barcode: text().unique(),
  name: text().notNull(),
  brand: text(),
  default_expiry_days: integer(),
  category: text(),
  storage_instructions: text(),
  created_by_user_id: integer().references(() => user.id),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const inventoryItem = pgTable("inventory_item", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  product_id: integer().references(() => product.id),
  location_id: integer()
    .notNull()
    .references(() => location.id),
  zone_id: integer().references(() => locationZone.id),
  quantity: real().notNull().default(1),
  unit: text(), // one of quantityUnits
  purchased_at: timestamp().defaultNow(),
  expiry_date: timestamp(),
  opened_at: timestamp(),
  notes: text(),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ============= Shopping List Tables =============
export const shoppingList = pgTable("shopping_list", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  name: text().default("Default"),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const shoppingListItem = pgTable("shopping_list_item", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  list_id: integer()
    .notNull()
    .references(() => shoppingList.id),
  product_id: integer().references(() => product.id),
  name: text().notNull(), // Custom name if no product_id
  quantity: real().notNull().default(1),
  unit: text(), // one of quantityUnits
  completed: boolean().default(false),
  created_at: timestamp().defaultNow().notNull(),
  updated_at: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// ============= Usage History Table =============
export const usageHistory = pgTable("usage_history", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => user.id),
  product_id: integer().references(() => product.id),
  action: text().notNull(), // e.g., 'consumed', 'expired', 'discarded'
  quantity: real(),
  performed_at: timestamp().defaultNow().notNull(),
});

// ============= Types =============

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferSelect;
export const userSelectSchema = createSelectSchema(user);
export const userInsertSchema = createInsertSchema(user);
export type Session = typeof session.$inferSelect;
export type Product = typeof product.$inferSelect;
export const productSelectSchema = createSelectSchema(product);
export const productInsertSchema = createInsertSchema(product);
export type SelectProduct = typeof inventoryItem.$inferSelect;
export type InsertProduct = typeof inventoryItem.$inferInsert;
export type Location = typeof location.$inferSelect;
export type LocationZone = typeof locationZone.$inferSelect;
export type SelectInventoryItem = typeof inventoryItem.$inferSelect;
// export type InsertInventoryItem = typeof inventoryItem.$inferInsert;
export type InventoryItem = typeof inventoryItem.$inferSelect;
export const itemInsertSchema = createInsertSchema(inventoryItem, {
  // Omit user_id from validation since it's handled by middleware
  user_id: z.number().optional(),
});
export type ItemInsertSchemaType = z.infer<typeof itemInsertSchema>;
export type InsertInventoryItem = typeof inventoryItem.$inferInsert;
export type ShoppingList = typeof shoppingList.$inferSelect;
export type ShoppingListItem = typeof shoppingListItem.$inferSelect;
export type UsageHistory = typeof usageHistory.$inferSelect;
