import { useSuspenseQuery } from "@tanstack/react-query";
import { getItemCategories } from "./category.api";

export const categoryKeys = {
   all: ["categories"] as const,
   byHouse: (houseId: number) => [...categoryKeys.all, houseId] as const,
} as const;

export function useItemCategories(houseId: number) {
   return useSuspenseQuery({
      queryKey: categoryKeys.byHouse(houseId),
      queryFn: () => getItemCategories({ data: houseId }),
   });
}
