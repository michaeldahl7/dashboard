import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { env } from "../env/server";
import * as schema from "./schema";

const driver = postgres(env.DATABASE_URL);
export const db = drizzle(driver, { schema });

export type User = typeof schema.user.$inferSelect;
export type NewUser = typeof schema.user.$inferInsert;


