// app/routes/index.tsx
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import InventoryForm from "~/lib/components/inventory-form";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "~/lib/components/ui/card";

export const Route = createFileRoute("/")({
   component: Home,
});

function Home() {
   const { user } = Route.useRouteContext();

   return (
      <div className="flex flex-col gap-4 p-6">
         <h1 className="text-4xl font-bold">Kitchen Tracker</h1>

         {user ? (
            <div className="flex flex-col gap-2">
               <p>Welcome back, {user.name}!</p>
               <Button asChild className="w-fit" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
               </Button>
               <InventoryForm />
            </div>
         ) : (
            <div>
               <div className="flex flex-col gap-2 mb-6">
                  <p>You are not signed in.</p>
                  <Button type="button" asChild className="w-fit" size="lg">
                     <Link to="/signin">Sign in</Link>
                  </Button>
               </div>
            </div>
         )}
      </div>
   );
}
