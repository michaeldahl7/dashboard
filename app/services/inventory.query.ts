import {
  queryOptions,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  //   getInventoryItems,
  addInventoryItem,
  //   updateInventoryItem,
  //   deleteInventoryItem,
} from "./inventory.api";
import type { InsertInventoryInput, UpdateInventoryInput } from "./inventory.schema";

import {
  itemInsertSchema,
  type InventoryItem,
  type InsertInventoryItem,
  type ValidatedInsertFoodItem,
} from "~/server/db/schema";

// export const inventoryQueryOptions = () =>
//   queryOptions({
//     queryKey: ["inventory"],
//     queryFn: () => getInventoryItems(),
//   });

// export const useInventoryQuery = () => {
//   return useSuspenseQuery(inventoryQueryOptions());
// };

export const useInventoryMutations = () => {
  const queryClient = useQueryClient();
  const invalidateInventory = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory"] });
  };

  const addItem = useMutation({
    mutationFn: (data: ValidatedInsertFoodItem) => addInventoryItem({ data }),
    onSuccess: invalidateInventory,
  });

  //   const updateItem = useMutation({
  //     mutationFn: ({ id, data }: UpdateInventoryInput) =>
  //       updateInventoryItem({ data: { id, data } }),
  //     onSuccess: invalidateInventory,
  //   });

  //   const deleteItem = useMutation({
  //     mutationFn: (id: number) => deleteInventoryItem({ data: id }),
  //     onSuccess: invalidateInventory,
  //   });

  return { addItem }; // updateItem, deleteItem
};
