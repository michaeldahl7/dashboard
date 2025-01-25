import { getWebRequest } from 'vinxi/http';

import { type Auth, auth } from '@munchy/auth';
import { createServerFn } from '@tanstack/start';

export const getAuth = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('getAuth');
  const { headers } = getWebRequest();
  console.log('headers', headers);
  const session = await auth.api.getSession({ headers });
  console.log('session', session);
  const authResult: Auth = session
    ? {
        isAuthenticated: true,
        user: session.user,
        session: session.session,
      }
    : { isAuthenticated: false, user: null, session: null };

  return authResult;
});
