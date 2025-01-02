import { betterAuth, type Session, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "~/lib/server/db";
import { env } from "~/lib/env/server";

export type Auth =
  | { isAuthenticated: false; user: null; session: null }
  | { isAuthenticated: true; user: User; session: Session };

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: "pg",
   }),
   baseURL: env.VITE_APP_BASE_URL,
   socialProviders: {
      discord: {
         clientId: env.DISCORD_CLIENT_ID,
         clientSecret: env.DISCORD_CLIENT_SECRET,
      },
   },
});
