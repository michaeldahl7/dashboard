import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getAuth } from "~/lib/services/auth.api";

export const authQueryOptions = () =>
   queryOptions({
      queryKey: ["getAuth"],
      queryFn: () => getAuth(),
   });

export const useAuthQuery = () => {
   return useSuspenseQuery(authQueryOptions());
};
