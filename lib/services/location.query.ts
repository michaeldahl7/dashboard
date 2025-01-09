// app/services/inventory.query.ts
import {
   queryOptions,
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query";
import { getInventories, getItems, addInventory, addItem } from "./location.api";
import type {
   SelectLocation,
   SelectItem,
   LocationForm,
   ItemForm,
} from "~/lib/server/schema/location.schema";

// Query keys for cache management
export const inventoryKeys = {
   all: ["inventory"] as const,
   lists: () => [...inventoryKeys.all, "list"] as const,
   items: (inventoryId: string) => [...inventoryKeys.all, "items", inventoryId] as const,
};

// Query options
export const inventoryQueryOptions = (houseId: string) => {
   return queryOptions<SelectLocation[]>({
      queryKey: inventoryKeys.lists(),
      queryFn: () => getInventories({ data: houseId }),
   });
};

export const itemsQueryOptions = (inventoryId: string) => {
   return queryOptions<SelectItem[]>({
      queryKey: inventoryKeys.items(inventoryId),
      queryFn: () => getItems({ data: inventoryId }),
   });
};

// Hooks
export const useInventoryQuery = (houseId: string) => {
   return useSuspenseQuery(inventoryQueryOptions(houseId));
};

export const useItemsQuery = (inventoryId: string) => {
   return useSuspenseQuery(itemsQueryOptions(inventoryId));
};

// Mutations
export const useInventoryMutations = () => {
   const queryClient = useQueryClient();

   const invalidateInventory = () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
   };

   const addInventoryMutation = useMutation({
      mutationFn: (data: LocationForm) => addInventory({ data }),
      onSuccess: invalidateInventory,
   });

   const addItemMutation = useMutation({
      mutationFn: (data: ItemForm) => addItem({ data }),
      onSuccess: invalidateInventory,
   });

   return {
      addInventory: addInventoryMutation,
      addItem: addItemMutation,
   };
};
