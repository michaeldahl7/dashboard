import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import { drizzle as drizzlePGLite } from "drizzle-orm/pglite";
// import { PGlite } from '@electric-sql/pglite';
import postgres from "postgres";
import { env } from "../env/server";

import * as schema from "./schema";

// const driver = postgres(process.env.DATABASE_URL as string);

// export const db = drizzle({ client: driver, schema });
export const table = schema;

async function initDb() {
   if (import.meta.env.PROD) {
      return drizzlePostgres(postgres(env.DATABASE_URL), { schema });
   }
   // return drizzlePGLite("./dev-db", { schema });
   console.log("DEVVVVVV")
   // const client = new PGlite("./dev-db");
   const db = drizzlePGLite("./dev-db", { schema });
   return db;
}


export const db = initDb();

export type User = typeof schema.user.$inferSelect;
export type House = typeof schema.house.$inferSelect;
export type Inventory = typeof schema.inventory.$inferSelect;
export type Item = typeof schema.item.$inferSelect;
