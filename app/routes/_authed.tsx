import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/lib/components/ui/sidebar";
import type { User } from "~/lib/server/db";
import {
   currentHouseQueryOptions,
   userHousesQueryOptions,
   defaultHouseQueryOptions,
} from "~/lib/services/house.query";

export const Route = createFileRoute("/_authed")({
   beforeLoad: async ({ context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }

      // Create default house if user doesn't have one
      if (!context.auth.user.currentHouseId) {
         await context.queryClient.ensureQueryData(defaultHouseQueryOptions());
      }

      // Load house data
      await Promise.all([
         context.queryClient.ensureQueryData(currentHouseQueryOptions()),
         context.queryClient.ensureQueryData(userHousesQueryOptions()),
      ]);

      return { user: context.auth.user };
   },
   component: AuthedLayout,
});

function AuthedLayout({ user }: { user: User }) {
   return (
      <SidebarProvider>
         <AppSidebar />
         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
               <SidebarTrigger className="-ml-1" />
            </div>
         </header>
         <Outlet />
      </SidebarProvider>
   );
}
