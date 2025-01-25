import type { auth } from '@munchy/auth';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { passkeyClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from '~/utils/env';

export const authClient = createAuthClient({
  baseURL: env.VITE_APP_BASE_URL,
  plugins: [inferAdditionalFields<typeof auth>(), passkeyClient()],
});
