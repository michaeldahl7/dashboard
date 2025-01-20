import { createFileRoute, redirect } from "@tanstack/react-router";
import { Homepage } from "~/app/components/homepage";
import { PublicHeader } from "~/app/components/layout/public-header";
import { dashboardLinkOptions } from "~/app/utils";
import { Button } from "@munchy/ui/components/ui/button";

export const Route = createFileRoute("/")({
   // beforeLoad: ({ context }) => {
   //    if (context.auth.isAuthenticated) {
   //       throw redirect(dashboardLinkOptions);
   //    }
   // },
   component: LandingPage,
});

function LandingPage() {
   return (
      <div className="min-h-screen flex flex-col bg-background">
         {/* <Button>Hello</Button> */}
          <PublicHeader />
         <Homepage />
      </div>
   );
}
