import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/lib/components/ui/card";
import { LuPlus, LuBox } from "react-icons/lu";
import { Skeleton } from "~/lib/components/ui/skeleton";
import { useLocations } from "~/lib/services/location/location.query";
import { useItems } from "~/lib/services/item/item.query";
import { DataTable } from "~/lib/components/ui/data-table";
import { columns } from "~/lib/components/tables/inventory/columns";
import type { LocationWithItems } from "~/lib/server/schema/types";

export const Route = createFileRoute("/_authed/locations/")({
   component: LocationsPage,
   loader: async ({ context }) => {
      const currentHouse = context.auth.user!.currentHouseId;
      return { currentHouse };
   },
});

function LocationsPage() {
   const { currentHouse } = Route.useLoaderData();

   if (!currentHouse) {
      return (
         <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <div className="text-center">
               <h2 className="text-2xl font-semibold tracking-tight">
                  No House Selected
               </h2>
               <p className="text-muted-foreground mt-2">
                  Please select or create a house to view locations
               </p>
            </div>
         </div>
      );
   }

   const { data: locations, isLoading: locationsLoading } = useLocations(currentHouse);

   if (locationsLoading) return <LocationsSkeleton />;

   return (
      <div className="container mx-auto py-6 px-4">
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {locations?.map((location) => (
               <LocationCard key={location.id} location={location} />
            ))}
         </div>
      </div>
   );
}

function LocationCard({ location }: { location: LocationWithItems }) {
   const { data: items } = useItems();
   const filteredItems = items?.filter((item) => item.location.id === location.id);

   return (
      <Card className="relative hover:shadow-lg transition-shadow">
         <CardHeader>
            <div className="flex items-center space-x-2">
               <LuBox className="h-5 w-5 text-muted-foreground" />
               <CardTitle>{location.name}</CardTitle>
            </div>
         </CardHeader>
         <CardContent>
            {!filteredItems?.length ? (
               <EmptyState />
            ) : (
               <DataTable columns={columns} data={filteredItems} />
            )}
         </CardContent>
      </Card>
   );
}

function EmptyState() {
   return (
      <div className="text-center py-6">
         <h3 className="text-sm text-muted-foreground mb-4">Empty</h3>
         <Button variant="secondary" size="sm">
            <LuPlus className="mr-2 h-4 w-4" />
            Add Item
         </Button>
      </div>
   );
}

function LocationsSkeleton() {
   return (
      <div className="container mx-auto py-6 px-4">
         <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {["fridge", "freezer", "pantry", "counter"].map((type) => (
               <Card key={`skeleton-${type}`} className="relative">
                  <CardHeader className="space-y-2">
                     <Skeleton className="h-4 w-1/2" />
                     <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                     <Skeleton className="h-4 w-1/4 mb-2" />
                     <Skeleton className="h-4 w-1/3" />
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}
