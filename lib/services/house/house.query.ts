import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
   createDefaultHouse,
   getHouseMembers,
   getCurrentHouse,
   getUserHouses,
   addHouse,
   setCurrentHouse,
} from "./house.api";
import { getHouseInvites } from "./member.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export const houseKeys = {
   all: ["houses"] as const,
   byUser: (userId: string) => [...houseKeys.all, userId] as const,
   members: (houseId: number) => [...houseKeys.all, houseId, "members"] as const,
   invites: (houseId: number) => [...houseKeys.all, houseId, "invites"] as const,
   default: () => [...houseKeys.all, "default"] as const,
   create: () => [...houseKeys.all, "create"] as const,
} as const;

export function useGetHousesOfUser() {
   return useSuspenseQuery({
      queryKey: houseKeys.byUser("me"),
      queryFn: () => getUserHouses(),
   });
}
export function useGetCurrentHouse() {
   return useSuspenseQuery({
      queryKey: houseKeys.all,
      queryFn: () => getCurrentHouse(),
      select: (data) => data,
   });
}

export function useHouseMembers(houseId: number) {
   return useSuspenseQuery({
      queryKey: houseKeys.members(houseId),
      queryFn: () => getHouseMembers({ data: houseId }),
   });
}

export function useHouseInvites(houseId: number) {
   return useSuspenseQuery({
      queryKey: houseKeys.invites(houseId),
      queryFn: () => getHouseInvites({ data: houseId }),
   });
}

export const getHousesQueryOptions = () =>
   queryOptions({
      queryKey: houseKeys.byUser("me"),
      queryFn: () => getUserHouses(),
   });

export const createDefaultHouseQueryOptions = () =>
   queryOptions({
      queryKey: houseKeys.default(),
      queryFn: () => createDefaultHouse(),
   });

export const addHouseQueryOptions = {
   queryKey: houseKeys.create(),
   queryFn: (data: { name: string }) =>
      addHouse({ data: { ...data, setAsCurrent: true } }),
};

export function useSetCurrentHouse() {
   const router = useRouter();
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: (houseId: number) => setCurrentHouse({ data: houseId }),
      onSuccess: async () => {
         await queryClient.invalidateQueries();
         await router.invalidate();
      },
   });
}
