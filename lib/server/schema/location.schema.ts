import {
   bigserial,
   pgTable,
   text,
   timestamp,
   boolean,
   integer,
} from "drizzle-orm/pg-core";

import { house } from "./house.schema";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { item } from "./item.schema";

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

export const locationSettings = pgTable("location_settings", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   locationId: integer("location_id")
      .references(() => location.id)
      .notNull(),
   alertEnabled: boolean("alert_enabled").default(true),
   sortOrder: integer("sort_order"),
   isVisible: boolean("is_visible").default(true),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export type LocationSelect = typeof location.$inferSelect;
export type LocationInsert = typeof location.$inferInsert;

export type LocationTypeSelect = typeof locationType.$inferSelect;
export type LocationTypeInsert = typeof locationType.$inferInsert;

export type LocationTemplateSelect = typeof locationTemplate.$inferSelect;
export type LocationTemplateInsert = typeof locationTemplate.$inferInsert;

export type LocationSettingsSelect = typeof locationSettings.$inferSelect;
export type LocationSettingsInsert = typeof locationSettings.$inferInsert;

export const LocationInsertSchema = createInsertSchema(location);

export const locationRelations = relations(location, ({ one, many }) => ({
   house: one(house, {
      fields: [location.houseId],
      references: [house.id],
   }),
   type: one(locationType, {
      fields: [location.typeId],
      references: [locationType.id],
   }),
   items: many(item),
}));

export const locationTypeRelations = relations(locationType, ({ one, many }) => ({
   house: one(house, {
      fields: [locationType.houseId],
      references: [house.id],
   }),
   locations: many(location),
}));

// Default locations to be created for each new house
export const DEFAULT_LOCATIONS = [
   { name: "Main Fridge", type: "fridge" },
   { name: "Freezer", type: "freezer" },
   { name: "Pantry", type: "pantry" },
   { name: "Kitchen Counter", type: "counter" },
] as const;
