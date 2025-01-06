import { createFileRoute, redirect } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { UsernameForm } from "~/lib/components/onboarding/username-form";
import { updateOnboardingStep } from "~/lib/services/user.api";
import type { OnboardingStep } from "~/lib/server/schema/types";
import { HouseForm } from "~/lib/components/onboarding/house-form";
import { InventoryForm } from "~/lib/components/onboarding/inventory-form";

const ONBOARDING_PATHS: Record<OnboardingStep, string> = {
  username: '/',
  house: '/onboarding/house',
  inventory: '/onboarding/inventory',
  completed: '/dashboard'
} as const;

export const Route = createFileRoute('/')({
  component: IndexRoute,
  beforeLoad: ({ context }) => {
    const { user } = context.auth;
    if (!user) throw redirect({ to: '/signup' });
    
    // Redirect if not on username step
    if (user.onboardingStep !== "username") {
      const nextPath = ONBOARDING_PATHS[user.onboardingStep as OnboardingStep];
      throw redirect({ to: nextPath });
    }

    return { user };
  },
});

function IndexRoute() {
  const { user } = Route.useRouteContext();

  const onStepComplete = async (nextStep: OnboardingStep) => {
    await updateOnboardingStep({
      data: {
        userId: user.id,
        step: nextStep
      }
    });
  };

  const renderStep = () => {
    switch (user.onboardingStep) {
      case "username":
        return {
          title: "Welcome!",
          description: "Let's get started by choosing your username",
          form: <UsernameForm 
            userId={user.id} 
            onSuccess={() => onStepComplete("house")} 
          />
        };
      case "house":
        return {
          title: "Set Up Your Kitchen",
          description: "Create your first house to get started",
          form: <HouseForm 
            userId={user.id} 
            onSuccess={() => onStepComplete("inventory")} 
          />
        };
      case "inventory":
        return {
          title: "Set Up Your Inventory",
          description: "Add your storage locations",
          form: <InventoryForm 
            userId={user.id}
            houseId={user.currentHouseId!}
            onSuccess={() => onStepComplete("completed")} 
          />
        };
      default:
        throw redirect({ to: '/dashboard' });
    }
  };

  const { title, description, form } = renderStep();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {form}
        </CardContent>
      </Card>
    </div>
  );
}
