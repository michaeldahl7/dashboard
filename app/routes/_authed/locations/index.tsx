import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from "~/lib/components/ui/card";
import { LuPlus, LuBox } from "react-icons/lu";
import { Skeleton } from "~/lib/components/ui/skeleton";
import { useLocationsWithItems } from "~/lib/services/location.query";
import { useCurrentHouseQuery } from "~/lib/services/house.query";
import { DataTable } from "~/lib/components/ui/data-table";
import { columns } from "~/lib/components/tables/inventory/columns";

export const Route = createFileRoute("/_authed/locations/")({
   component: RouteComponent,
});

function RouteComponent() {
   const { data: currentHouse } = useCurrentHouseQuery();
   const { data: locations, isLoading } = useLocationsWithItems(currentHouse.id);

   return (
      <div className="container mx-auto py-6 px-4">
         <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{currentHouse.name}</h1>
            <Button>
               <LuPlus className="mr-2 h-4 w-4" />
               Add Location
            </Button>
         </div>

         {isLoading ? (
            <LocationsSkeleton />
         ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
               {locations?.map((location) => (
                  <Card
                     key={location.id}
                     className="relative hover:shadow-lg transition-shadow"
                  >
                     <CardHeader>
                        <div className="flex items-center space-x-2">
                           <LuBox className="h-5 w-5 text-muted-foreground" />
                           <CardTitle>{location.name}</CardTitle>
                        </div>
                        <CardDescription>{location.description}</CardDescription>
                     </CardHeader>
                     <CardContent>
                        <DataTable columns={columns} data={location.items} />
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}

function LocationsSkeleton() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {[...Array(6)].map((_, i) => (
            <Card key={i} className="relative">
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
   );
}
