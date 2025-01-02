import {
   serial,
   boolean,
   pgTable,
   real,
   text,
   timestamp,
   integer,
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

export const user = pgTable("user", {
   id: text().primaryKey(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("email_verified").notNull(),
   image: text("image"),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});

export const session = pgTable("session", {
   id: text().primaryKey(),
   expiresAt: timestamp("expires_at").notNull(),
   token: text("token").notNull().unique(),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
   ipAddress: text("ip_address"),
   userAgent: text("user_agent"),
   userId: text("user_id")
      .notNull()
      .references(() => user.id),
});

export const account = pgTable("account", {
   id: text().primaryKey(),
   accountId: text("account_id").notNull(),
   providerId: text("provider_id").notNull(),
   userId: text("user_id")
      .notNull()
      .references(() => user.id),
   accessToken: text("access_token"),
   refreshToken: text("refresh_token"),
   idToken: text("id_token"),
   accessTokenExpiresAt: timestamp("access_token_expires_at"),
   refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
   scope: text("scope"),
   password: text("password"),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
   id: text().primaryKey(),
   identifier: text("identifier").notNull(),
   value: text("value").notNull(),
   expiresAt: timestamp("expires_at").notNull(),
   createdAt: timestamp("created_at"),
   updatedAt: timestamp("updated_at"),
});

export const house = pgTable("house", {
   id: text().primaryKey(),
   name: text("name").notNull(),
   owner_id: text("owner_id")
      .notNull()
      .references(() => user.id),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

export const houseMember = pgTable("house_member", {
   id: text().primaryKey(),
   house_id: text("house_id")
      .notNull()
      .references(() => house.id),
   user_id: text("user_id")
      .notNull()
      .references(() => user.id),
   role: text("role").$type<"admin" | "member">().default("member"),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

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
   inventory_id: z.string(),
   quantity: z.number().positive().default(1),
   unit: z.enum(quantityUnits).optional(),
});

export type ItemForm = z.infer<typeof ItemFormSchema>;

// Auth Types
export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;

export const InsertItemSchema = createInsertSchema(item, {
   unit: (schema) => schema.pipe(z.enum(quantityUnits)).nullable().optional(),
});

export const InsertInventorySchema = createInsertSchema(inventory);

export const HouseSchema = createSelectSchema(house);
export const HouseMemberSchema = createSelectSchema(houseMember);

export const HouseFormSchema = z.object({
   name: z.string().min(1),
});

export type SelectHouse = typeof house.$inferSelect;
export type InsertHouse = typeof house.$inferInsert;
export type SelectHouseMember = typeof houseMember.$inferSelect;
export type InsertHouseMember = typeof houseMember.$inferInsert;
export type HouseForm = z.infer<typeof HouseFormSchema>;
