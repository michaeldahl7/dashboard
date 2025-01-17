import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { DefaultCatchBoundary } from "~/lib/components/default-catch-boundary";
import { NotFound } from "~/lib/components/not-found";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
   const queryClient = new QueryClient();

   return routerWithQueryClient(
      createTanStackRouter({
         routeTree,
         context: { queryClient },
         defaultPreload: "intent",
         defaultErrorComponent: DefaultCatchBoundary,
         defaultNotFoundComponent: NotFound,
      }),
      queryClient,
   );
}

declare module "@tanstack/react-router" {
   interface Register {
      router: ReturnType<typeof createRouter>;
   }
}
