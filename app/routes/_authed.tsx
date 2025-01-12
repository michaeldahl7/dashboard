import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { AppHeader } from "~/lib/components/layout/app-header";
import { AppSidebar } from "~/lib/components/layout/app-sidebar";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
} from "~/lib/components/ui/breadcrumb";
import { Separator } from "~/lib/components/ui/separator";
import {
   SidebarInset,
   SidebarProvider,
   SidebarTrigger,
} from "~/lib/components/ui/sidebar";

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
      <SidebarProvider>
         <AppSidebar />
         {/* <SidebarInset> */}
         <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
               <SidebarTrigger className="-ml-1" />

               {/* TODO: Add breadcrumb */}
               {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
               {/* <Breadcrumb>
                     <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                           <BreadcrumbLink href="#">
                              Building Your Application
                           </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                           <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                     </BreadcrumbList>
                  </Breadcrumb> */}
            </div>
         </header>
         <Outlet />
         {/* </SidebarInset> */}
      </SidebarProvider>
   );
}
