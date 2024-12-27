import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_KEY: z.string().min(1),
    VITE_API_URIL: z.string()
  },
  runtimeEnv: import.meta.env,
});
