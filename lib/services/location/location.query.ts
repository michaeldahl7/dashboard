import { useSuspenseQuery } from "@tanstack/react-query";
import { getLocations, getLocationSettings } from "./location.api";
import { getLocationTypes } from "./type.api";

export const locationKeys = {
   all: ["locations"] as const,
   byHouse: (houseId: number) => [...locationKeys.all, houseId] as const,
   types: (houseId: number) => [...locationKeys.all, "types", houseId] as const,
   settings: (locationId: number) =>
      [...locationKeys.all, locationId, "settings"] as const,
} as const;

export function useLocations(houseId: number) {
   return useSuspenseQuery({
      queryKey: locationKeys.byHouse(houseId),
      queryFn: () => getLocations({ data: houseId }),
   });
}

export function useLocationTypes(houseId: number) {
   return useSuspenseQuery({
      queryKey: locationKeys.types(houseId),
      queryFn: () => getLocationTypes({ data: houseId }),
   });
}

export function useLocationSettings(locationId: number) {
   return useSuspenseQuery({
      queryKey: locationKeys.settings(locationId),
      queryFn: () => getLocationSettings({ data: locationId }),
   });
}
