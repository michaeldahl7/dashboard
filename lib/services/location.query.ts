// app/services/inventory.query.ts
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getLocationsWithItems } from "./location.api";
import type { LocationWithItems } from "~/lib/server/schema/types";

export const locationKeys = {
   all: ["locations"] as const,
   byHouse: (houseId: number) => [...locationKeys.all, houseId] as const,
} as const;

export function useLocationsWithItems(houseId: number) {
   return useSuspenseQuery<LocationWithItems[]>({
      queryKey: locationKeys.byHouse(houseId),
      queryFn: () => getLocationsWithItems({ data: houseId }),
   });
}
