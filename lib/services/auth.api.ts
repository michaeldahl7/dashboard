import { getWebRequest } from "vinxi/http";

import { createServerFn } from "@tanstack/start";
import { type Auth, auth } from "~/lib/server/auth";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
   const { headers } = getWebRequest();
   const session = await auth.api.getSession({ headers });
   const authResult: Auth = !session
      ? { isAuthenticated: false, user: null, session: null }
      : {
           isAuthenticated: true,
           user: session.user,
           session: session.session,
        };

   return authResult;
});
