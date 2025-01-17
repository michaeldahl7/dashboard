import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { PublicHeader } from "~/lib/components/layout/public-header";

export const Route = createFileRoute("/_public")({
   component: PublicLayout,
});

function PublicLayout() {
   return (
      <div className="min-h-screen flex flex-col bg-background">
         <PublicHeader />

         <main className="flex-1">
            <div className="container mx-auto py-6">
               <Outlet />
            </div>
         </main>

      </div>
   );
}
