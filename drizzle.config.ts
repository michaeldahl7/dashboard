import type { Config } from "drizzle-kit";

import { env } from "~/env/server";

export default {
  out: "./drizzle",
  schema: "./app/server/db/schema.ts",
  breakpoints: true,
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
} satisfies Config;
