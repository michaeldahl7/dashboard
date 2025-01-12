import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
   server: {
      DATABASE_URL: z.string(),
      DISCORD_CLIENT_ID: z.string().min(1),
      DISCORD_CLIENT_SECRET: z.string().min(1),
      VITE_APP_BASE_URL: z.string().min(1),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
   },
   runtimeEnv: process.env,
});
