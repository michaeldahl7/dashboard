import {
   queryOptions,
   useMutation,
   useQueryClient,
   useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import {
   getCurrentHouse,
   getUserHouses,
   updateUser,
   createDefaultHouse,
} from "./house.api";

// Query options
export const currentHouseQueryOptions = () =>
   queryOptions({
      queryKey: ["house", "current"],
      queryFn: () => getCurrentHouse(),
      retry: false,
   });

export const userHousesQueryOptions = () =>
   queryOptions({
      queryKey: ["house", "list"],
      queryFn: () => getUserHouses(),
   });

export const defaultHouseQueryOptions = () =>
   queryOptions({
      queryKey: ["house", "default"],
      queryFn: () => createDefaultHouse(),
   });

// Query hooks
export const useCurrentHouseQuery = () => {
   return useSuspenseQuery(currentHouseQueryOptions());
};

export const useUserHousesQuery = () => {
   return useSuspenseQuery(userHousesQueryOptions());
};

// Mutation hooks
export const useSetCurrentHouseMutation = () => {
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (houseId: number) => updateUser({ data: { currentHouseId: houseId } }),
      onSuccess: async () => {
         await queryClient.invalidateQueries(currentHouseQueryOptions());
         await router.invalidate();
      },
   });
};

export const useCreateDefaultHouseMutation = () => {
   const router = useRouter();
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: () => createDefaultHouse(),
      onSuccess: async () => {
         await queryClient.invalidateQueries(currentHouseQueryOptions());
         await queryClient.invalidateQueries(userHousesQueryOptions());
         await router.invalidate();
      },
   });
};
