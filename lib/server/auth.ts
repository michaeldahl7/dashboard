import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { passkey } from "better-auth/plugins/passkey";
import { env } from "~/lib/env/server";
import { db } from "~/lib/server/db";

export const auth = betterAuth({
   database: drizzleAdapter(db, {
      provider: "pg",
   }),
   baseURL: env.VITE_APP_BASE_URL,
   socialProviders: {
      discord: {
         clientId: env.DISCORD_CLIENT_ID as string,
         clientSecret: env.DISCORD_CLIENT_SECRET as string,
      },
      google: {
         clientId: env.GOOGLE_CLIENT_ID as string,
         clientSecret: env.GOOGLE_CLIENT_SECRET as string,
      },
   },
   user: {
      additionalFields: {
         currentHouseId: {
            type: "number",
            required: false,
         },
      },
   },
   account: {
      accountLinking: {
         enabled: true,
         trustedProviders: ["google", "discord"],
      },
   },
   plugins: [passkey()],
});

type BetterAuthSession = typeof auth.$Infer.Session;

export type Session = BetterAuthSession["session"];
export type User = BetterAuthSession["user"];

export type Auth =
   | { isAuthenticated: false; user: null; session: null }
   | { isAuthenticated: true; user: User; session: Session };
