import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

const driver = postgres(process.env.DATABASE_URL as string);

export const db = drizzle({ client: driver, schema });
export const table = schema;

export type User = typeof schema.user.$inferSelect;
export type House = typeof schema.house.$inferSelect;
export type Inventory = typeof schema.inventory.$inferSelect;
export type Item = typeof schema.item.$inferSelect;
