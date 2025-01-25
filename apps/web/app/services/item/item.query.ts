import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type { z } from 'zod';
import { type addItemSchema, itemApi } from '~/services/item/item.api';

export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
};

export const getItemsQueryOptions = () =>
  queryOptions({
    queryKey: itemKeys.lists(),
    queryFn: () => itemApi.getAll(),
  });

export function useItems() {
  return useSuspenseQuery(getItemsQueryOptions());
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: z.infer<typeof addItemSchema>) =>
      itemApi.create({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
    },
  });
}
