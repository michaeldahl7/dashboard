import { Link, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { authClient } from "~/lib/utils/authClient";

export const Route = createFileRoute("/")({
   component: Home,
});

function Home() {
   const { user } = Route.useRouteContext();

   return (
      <div className="flex flex-col gap-4 p-6">
         <h1 className="text-4xl font-bold">TanStarter</h1>
         <div className="flex items-center gap-2">
            This is an unprotected page:
            <pre className="rounded-md border bg-card p-1 text-card-foreground">
               routes/index.tsx
            </pre>
         </div>

         {user ? (
            <div className="flex flex-col gap-2">
               <p>Welcome back, {user?.name}!</p>
               <Button type="button" asChild className="w-fit" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
               </Button>
               <div>
                  More data:
                  <pre>{JSON.stringify(user, null, 2)}</pre>
               </div>

               <Button
                  onClick={() => {
                     authClient.signOut().then(() => {
                        window.location.reload();
                        window.location.href = "/";
                     });
                  }}
                  className="w-fit"
                  variant="destructive"
                  size="lg"
               >
                  Sign out
               </Button>
            </div>
         ) : (
            <div className="flex flex-col gap-2">
               <p>You are not signed in.</p>
               <Button type="button" asChild className="w-fit" size="lg">
                  <Link to="/signin">Sign in</Link>
               </Button>
            </div>
         )}
      </div>
   );
}

// import { AddInventoryForm } from "~/lib/components/inventory-form";
// import { ItemForm } from "~/lib/components/item-form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";
// <Tabs defaultValue="inventory" className="w-full max-w-2xl">
//    <TabsList className="grid w-full grid-cols-2">
//       <TabsTrigger value="inventory">Add Inventory</TabsTrigger>
//       <TabsTrigger value="item">Add Item</TabsTrigger>
//    </TabsList>
//    <TabsContent value="inventory">
//       <AddInventoryForm />
//    </TabsContent>
//    <TabsContent value="item">
//       <ItemForm />
//    </TabsContent>
// </Tabs>
