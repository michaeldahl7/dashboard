/// <reference types="vite/client" />

import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// Server-side env
export const serverEnv = createEnv({
   server: {
      DATABASE_URL: z.string(),
      APP_BASE_URL: z.string().min(1),
      BETTER_AUTH_SECRET: z.string().min(1),
      // OAuth
      DISCORD_CLIENT_ID: z.string().min(1),
      DISCORD_CLIENT_SECRET: z.string().min(1),
      GITHUB_CLIENT_ID: z.string().min(1),
      GITHUB_CLIENT_SECRET: z.string().min(1),
      GOOGLE_CLIENT_ID: z.string().min(1),
      GOOGLE_CLIENT_SECRET: z.string().min(1),
   },
   runtimeEnv: process.env,
   skipValidation: process.env.NODE_ENV === "development",
});

// Client-side env
export const clientEnv = createEnv({
   clientPrefix: "VITE_",
   client: {
      VITE_APP_BASE_URL: z.string().min(1),
   },
   runtimeEnv: import.meta.env,
   skipValidation: process.env.NODE_ENV === "development",
   emptyStringAsUndefined: true,
});
