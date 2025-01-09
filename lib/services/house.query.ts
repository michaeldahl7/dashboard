import {
    queryOptions,
    useMutation,
    useQueryClient,
    useSuspenseQuery,
  } from "@tanstack/react-query";
  import { 
    // getHouses, 
    addHouse, 
    updateHouse, 
    deleteHouse,
    updateHouseMember,
    inviteToHouse,
    acceptHouseInvite,
    rejectHouseInvite,
    getHouseInvites,
  } from "./house.api";
  import type { HouseForm, HouseMemberForm, HouseInviteForm } from "~/lib/server/schema";
  
  // Query keys
  export const houseKeys = {
    all: ["house"] as const,
    lists: () => [...houseKeys.all, "list"] as const,
    detail: (id: string) => [...houseKeys.all, "detail", id] as const,
    members: (id: string) => [...houseKeys.all, "members", id] as const,
    invites: (id: string) => [...houseKeys.all, "invites", id] as const,
    invitesList: (houseId: string) => [...houseKeys.all, "invites", "list", houseId] as const,
  };
  
  // Mutations
  export const useHouseMutations = () => {
    const queryClient = useQueryClient();
    
    const invalidateHouses = () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.all });
    };
  
    return {
      addHouse: useMutation({
        mutationFn: (data: HouseForm) => addHouse({ data }),
        onSuccess: invalidateHouses,
      }),
  
      updateHouse: useMutation({
        mutationFn: ({ houseId, name }: { 
          houseId: string; 
          name: string;
        }) => updateHouse({ 
          data: { houseId, name } 
        }),
        onSuccess: invalidateHouses,
      }),
  
      deleteHouse: useMutation({
        mutationFn: (houseId: string) => deleteHouse({ data: houseId }),
        onSuccess: invalidateHouses,
      }),
  
      updateMember: useMutation({
        mutationFn: ({ houseId, memberId, role }: { 
          houseId: string; 
          memberId: string;
          role: "admin" | "member";
        }) => updateHouseMember({ 
          data: { houseId, memberId, role } 
        }),
        onSuccess: invalidateHouses,
      }),
  
      inviteToHouse: useMutation({
        mutationFn: (data: HouseInviteForm) => inviteToHouse({ data }),
        onSuccess: invalidateHouses,
      }),
  
      acceptInvite: useMutation({
        mutationFn: (inviteId: string) => acceptHouseInvite({ data: inviteId }),
        onSuccess: invalidateHouses,
      }),
  
      rejectInvite: useMutation({
        mutationFn: (inviteId: string) => rejectHouseInvite({ data: inviteId }),
        onSuccess: invalidateHouses,
      }),
    };
  };
  
  // Add new query hook
  export const useHouseInvitesQuery = (houseId: string) => {
    return useSuspenseQuery({
      queryKey: houseKeys.invitesList(houseId),
      queryFn: () => getHouseInvites({ data: houseId }),
    });
  };
  
