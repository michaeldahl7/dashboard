import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter, ErrorComponentProps } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { DefaultCatchBoundary } from "~/lib/components/default-catch-boundary";
// import { NotFound } from "~/lib/components/not-found";
import { routeTree } from "./routeTree.gen";
import { Typography } from "~/lib/components/ui/typography";

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


function PendingComponent() {
   return (
     <div className='space-y-6 p-6'>
       <Typography.H1>
         Loading...
       </Typography.H1>
     </div>
   )
 }
 
//  function ErrorComponent({ error }: ErrorComponentProps) {
//    return (
//      <Document>
//        <div className='space-y-6 p-6'>
//          <Typography.H1>
//            Error
//          </Typography.H1>
//          <p className='text-destructive'>
//            {error.message}
//          </p>
//        </div>
//      </Document>
//    )
//  }
 
 function NotFoundComponent() {
   return (
     <div className='space-y-6'>
       <Typography.H1>
         404 Not Found
       </Typography.H1>
     </div>
   )
 }

 import { Link } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";

export function NotFound() {
  return (
    <div className="space-y-2 p-2">
      <p>The page you are looking for does not exist.</p>
      <p className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => window.history.back()}>
          Go back
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">Home</Link>
        </Button>
      </p>
    </div>
  );
}