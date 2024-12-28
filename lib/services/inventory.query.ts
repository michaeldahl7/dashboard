// app/services/inventory.query.ts
import {
   queryOptions,
   useMutation,
   useQueryClient,
   useSuspenseQuery,
   type QueryKey,
} from "@tanstack/react-query";
import {
   getInventoryItems,
   getInventoryItem,
   addInventoryItem,
   updateInventoryItem,
   deleteInventoryItem,
} from "./inventory.api";
import type { InsertInventoryItem, InventoryItem } from "~/lib/server/db/schema";

// Query Keys
export const inventoryKeys = {
   all: ["inventory"] as const,
   lists: () => [...inventoryKeys.all, "list"] as const,
   list: (filters: string) => [...inventoryKeys.lists(), { filters }] as const,
   details: () => [...inventoryKeys.all, "detail"] as const,
   detail: (id: number) => [...inventoryKeys.details(), id] as const,
};

// Query Options
export const inventoryQueryOptions = () => {
   return queryOptions<InventoryItem[]>({
      queryKey: inventoryKeys.lists(),
      queryFn: async () => {
         const items = await getInventoryItems();
         // Extract just the inventory_item from the response
         return items.map(item => item.inventory_item);
      },
   });
};

export const inventoryItemQueryOptions = (id: number) => {
   return queryOptions<InventoryItem>({
      queryKey: inventoryKeys.detail(id),
      queryFn: () => getInventoryItem({ data: id }),
   });
};

// Queries
export const useInventoryQuery = () => {
   return useSuspenseQuery(inventoryQueryOptions());
};

export const useInventoryItemQuery = (id: number) => {
   return useSuspenseQuery(inventoryItemQueryOptions(id));
};

// Mutations
export const useInventoryMutations = () => {
   const queryClient = useQueryClient();

   const invalidateInventory = () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
   };

   const addItem = useMutation({
      mutationFn: (data: InsertInventoryItem) => addInventoryItem({ data }),
      onSuccess: invalidateInventory,
   });

   const updateItem = useMutation({
      mutationFn: (data: Partial<InsertInventoryItem> & { id: number }) =>
         updateInventoryItem({ data }),
      onSuccess: invalidateInventory,
   });

   const deleteItem = useMutation({
      mutationFn: (id: number) => deleteInventoryItem({ data: id }),
      onSuccess: invalidateInventory,
   });

   return {
      addItem,
      updateItem,
      deleteItem,
   };
};
