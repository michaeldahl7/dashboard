import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { env } from "~/lib/env/client";
import type { auth } from "~/lib/server/auth";
import { passkeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
   baseURL: env.VITE_APP_BASE_URL, // the base url of your auth server
   plugins: [inferAdditionalFields<typeof auth>(), passkeyClient()],
});
