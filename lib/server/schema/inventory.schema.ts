import { pgTable, real, text, timestamp } from "drizzle-orm/pg-core";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import type { user } from "~/lib/server/schema/auth.schema";
import { house } from "~/lib/server/schema/house.schema";

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


export const inventory = pgTable("inventory", {
   id: text().primaryKey(),
   name: text("name").notNull(),
   type: text("type").notNull().$type<InventoryType>(),
   house_id: text("house_id")
      .notNull()
      .references(() => house.id),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

// 2. Generate base Drizzle types
export type SelectInventory = typeof inventory.$inferSelect;
export type InsertInventory = typeof inventory.$inferInsert;

// 3. Create Zod schemas with refinements
// Schema for database operations (includes all fields)
export const InventorySchema = createSelectSchema(inventory);

// Schema for form input (excludes system-managed fields)
export const InventoryFormSchema = z.object({
   name: z.string().min(1),
   type: z.enum(inventoryTypes),
   houseId: z.string(),
});

// 4. Generate types from Zod schemas
export type InventoryForm = z.infer<typeof InventoryFormSchema>;

export const item = pgTable("item", {
   id: text().primaryKey(),
   name: text("name").notNull(),
   inventory_id: text("inventory_id")
      .notNull()
      .references(() => inventory.id),
   quantity: real("quantity").default(1).notNull(),
   unit: text("unit").$type<QuantityUnit>(),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

// With other type definitions
export type SelectItem = typeof item.$inferSelect;
export type InsertItem = typeof item.$inferInsert;

// Database schema (full record validation)
export const ItemSchema = createSelectSchema(item);

// Form schema (user input validation)
export const ItemFormSchema = z.object({
   name: z.string().min(1),
   inventoryId: z.string(),
   quantity: z.number().positive().default(1),
   unit: z.enum(quantityUnits).optional(),
});

export type ItemForm = z.infer<typeof ItemFormSchema>;

// Auth Types
export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;

export const InsertItemSchema = createInsertSchema(item, {
   unit: (schema) => schema.pipe(z.enum(quantityUnits)).nullable().optional(),
});

export const InsertInventorySchema = createInsertSchema(inventory);



// Add validation schema for username
export const UsernameFormSchema = z.object({
   username: z
      .string()
      .min(3)
      .max(20)
      .regex(
         /^[a-z0-9-]+$/,
         "Username can only contain lowercase letters, numbers, and dashes",
      ),
});

export type UsernameForm = z.infer<typeof UsernameFormSchema>;
