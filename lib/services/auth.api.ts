// import { createServerFn } from "@tanstack/start";
// import { getEvent } from "vinxi/http";
// import type { Auth } from "~/lib/server/auth";

// export const getAuth = createServerFn({ method: "GET" }).handler(
//    async (): Promise<Auth> => {
//       const event = getEvent();

//       return event.context.auth;
//    },
// );

import { createMiddleware } from "@tanstack/start";
import { getWebRequest, setResponseStatus } from "vinxi/http";
import { type Auth, auth } from "~/lib/server/auth";

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const getAuth = createMiddleware().server(async ({ next }) => {
   const { headers } = getWebRequest();

   const session = await auth.api.getSession({ headers });

   const authResult: Auth = !session
      ? { isAuthenticated: false, user: null, session: null }
      : {
           isAuthenticated: true,
           user: session.user,
           session: session.session,
        };

   if (!session) {
      setResponseStatus(401);
      throw new Error("Unauthorized");
   }

   return next({ context: { user: session.user } });
});
