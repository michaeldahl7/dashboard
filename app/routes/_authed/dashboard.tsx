import { createFileRoute } from "@tanstack/react-router";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "~/lib/components/ui/card";

export const Route = createFileRoute("/_authed/dashboard")({
   component: DashboardRoute,
});

function DashboardRoute() {
   return (
      // <div className="max-w-2xl mx-auto space-y-6">
      //    <Card>
      //       <CardHeader>
      //          <CardTitle>Your Kitchen</CardTitle>
      //          <CardDescription>Start managing your kitchen inventory</CardDescription>
      //       </CardHeader>
      //       <CardContent>
      //          <p className="text-muted-foreground">
      //             Your kitchen dashboard content will go here...
      //          </p>
      //       </CardContent>
      //    </Card>
      // </div>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
         </div>
         <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
      </div>
   );
}
