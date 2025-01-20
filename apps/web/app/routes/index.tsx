import { createFileRoute, redirect } from "@tanstack/react-router";
import { Homepage } from "~/app/components/homepage";
import { PublicHeader } from "~/app/components/layout/public-header";
import { dashboardLinkOptions } from "~/app/utils";

export const Route = createFileRoute("/")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect(dashboardLinkOptions);
      }
   },
   component: LandingPage,
});

function LandingPage() {
   return (
      <div className="min-h-screen flex flex-col bg-background">
          <PublicHeader />
         <Homepage />
      </div>
   );
}
