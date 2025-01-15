import { relations } from "drizzle-orm";
import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { ulid } from "ulid";
import { z } from "zod";
import { user } from "./auth.schema";
import type { InviteStatus, UserRole } from "./types";

export const house = pgTable("house", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   name: text("name").notNull(),
   ownerId: text("owner_id")
      .notNull()
      .references(() => user.id),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const houseMember = pgTable("house_member", {
   id: bigserial("id", { mode: "number" }).primaryKey(),
   houseId: bigserial("house_id", { mode: "number" }).references(() => house.id),
   userId: text("user_id")
      .notNull()
      .references(() => user.id),
   role: text("role").$type<UserRole>().notNull().default("member"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const houseInvite = pgTable("house_invite", {
   id: text("id")
      .$defaultFn(() => ulid())
      .primaryKey(),
   houseId: bigserial("house_id", { mode: "number" })
      .notNull()
      .references(() => house.id),
   inviterId: text("inviter_id")
      .notNull()
      .references(() => user.id),
   inviteeEmail: text("invitee_email").notNull(),
   status: text("status").$type<InviteStatus>().default("pending"),
   role: text("role").$type<UserRole>().default("member"),
   createdAt: timestamp("created_at").defaultNow().notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
   expiresAt: timestamp("expires_at").notNull(),
});

export const houseRelations = relations(house, ({ many, one }) => ({
   members: many(houseMember),
   owner: one(user, {
      fields: [house.ownerId],
      references: [user.id],
   }),
}));

export const houseMemberRelations = relations(houseMember, ({ one }) => ({
   house: one(house, {
      fields: [houseMember.houseId],
      references: [house.id],
   }),
   user: one(user, {
      fields: [houseMember.userId],
      references: [user.id],
   }),
}));

export const houseInviteRelations = relations(houseInvite, ({ one }) => ({
   house: one(house, {
      fields: [houseInvite.houseId],
      references: [house.id],
   }),
   inviter: one(user, {
      fields: [houseInvite.inviterId],
      references: [user.id],
   }),
}));

// Zod Schemas
export const HouseSelectSchema = createSelectSchema(house);
export const HouseInsertSchema = createInsertSchema(house);
export const HouseUpdateSchema = createUpdateSchema(house);

export const HouseMemberSelectSchema = createSelectSchema(houseMember);
export const HouseMemberInsertSchema = createInsertSchema(houseMember);
export const HouseMemberUpdateSchema = createUpdateSchema(houseMember);

export const HouseInviteSelectSchema = createSelectSchema(houseInvite);
export const HouseInviteInsertSchema = createInsertSchema(houseInvite);
export const HouseInviteUpdateSchema = createUpdateSchema(houseInvite);

// Form Schemas (for API validation)
export const HouseFormSchema = z.object({
   name: z.string().min(2).max(50),
});

export const HouseMemberFormSchema = z.object({
   userId: z.string(),
   role: z.enum(["admin", "member"]),
});

export const HouseInviteFormSchema = z.object({
   houseId: z.number(),
   email: z.string().email(),
   role: z.enum(["admin", "member"]),
});

// Types
export type SelectHouse = typeof house.$inferSelect;
export type InsertHouse = typeof house.$inferInsert;

export type SelectHouseMember = typeof houseMember.$inferSelect;
export type InsertHouseMember = typeof houseMember.$inferInsert;

export type SelectHouseInvite = typeof houseInvite.$inferSelect;
export type InsertHouseInvite = typeof houseInvite.$inferInsert;

// Form types can stay as they are
export type HouseForm = z.infer<typeof HouseFormSchema>;
export type HouseMemberForm = z.infer<typeof HouseMemberFormSchema>;
export type HouseInviteForm = z.infer<typeof HouseInviteFormSchema>;
