import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "~/lib/components/layout/app-header";
import { SidebarProvider } from "~/lib/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import { SidebarTrigger } from "~/lib/components/ui/sidebar";

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
         {/* <AppHeader /> */}
         <SidebarProvider>
            <AppSidebar />
            <main>
               <SidebarTrigger />
               <Outlet />
            </main>
         </SidebarProvider>
      </div>
   );
}
