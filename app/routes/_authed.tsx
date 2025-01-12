import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/lib/components/ui/sidebar";
import type { User } from "~/lib/server/db";
import {
   currentHouseQueryOptions,
   defaultHouseQueryOptions,
   userHousesQueryOptions,
} from "~/lib/services/house.query";

export const Route = createFileRoute("/_authed")({
   beforeLoad: async ({ context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }

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
      <>
         <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <Outlet />
         </SidebarProvider>
      </>
   );
}
