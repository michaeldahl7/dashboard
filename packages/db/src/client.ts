import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { serverEnv as env } from "@munchy/env";
import * as schema from "./schema";

const driver = postgres(env.DATABASE_URL);
export const db = drizzle(driver, { schema });
