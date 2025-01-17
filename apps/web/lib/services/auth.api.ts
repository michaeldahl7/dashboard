import { getWebRequest } from "vinxi/http";

import { createServerFn } from "@tanstack/start";
import { type Auth, auth } from "~/lib/utils/auth";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
   console.log("getAuth");
   const { headers } = getWebRequest();
   console.log("headers", headers);
   const session = await auth.api.getSession({ headers });
   console.log("session", session);
   const authResult: Auth = !session
      ? { isAuthenticated: false, user: null, session: null }
      : {
           isAuthenticated: true,
           user: session.user,
           session: session.session,
        };

   return authResult;
});
