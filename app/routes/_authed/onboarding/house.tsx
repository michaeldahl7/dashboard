import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { HouseForm } from "~/lib/components/onboarding/house-form";
import { updateOnboardingStep } from "~/lib/services/user.api";
import type { OnboardingStep } from "~/lib/server/schema/types";

export const Route = createFileRoute('/_authed/onboarding/house')({
  component: HouseOnboardingRoute,
  beforeLoad: ({ context }) => {
    const { user } = context.auth;
    if (!user) throw redirect({ to: '/signup' });
    if (user.onboardingStep !== "house") {
      throw redirect({ 
        to: user.onboardingStep === "username" ? "/" : "/onboarding/inventory" 
      });
    }
    return { user };
  },
});

function HouseOnboardingRoute() {
  const { user } = Route.useRouteContext();

  const onHouseCreated = async () => {
    await updateOnboardingStep({
      data: {
        userId: user.id,
        step: "inventory"
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set Up Your Kitchen</CardTitle>
          <CardDescription>
            Create your first house to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HouseForm 
            userId={user.id} 
            onSuccess={onHouseCreated} 
          />
        </CardContent>
      </Card>
    </div>
  );
} 