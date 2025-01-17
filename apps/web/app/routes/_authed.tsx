import { Link, Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import {
   Breadcrumb,
   BreadcrumbList,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbSeparator,
   BreadcrumbPage,
} from "~/lib/components/ui/breadcrumb";
import { Separator } from "~/lib/components/ui/separator";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "~/lib/components/ui/sidebar";
import type { User } from "~/lib/server/db";



export const Route = createFileRoute("/_authed")({
   beforeLoad: async ({ context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }

   },
   component: AuthedLayout,
});

function AuthedLayout() {
   return (
      <SidebarProvider>
         <AppSidebar />
         <SidebarInset>
      <div>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
               <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />    
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <Breadcrumb>
                     <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                           <BreadcrumbLink asChild>
                              <Link to="/dashboard">Dashboard</Link>
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                     </BreadcrumbList>
                  </Breadcrumb>
               </div>
            </header>
            <Outlet />
         </div>
         </SidebarInset>
      </SidebarProvider>
   );
}
