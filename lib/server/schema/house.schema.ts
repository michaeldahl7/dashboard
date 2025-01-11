import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth.schema";
import type { UserRole, InviteStatus } from "./types";

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
      .references(() => house.id, { onDelete: "cascade" }),
   user_id: text("user_id")
      .notNull()
      .references(() => user.id),
   role: text("role").$type<UserRole>().default("member"),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
});

export const houseInvite = pgTable("house_invite", {
   id: text("id").primaryKey(),
   house_id: text("house_id")
      .notNull()
      .references(() => house.id, { onDelete: "cascade" }),
   inviter_id: text("inviter_id")
      .notNull()
      .references(() => user.id),
   invitee_email: text("invitee_email").notNull(),
   status: text("status").$type<InviteStatus>().default("pending"),
   role: text("role").$type<UserRole>().default("member"),
   created_at: timestamp("created_at").defaultNow().notNull(),
   updated_at: timestamp("updated_at").defaultNow(),
   expires_at: timestamp("expires_at").notNull(),
});

// Define relations
export const houseRelations = relations(house, ({ many, one }) => ({
   members: many(houseMember),
   owner: one(user, {
      fields: [house.owner_id],
      references: [user.id],
   }),
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
   inviter: one(user, {
      fields: [houseInvite.inviter_id],
      references: [user.id],
   }),
}));

// Schemas for validation
export const HouseFormSchema = z.object({
   name: z.string().min(2).max(50),
});

export const HouseMemberFormSchema = z.object({
   userId: z.string(),
   role: z.enum(["admin", "member"]),
});

export const HouseInviteFormSchema = z.object({
   houseId: z.string(),
   email: z.string().email(),
   role: z.enum(["admin", "member"]),
});

// Types
export type SelectHouse = typeof house.$inferSelect;
export type InsertHouse = typeof house.$inferInsert;
export type SelectHouseMember = typeof houseMember.$inferSelect;
export type InsertHouseMember = typeof houseMember.$inferInsert;
export type HouseForm = z.infer<typeof HouseFormSchema>;
export type HouseMemberForm = z.infer<typeof HouseMemberFormSchema>;
export type HouseInviteForm = z.infer<typeof HouseInviteFormSchema>;
export type SelectHouseInvite = typeof houseInvite.$inferSelect;
export type InsertHouseInvite = typeof houseInvite.$inferInsert;
