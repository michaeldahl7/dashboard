import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOnboardingStatus, updateOnboardingStep, checkUsername } from "./user.api";
import type { OnboardingStep } from "~/lib/server/schema/types";

export const useUpdateOnboardingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOnboardingStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateOnboardingStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOnboardingStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useCheckUsername = () => {
  return useMutation({
    mutationFn: checkUsername
  });
};