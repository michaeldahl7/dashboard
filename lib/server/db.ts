import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePGLite } from "drizzle-orm/pglite";
import postgres from "postgres";
import { env } from "../env/server";
import * as schema from "./schema";

export const table = schema;

const driver = postgres(env.DATABASE_URL);
export const db = drizzlePostgres(driver, { schema });

// function initDb() {
//    if (import.meta.env.PROD) {

//       const driver = postgres(env.DATABASE_URL);
//       const db = drizzlePostgres(driver, { schema });

//       return db;
//    }

//    return drizzlePGLite("./dev-db", { schema });
// }

// export const db = initDb();

export type User = typeof schema.user.$inferSelect;
export type InsertUser = typeof schema.user.$inferInsert;

export type House = typeof schema.house.$inferSelect;
export type Item = typeof schema.item.$inferSelect;
export type Location = typeof schema.location.$inferSelect;
