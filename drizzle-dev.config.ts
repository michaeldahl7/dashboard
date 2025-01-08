// import { defineConfig } from "drizzle-kit";
// import { env } from "~/lib/env/server";

// const isProduction = import.meta.env.PROD; // Check if in production

import type { Config } from "drizzle-kit";

export default  {
  dialect: "postgresql",
  schema: "./lib/server/schema/index.ts",
  driver: "pglite",
  dbCredentials: {
    // or database folder
    url: "./dev-db/"
  },
} satisfies Config;
