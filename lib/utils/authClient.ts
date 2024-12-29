import { createAuthClient } from "better-auth/react";
import { env } from "~/lib/env/client";
export const authClient = createAuthClient({
   baseURL: env.VITE_APP_BASE_URL, // the base url of your auth server
});
