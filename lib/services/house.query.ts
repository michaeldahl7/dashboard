import { useMutation, useQuery } from "@tanstack/react-query";
import { houseApi } from "./house.api";
import type { Member } from '~/lib/types/house'

export const useHouses = (userId: string) => {
  return useQuery({
    queryKey: ["houses", userId],
    queryFn: () => houseApi.getUserHouses(userId),
  });
};

export function useHouseMembers(houseId: string) {
  return useQuery<Member[]>({
    queryKey: ['house', houseId, 'members'],
    queryFn: () => houseApi.getHouseMembers(houseId)
  });
}

export const useCreateHouse = () => {
  return useMutation({
    mutationFn: houseApi.createHouse,
  });
};

export const useInviteMember = () => {
  return useMutation({
    mutationFn: houseApi.inviteMember,
  });
}; 