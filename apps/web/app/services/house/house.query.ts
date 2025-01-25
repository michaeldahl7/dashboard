import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { houseApi } from '~/services/house/house.api';

export const houseKeys = {
  all: ['houses'] as const,
  lists: () => [...houseKeys.all, 'list'] as const,
  current: () => [...houseKeys.all, 'current'] as const,
  default: () => [...houseKeys.all, 'default'] as const,
};

export const getHousesQueryOptions = () =>
  queryOptions({
    queryKey: houseKeys.lists(),
    queryFn: () => houseApi.getAll(),
  });

export const getCurrentHouseQueryOptions = () =>
  queryOptions({
    queryKey: houseKeys.current(),
    queryFn: () => houseApi.getCurrent(),
  });

export const createDefaultHouseQueryOptions = () =>
  queryOptions({
    queryKey: houseKeys.default(),
    queryFn: () => houseApi.createDefault(),
  });

export function useHouses() {
  return useSuspenseQuery(getHousesQueryOptions());
}

export function useCurrentHouse() {
  return useSuspenseQuery(getCurrentHouseQueryOptions());
}

export function useCreateHouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name: string; setAsCurrent?: boolean }) =>
      houseApi.create({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.all });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUpdateHouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { houseId: number; name: string }) =>
      houseApi.update({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.all });
    },
  });
}

export function useSetCurrentHouse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (houseId: number) => houseApi.setCurrent({ data: houseId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.all });
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
