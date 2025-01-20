import { inferAdditionalFields } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "~/app/utils/env";
import type { auth } from "@munchy/auth";

export const authClient = createAuthClient({
   baseURL: env.VITE_APP_BASE_URL,
   plugins: [inferAdditionalFields<typeof auth>(), passkeyClient()],
});
