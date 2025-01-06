import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth.schema";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const house = pgTable("house", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  owner_id: text("owner_id")
    .notNull()
    .references(() => user.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const houseMember = pgTable("house_member", {
  id: text("id").primaryKey(),
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

export const houseInvite = pgTable("house_invite", {
  id: text("id").primaryKey(),
  house_id: text("house_id")
    .notNull()
    .references(() => house.id),
  invited_email: text("invited_email").notNull(),
  invited_by_id: text("invited_by_id")
    .notNull()
    .references(() => user.id),
  status: text("status").$type<"pending" | "accepted" | "rejected">().notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  expires_at: timestamp("expires_at").notNull(),
});

// Define relations
export const houseRelations = relations(house, ({ many }) => ({
  members: many(houseMember),
  invites: many(houseInvite),
}));

export const houseMemberRelations = relations(houseMember, ({ one }) => ({
  house: one(house, {
    fields: [houseMember.house_id],
    references: [house.id],
  }),
  user: one(user, {
    fields: [houseMember.user_id],
    references: [user.id],
  }),
}));

export const houseInviteRelations = relations(houseInvite, ({ one }) => ({
  house: one(house, {
    fields: [houseInvite.house_id],
    references: [house.id],
  }),
  invitedBy: one(user, {
    fields: [houseInvite.invited_by_id],
    references: [user.id],
  }),
}));

// Add foreign key constraint separately
export const userHouseRelations = relations(user, ({ one }) => ({
  currentHouse: one(house, {
    fields: [user.currentHouseId],
    references: [house.id],
  }),
})); 

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