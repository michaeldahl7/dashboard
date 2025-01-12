import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const user = pgTable("user", {
   id: text("id").primaryKey(),
   name: text("name").notNull(),
   email: text("email").notNull().unique(),
   emailVerified: boolean("email_verified").notNull(),
   image: text("image"),
   currentHouseId: text("current_house_id"),
   onboardingStep: text("onboarding_step").notNull(),
   createdAt: timestamp("created_at").notNull(),
   updatedAt: timestamp("updated_at").defaultNow(),
});

export const session = pgTable("session", {
   id: text("id").primaryKey(),
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
   id: text("id").primaryKey(),
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
   id: text("id").primaryKey(),
   identifier: text("identifier").notNull(),
   value: text("value").notNull(),
   expiresAt: timestamp("expires_at").notNull(),
   createdAt: timestamp("created_at"),
   updatedAt: timestamp("updated_at"),
});

export const passkey = pgTable("passkey", {
   id: text("id").primaryKey(),
   name: text("name"),
   publicKey: text("public_key").notNull(),
   userId: text("user_id")
      .notNull()
      .references(() => user.id),
   credentialID: text("credential_i_d").notNull(),
   counter: integer("counter").notNull(),
   deviceType: text("device_type").notNull(),
   backedUp: boolean("backed_up").notNull(),
   transports: text("transports"),
   createdAt: timestamp("created_at"),
});

// Zod Schemas
export const UserSelectSchema = createSelectSchema(user);
export const UserInsertSchema = createInsertSchema(user);
export const UserUpdateSchema = createUpdateSchema(user);

export const SessionSelectSchema = createSelectSchema(session);
export const SessionInsertSchema = createInsertSchema(session);
export const SessionUpdateSchema = createUpdateSchema(session);

export const AccountSelectSchema = createSelectSchema(account);
export const AccountInsertSchema = createInsertSchema(account);
export const AccountUpdateSchema = createUpdateSchema(account);

// Types
export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export type SelectSession = typeof session.$inferSelect;
export type InsertSession = typeof session.$inferInsert;
export type SelectAccount = typeof account.$inferSelect;
export type InsertAccount = typeof account.$inferInsert;
