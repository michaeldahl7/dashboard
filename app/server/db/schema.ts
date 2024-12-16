import {
  boolean,
  integer,
  json,
  pgTable,
  primaryKey,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

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
export const locationTypes = ["fridge", "freezer", "pantry", "counter"] as const;
export type LocationType = (typeof locationTypes)[number];

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
export type User = typeof user.$inferSelect;
export type Product = typeof product.$inferSelect;
export type Location = typeof location.$inferSelect;
export type LocationZone = typeof locationZone.$inferSelect;
export type InventoryItem = typeof inventoryItem.$inferSelect;
export type ShoppingList = typeof shoppingList.$inferSelect;
export type ShoppingListItem = typeof shoppingListItem.$inferSelect;
export type UsageHistory = typeof usageHistory.$inferSelect;
