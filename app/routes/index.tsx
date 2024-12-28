// app/routes/index.tsx
import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { AddInventoryForm } from "~/lib/components/inventory-form";
import { ItemForm } from "~/lib/components/item-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";

export const Route = createFileRoute("/")({
   component: Home,
});

function Home() {
   const { user } = Route.useRouteContext();

   return (
      <div className="flex flex-col gap-4 p-6">
         <h1 className="text-4xl font-bold">Kitchen Tracker</h1>

         {user ? (
            <div className="flex flex-col gap-4">
               <p>Welcome back, {user.name}!</p>
               
               <Tabs defaultValue="inventory" className="w-full max-w-2xl">
                  <TabsList className="grid w-full grid-cols-2">
                     <TabsTrigger value="inventory">Add Inventory</TabsTrigger>
                     <TabsTrigger value="item">Add Item</TabsTrigger>
                  </TabsList>
                  <TabsContent value="inventory">
                     <AddInventoryForm />
                  </TabsContent>
                  <TabsContent value="item">
                     <ItemForm />
                  </TabsContent>
               </Tabs>

               <Button asChild className="w-fit" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
               </Button>
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
