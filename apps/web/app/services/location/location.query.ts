import {
   useSuspenseQuery,
   useMutation,
   useQueryClient,
   queryOptions,
} from "@tanstack/react-query";
import { locationApi } from "~/services/location/location.api";
import type { LocationInsert } from "@munchy/db/schema";

export const locationKeys = {
   all: ["locations"] as const,
   lists: () => [...locationKeys.all, "list"] as const,
   byHouse: (houseId: number) => [...locationKeys.all, "house", houseId] as const,
   settings: (locationId: number) =>
      [...locationKeys.all, "settings", locationId] as const,
   types: (houseId: number) => [...locationKeys.all, "types", houseId] as const,
};

export const getLocationsQueryOptions = (houseId: number) =>
   queryOptions({
      queryKey: locationKeys.byHouse(houseId),
      queryFn: () => locationApi.getAll({ data: houseId }),
   });

export function useLocations(houseId: number) {
   return useSuspenseQuery(getLocationsQueryOptions(houseId));
}

export function useLocationTypes(houseId: number) {
   return useSuspenseQuery({
      queryKey: locationKeys.types(houseId),
      queryFn: () => locationApi.getLocationTypes({ data: houseId }),
   });
}

export function useLocationSettings(locationId: number) {
   return useSuspenseQuery({
      queryKey: locationKeys.settings(locationId),
      queryFn: () => locationApi.getSettings({ data: locationId }),
   });
}

export function useCreateLocation() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (input: LocationInsert) => locationApi.create({ data: input }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: locationKeys.all });
      },
   });
}
