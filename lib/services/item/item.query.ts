import { useSuspenseQuery } from "@tanstack/react-query";
import { getItems } from "./item.api";

export const itemKeys = {
   all: ["items"] as const,
   byLocation: (locationId: number) => [...itemKeys.all, locationId] as const,
} as const;

export function useItems(locationId: number) {
   return useSuspenseQuery({
      queryKey: itemKeys.byLocation(locationId),
      queryFn: () => getItems({ data: locationId }),
   });
}
