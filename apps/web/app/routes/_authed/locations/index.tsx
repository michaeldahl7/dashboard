import { Button } from '@munchy/ui/components/ui/button';
import { Card, CardContent, CardHeader } from '@munchy/ui/components/ui/card';
import { Skeleton } from '@munchy/ui/components/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { LuPlus } from 'react-icons/lu';
import { useItems } from '~/services/item/item.query';
import { useLocations } from '~/services/location/location.query';

export const Route = createFileRoute('/_authed/locations/')({
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
          <h2 className="font-semibold text-2xl tracking-tight">
            No House Selected
          </h2>
          <p className="mt-2 text-muted-foreground">
            Please select or create a house to view locations
          </p>
        </div>
      </div>
    );
  }

  const { data: locations, isLoading: locationsLoading } =
    useLocations(currentHouse);

  if (locationsLoading) return <LocationsSkeleton />;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {locations?.map((location) => (
          // <LocationCard key={location.id} location={location} />
          <div key={location.id}>{location.name}</div>
        ))}
      </div>
    </div>
  );
}

function LocationCard() {
  const { data: items } = useItems();
  // const filteredItems = items?.filter((item) => item.location.id === location.id);

  return <div>LocationCard</div>;
}

function EmptyState() {
  return (
    <div className="py-6 text-center">
      <h3 className="mb-4 text-muted-foreground text-sm">Empty</h3>
      <Button variant="secondary" size="sm">
        <LuPlus className="mr-2 h-4 w-4" />
        Add Item
      </Button>
    </div>
  );
}

function LocationsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {['fridge', 'freezer', 'pantry', 'counter'].map((type) => (
          <Card key={`skeleton-${type}`} className="relative">
            <CardHeader className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="mb-2 h-4 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
