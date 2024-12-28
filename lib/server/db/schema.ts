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
export const locationTypes = ["fridge", "freezer", "pantry", "counter"] as const;
export type LocationType = (typeof locationTypes)[number];

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
export const location = pgTable("location", {
   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   name: text("name").notNull(),
   type: text("type").notNull().$type<LocationType>(),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

export const inventoryItem = pgTable("inventory_item", {
   id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
   name: text("name").notNull(),
   location_id: integer("location_id")
      .notNull()
      .references(() => location.id),
   quantity: real("quantity").notNull().default(1),
   unit: text("unit").$type<QuantityUnit>(),
   expiry_date: timestamp("expiry_date"),
   notes: text("notes"),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

// ============= Zod Schemas =============
export const insertLocationSchema = createInsertSchema(location, {
   type: z.enum(locationTypes, {
      errorMap: () => ({ message: "Invalid location type" }),
   }),
});

export const insertInventorySchema = createInsertSchema(inventoryItem, {
   unit: z
      .enum(quantityUnits, {
         errorMap: () => ({ message: "Invalid unit type" }),
      })
      .optional(),
   quantity: z.number().positive("Quantity must be positive"),
   name: z.string().min(1, "Name is required"),
   expiry_date: z.date().optional().nullable(),
   notes: z.string().max(500, "Notes cannot exceed 500 characters").optional().nullable(),
   location_id: z.number({
      required_error: "Location is required",
   })
});

// ============= Types =============
// Auth Types
export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export type Session = typeof session.$inferSelect;

// Inventory Types
export type Location = typeof location.$inferSelect;
export type InsertLocation = typeof location.$inferInsert;
export type InventoryItem = typeof inventoryItem.$inferSelect;
export type InsertInventoryItem = z.infer<typeof insertInventorySchema>;

// Response Types
export type GetInventoryItemsResponse = {
   id: number;
   name: string;
   location: { id: number; name: string; type: LocationType };
   quantity: number;
   unit: QuantityUnit | null;
   expiry_date: Date | null;
   notes: string | null;
   created_at: Date;
}[];
