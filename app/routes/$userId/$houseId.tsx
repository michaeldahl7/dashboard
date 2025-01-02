import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { HouseSelector } from "~/lib/components/house-selector";
import { authQueryOptions } from "~/lib/services/auth.query";

export const Route = createFileRoute('/$userId/$houseId')({
  component: HouseDashboard,
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(authQueryOptions())
    return { user }
  },
});

function HouseDashboard() {
  const { user } = Route.useLoaderData()
  return (
    <div className="flex items-center gap-4">
      <HouseSelector userId={user.id} />
      {/* rest of component */}
    </div>
  );
} 