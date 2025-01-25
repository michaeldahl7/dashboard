import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

import { getAuth } from '~/services/auth.api';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  current: () => [...authKeys.all, 'current'] as const,
};

// Query options
export const currentAuthQueryOptions = () =>
  queryOptions({
    queryKey: authKeys.current(),
    queryFn: async () => {
      const auth = await getAuth();
      if (!auth.user) {
        throw new Error('Not authenticated');
      }
      return auth;
    },
  });

// Query hooks
export function useCurrentAuthQuery() {
  return useSuspenseQuery(currentAuthQueryOptions());
}
