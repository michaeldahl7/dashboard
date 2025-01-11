import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { env } from "../env/server";
import * as schema from "./schema";

const driver = postgres(env.DATABASE_URL);
export const db = drizzle(driver, { schema });

export type User = typeof schema.user.$inferSelect;
export type InsertUser = typeof schema.user.$inferInsert;

export type House = typeof schema.house.$inferSelect;
export type InsertHouse = typeof schema.house.$inferInsert;

export type Item = typeof schema.item.$inferSelect;
export type InsertItem = typeof schema.item.$inferInsert;

export type Location = typeof schema.location.$inferSelect;
export type InsertLocation = typeof schema.location.$inferInsert;
