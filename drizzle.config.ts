import type { Config } from "drizzle-kit";

import { env } from "~/lib/env/server";

export default {
   out: "./drizzle",
   schema: "./lib/server/schema/index.ts",
   breakpoints: true,
   dialect: "postgresql",
   dbCredentials: {
      url: env.DATABASE_URL,
   },
} satisfies Config;
