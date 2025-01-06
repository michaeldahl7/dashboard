// import { useRouter, useRouteContext } from "@tanstack/react-router";
// import type { OnboardingStep } from "~/lib/server/schema/types";

// export function useOnboarding() {
//   const { user } = useRouteContext();
//   const router = useRouter();

//   const steps: OnboardingStep[] = ["username", "house", "inventory", "completed"];

//   const getCurrentStep = () => {
//     if (!user) return "username";
//     return user.onboardingStep;
//   };

//   const getNextStep = (currentStep: OnboardingStep) => {
//     const currentIndex = steps.indexOf(currentStep);
//     return steps[currentIndex + 1];
//   };

//   const goToNextStep = () => {
//     const currentStep = getCurrentStep();
//     const nextStep = getNextStep(currentStep);
    
//     const stepPaths = {
//       username: '/',
//       house: '/onboarding/house',
//       inventory: '/onboarding/inventory',
//       completed: '/dashboard'
//     };

//     router.navigate({ to: stepPaths[nextStep] });
//   };

//   return {
//     currentStep: getCurrentStep(),
//     isComplete: getCurrentStep() === "completed",
//     goToNextStep,
//   };
// } 