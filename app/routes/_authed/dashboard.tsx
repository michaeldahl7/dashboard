import { createFileRoute, redirect } from "@tanstack/react-router";
import { createInitialHouseOptions } from "~/lib/services/house.query";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "~/lib/components/ui/card";

export const Route = createFileRoute("/_authed/dashboard")({
   component: DashboardRoute,
   beforeLoad: async ({ context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }

      if (!context.auth.user.currentHouseId) {
         await context.queryClient.ensureQueryData(createInitialHouseOptions());
      }

      return { user: context.auth.user };
   },
});

function DashboardRoute() {
   return (
      <div className="max-w-2xl mx-auto space-y-6">
         <Card>
            <CardHeader>
               <CardTitle>Your Kitchen</CardTitle>
               <CardDescription>Start managing your kitchen inventory</CardDescription>
            </CardHeader>
            <CardContent>
               <p className="text-muted-foreground">
                  Your kitchen dashboard content will go here...
               </p>
            </CardContent>
         </Card>
      </div>
   );
}
