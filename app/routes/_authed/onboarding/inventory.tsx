import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { InventoryForm } from "~/lib/components/onboarding/inventory-form";
import { updateOnboardingStep } from "~/lib/services/user.api";

export const Route = createFileRoute('/_authed/onboarding/inventory')({
  component: InventoryOnboardingRoute,
  beforeLoad: ({ context }) => {
    const { user } = context.auth;
    if (!user) throw redirect({ to: '/signup' });
    if (user.onboardingStep !== "inventory") {
      throw redirect({ 
        to: user.onboardingStep === "completed" ? "/dashboard" : 
           user.onboardingStep === "house" ? "/onboarding/house" : "/"
      });
    }
    return { user };
  },
});

function InventoryOnboardingRoute() {
  const { user } = Route.useRouteContext();

  const onInventoryCreated = async () => {
    await updateOnboardingStep({
      data: {
        userId: user.id,
        step: "completed"
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Your Storage</CardTitle>
          <CardDescription>
            Add storage locations in your kitchen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryForm 
            userId={user.id}
            houseId={user.currentHouseId!}
            onSuccess={onInventoryCreated}
          />
        </CardContent>
      </Card>
    </div>
  );
} 