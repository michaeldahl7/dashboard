import { defineConfig } from "drizzle-kit";
import { env } from "~/lib/env/server";

export default defineConfig({
   out: "./drizzle",
   schema: "./lib/server/schema/index.ts",
   breakpoints: true,
   dialect: "postgresql",
   dbCredentials: {
      url: env.DATABASE_URL,
   },
});
