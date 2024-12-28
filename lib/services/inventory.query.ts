// app/services/inventory.query.ts
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getInventories, getItems, addInventory, addItem } from "./inventory.api";
import type { InsertInventory, InsertItem, SelectItem, InventoryForm } from "~/lib/server/db/schema";
import type { inventory } from "~/lib/server/db/schema";

type Inventory = typeof inventory.$inferSelect;

export const inventoryKeys = {
   all: ["inventory"] as const,
   lists: () => [...inventoryKeys.all, "list"] as const,
   items: (inventoryId: number) => [...inventoryKeys.all, "items", inventoryId] as const,
};

export const inventoryQueryOptions = () => {
   return queryOptions<Inventory[]>({
      queryKey: inventoryKeys.lists(),
      queryFn: () => getInventories(),
   });
};

export const itemsQueryOptions = (inventoryId: number) => {
   return queryOptions<SelectItem[]>({
      queryKey: inventoryKeys.items(inventoryId),
      queryFn: () => getItems({ data: inventoryId }),
   });
};

export const useInventoryQuery = () => {
   return useSuspenseQuery(inventoryQueryOptions());
};

export const useItemsQuery = (inventoryId: number) => {
   return useSuspenseQuery(itemsQueryOptions(inventoryId));
};


export const useInventoryMutations = () => {
   const queryClient = useQueryClient();

   const invalidateInventory = () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
   };

   const addInventoryMutation = useMutation({
      mutationFn: (data: InventoryForm) => addInventory({ data }),
      onSuccess: invalidateInventory,
   });

   const addItemMutation = useMutation({
      mutationFn: (data: InsertItem) => addItem({ data }),
      onSuccess: invalidateInventory,
   });

   return { addInventory: addInventoryMutation, addItem: addItemMutation };
};
