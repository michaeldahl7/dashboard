import { useSuspenseQuery } from '@tanstack/react-query';
import { locationApi } from '~/services/location/location.api';

export const locationTypeKeys = {
  all: ['locationTypes'] as const,
  byHouse: (houseId: number) => [...locationTypeKeys.all, houseId] as const,
} as const;

export function useLocationTypes(houseId: number) {
  return useSuspenseQuery({
    queryKey: locationTypeKeys.byHouse(houseId),
    queryFn: () => locationApi.getLocationTypes({ data: houseId }),
  });
}
