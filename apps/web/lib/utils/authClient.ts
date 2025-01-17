import { inferAdditionalFields } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "~/lib/env/client";
import type { auth } from "~/lib/utils/auth";

export const authClient = createAuthClient({
   baseURL: "http://localhost:3000",
   plugins: [inferAdditionalFields<typeof auth>(), passkeyClient()],
});
