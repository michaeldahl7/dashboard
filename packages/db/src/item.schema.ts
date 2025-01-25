import { relations } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  integer,
  pgTable,
  real,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { house } from './house.schema';
import { location } from './location.schema';

export const quantityUnits = [
  'pieces',
  'items',
  'packs',
  'grams',
  'kg',
  'oz',
  'lbs',
  'ml',
  'liters',
  'fl oz',
  'cups',
] as const;
export type QuantityUnit = (typeof quantityUnits)[number];

export const itemCategories = [
  'dairy',
  'meat',
  'produce',
  'grains',
  'canned',
  'condiments',
  'snacks',
  'beverages',
  'frozen',
  'spices',
  'baking',
  'other',
] as const;
export type ItemCategory = (typeof itemCategories)[number];

export const itemCategory = pgTable('item_category', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  isDefault: boolean('is_default').default(false).notNull(),
  houseId: integer('house_id').references(() => house.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const item = pgTable('item', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  name: text('name').notNull(),
  quantity: real('quantity').notNull(),
  unit: text('unit', { enum: quantityUnits }).$type<QuantityUnit>().notNull(),
  brand: text('brand'),
  expiryDate: timestamp('expiry_date'),
  locationId: integer('location_id').references(() => location.id),
  categoryId: integer('category_id').references(() => itemCategory.id),
  houseId: integer('house_id')
    .references(() => house.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  alertThreshold: integer('alert_threshold'),
});

export type ItemSelect = typeof item.$inferSelect;
export type ItemInsert = typeof item.$inferInsert;

export const itemRelations = relations(item, ({ one }) => ({
  location: one(location, {
    fields: [item.locationId],
    references: [location.id],
  }),
}));
