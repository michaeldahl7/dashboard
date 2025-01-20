import {
   useSuspenseQuery,
   queryOptions,
   useMutation,
   useQueryClient,
} from "@tanstack/react-query";
import { categoryApi } from "~/app/services/item/category/category.api";

export const categoryKeys = {
   all: ["categories"] as const,
   lists: () => [...categoryKeys.all, "list"] as const,
   byHouse: (houseId: number) => [...categoryKeys.all, "house", houseId] as const,
};

export const getCategoriesQueryOptions = (houseId: number) =>
   queryOptions({
      queryKey: categoryKeys.byHouse(houseId),
      queryFn: () => categoryApi.getAll({ data: houseId }),
   });

export function useCategories(houseId: number) {
   return useSuspenseQuery(getCategoriesQueryOptions(houseId));
}

export function useCreateCategory() {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (input: { name: string; description?: string; houseId: number }) =>
         categoryApi.create({ data: input }),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      },
   });
}
