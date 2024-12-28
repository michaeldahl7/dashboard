import {
   boolean,
   integer,
   pgTable,
   primaryKey,
   real,
   text,
   timestamp,
} from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ============= Enums & Types =============
export const inventoryTypes = ["fridge", "freezer", "pantry", "counter"] as const;
export type InventoryType = (typeof inventoryTypes)[number];

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

// ============= Inventory Tables =============
export const inventory = pgTable("inventory", {
   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   name: text("name").notNull(),
   type: text("type").notNull().$type<InventoryType>(),
   user_id: integer("user_id")
      .notNull()
      .references(() => user.id),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

export const item = pgTable("item", {
   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   name: text("name").notNull(),
   inventory_id: integer("inventory_id")
      .notNull()
      .references(() => inventory.id),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit>(),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});


// ============= Types =============
// Auth Types
export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;

// Inventory Types
export type SelectInventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;
export type SelectItem = typeof item.$inferSelect;
export type InsertItem = typeof item.$inferInsert;

export const InsertItemSchema = createInsertSchema(item, {
   unit: (schema) => schema.pipe(z.enum(quantityUnits)).nullable().optional(),
});

export const InsertInventorySchema = createInsertSchema(inventory);

// Add form validation schema
export const ItemFormSchema = z.object({
   name: z.string().min(1),
   inventory_id: z.number(),
   quantity: z.number().optional(),
   unit: z.enum(quantityUnits).optional(),
});

// Define form schemas separately from DB schemas
export const InventoryFormSchema = z.object({
   name: z.string().min(1),
   type: z.enum(inventoryTypes),
});

export type InventoryForm = z.infer<typeof InventoryFormSchema>;