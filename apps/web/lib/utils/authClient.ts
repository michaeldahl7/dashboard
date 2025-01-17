import { inferAdditionalFields } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "~/lib/env/client";
import type { auth } from "~/lib/server/auth";

export const authClient = createAuthClient({
   baseURL: env.VITE_APP_BASE_URL,
   plugins: [inferAdditionalFields<typeof auth>(), passkeyClient()],
});
