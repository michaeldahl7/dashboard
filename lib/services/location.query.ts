// app/services/inventory.query.ts
import {
   queryOptions,
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query";
import type {
   ItemForm,
   LocationForm,
   SelectItem,
   SelectLocation,
} from "~/lib/server/schema/location.schema";
import {
   addInventory,
   addItem,
   getInventories,
   getItems,
   getLocationsWithItemCount,
} from "./location.api";

// Query keys for cache management
export const locationKeys = {
   all: ["location"] as const,
   lists: () => [...locationKeys.all, "list"] as const,
   detail: (id: number) => [...locationKeys.all, "detail", id] as const,
};

// Query options
export const locationsQueryOptions = (houseId: number) =>
   queryOptions({
      queryKey: locationKeys.lists(),
      queryFn: () => getLocationsWithItemCount({ data: houseId }),
   });

// Query hooks
export const useLocationsQuery = (houseId: number) => {
   return useSuspenseQuery(locationsQueryOptions(houseId));
};

// Query keys for cache management
export const inventoryKeys = {
   all: ["inventory"] as const,
   lists: () => [...inventoryKeys.all, "list"] as const,
   items: (inventoryId: string) => [...inventoryKeys.all, "items", inventoryId] as const,
};

// Query options
export const inventoryQueryOptions = (houseId: number) => {
   return queryOptions<SelectLocation[]>({
      queryKey: inventoryKeys.lists(),
      queryFn: () => getInventories({ data: houseId }),
   });
};

export const itemsQueryOptions = (inventoryId: number) => {
   return queryOptions<SelectItem[]>({
      queryKey: inventoryKeys.items(inventoryId.toString()),
      queryFn: () => getItems({ data: inventoryId }),
   });
};

// Hooks
export const useInventoryQuery = (houseId: number) => {
   return useSuspenseQuery(inventoryQueryOptions(houseId));
};

export const useItemsQuery = (inventoryId: number) => {
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
