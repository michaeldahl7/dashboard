import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/dashboard")({
   component: DashboardRoute,
});

function DashboardRoute() {
   return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
            Hello from dashboard
         </div>
      </div>
   );
}
