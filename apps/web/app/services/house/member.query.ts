import type { houseMember } from '@munchy/db/schema';
import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { memberApi } from '~/services/house/member.api';
type UserRole = typeof houseMember.$inferSelect.role;

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  byHouse: (houseId: number) => [...memberKeys.all, 'house', houseId] as const,
};

export const getMembersQueryOptions = (houseId: number) =>
  queryOptions({
    queryKey: memberKeys.byHouse(houseId),
    queryFn: () => memberApi.getAll({ data: houseId }),
  });

export function useMembers(houseId: number) {
  return useSuspenseQuery(getMembersQueryOptions(houseId));
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      houseId: number;
      memberId: string;
      role: UserRole;
    }) => memberApi.update({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.all });
    },
  });
}
