import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "~/lib/components/layout/app-header";

import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "~/lib/components/ui/sidebar";

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
      <div className="flex flex-col min-h-screen">
         <AppHeader />
         <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />
            <Outlet />
         </SidebarProvider>
      </div>
   );
}
