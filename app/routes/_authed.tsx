import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "~/lib/components/layout/app-header";

export const Route = createFileRoute("/_authed")({
   component: AuthedLayout,
   beforeLoad: ({ context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }
      return { user: context.auth.user };
   },
});

function AuthedLayout() {
   return (
      <div className="min-h-screen flex flex-col bg-background">
         <AppHeader />

         <div className="flex flex-1">
            <Outlet />
            {/* <main className="flex-1 lg:ml-[300px] p-6"> */}

            {/* </main> */}
         </div>
      </div>
   );
}
