import {
    queryOptions,
    useMutation,
    useQueryClient,
    useSuspenseQuery,
  } from "@tanstack/react-query";
  import { 
    getHouses, 
    addHouse,
    inviteToHouse,
  } from "./house.api";
  import type {
    SelectHouse,
    SelectHouseMember,
    HouseForm,
  } from "~/lib/server/schema/house.schema";
  
  // Query keys for cache management
  export const houseKeys = {
    all: ["house"] as const,
    lists: () => [...houseKeys.all, "list"] as const,
    members: (houseId: string) => [...houseKeys.all, "members", houseId] as const,
  };
  
  // Query options
  export const houseQueryOptions = () => {
    return queryOptions<SelectHouse[]>({
      queryKey: houseKeys.lists(),
      queryFn: async () =>  {
        const members = await getHouses()
        return members.map(member => member.house);
      },
    });
  };
  
  // Hooks
  export const useHouseQuery = () => {
    return useSuspenseQuery(houseQueryOptions());
  };
  
  // Mutations
  export const useHouseMutations = () => {
    const queryClient = useQueryClient();
    
    const invalidateHouses = () => {
      queryClient.invalidateQueries({ queryKey: houseKeys.all });
    };
  
    const addHouseMutation = useMutation({
      mutationFn: (data: HouseForm) => addHouse({ data }),
      onSuccess: invalidateHouses,
    });
  
    const inviteToHouseMutation = useMutation({
      mutationFn: (data: { houseId: string; email: string }) => inviteToHouse({ data }),
      onSuccess: invalidateHouses,
    });
  
    return {
      addHouse: addHouseMutation,
      inviteToHouse: inviteToHouseMutation,
    };
  };
  
