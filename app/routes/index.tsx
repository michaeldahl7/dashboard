import { createFileRoute, redirect } from "@tanstack/react-router";
import { Homepage } from "~/lib/components/homepage";
import { PublicHeader } from "~/lib/components/layout/public-header";
import { dashboardLinkOptions } from "~/lib/utils";

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
