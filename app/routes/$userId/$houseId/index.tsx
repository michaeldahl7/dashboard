import { createFileRoute, redirect } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { HouseSelector } from "~/lib/components/house-selector";
import { authClient } from "~/lib/utils/authClient";

export const Route = createFileRoute("/$userId/$houseId/")({
  component: HouseDashboard,
  loader: async ({ params, context }) => {
    if (!context.user) {
      throw redirect({ to: "/signin" });
    }
    // Validate user has access to this house
    return { 
      userId: params.userId,
      houseId: params.houseId,
      user: context.user
    };
  },
});

function HouseDashboard() {
  const { user } = Route.useRouteContext();
  const { userId, houseId } = Route.useLoaderData();
  
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">House Dashboard</h1>
        <div className="flex items-center gap-4">
          <HouseSelector userId={userId} />
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
      </div>

      {/* House content here */}
    </div>
  );
} 