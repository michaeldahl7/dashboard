import { type Auth, auth } from '@munchy/auth';
import { createMiddleware } from '@tanstack/start';
import { getWebRequest, setResponseStatus } from 'vinxi/http';

/**
 * Middleware to force authentication on a server function, and add the user to the context.
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const { headers } = getWebRequest();

  const session = await auth.api.getSession({ headers });

  const authResult: Auth = session
    ? {
        isAuthenticated: true,
        user: session.user,
        session: session.session,
      }
    : { isAuthenticated: false, user: null, session: null };

  if (!authResult.isAuthenticated) {
    setResponseStatus(401);
    throw new Error('Unauthorized');
  }

  return next({ context: { auth: authResult } });
});
