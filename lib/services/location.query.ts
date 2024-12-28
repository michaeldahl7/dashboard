import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getLocations } from "./location.api"; // You'll need to create this
import type { Location } from "~/lib/server/db/schema";

export const locationKeys = {
   all: ["locations"] as const,
};

export const locationsQueryOptions = () => {
   return queryOptions<Location[]>({
      queryKey: locationKeys.all,
      queryFn: () => getLocations(),
   });
};

export const useLocationsQuery = () => {
   return useSuspenseQuery(locationsQueryOptions());
}; 