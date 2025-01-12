import { db } from "~/lib/server/db";
import { location } from "~/lib/server/schema/location.schema";
import type { LocationType } from "~/lib/server/schema/location.schema";
import { KitchenError } from "~/lib/server/utils/errors";

export const DEFAULT_LOCATIONS = [
   { name: "Main Fridge", type: "fridge" as LocationType },
   { name: "Freezer", type: "freezer" as LocationType },
   { name: "Pantry", type: "pantry" as LocationType },
   { name: "Kitchen Counter", type: "counter" as LocationType },
] as const;

export async function createDefaultLocations(houseId: number) {
   try {
      const locations = await db
         .insert(location)
         .values(
            DEFAULT_LOCATIONS.map((location) => ({
               name: location.name,
               type: location.type,
               houseId: houseId,
            })),
         )
         .returning();

      if (!locations.length) {
         throw new KitchenError("No locations were created", "LOCATION_CREATION_FAILED");
      }

      return locations;
   } catch (error) {
      if (error instanceof KitchenError) throw error;
      throw new KitchenError(
         "Failed to create default locations",
         "LOCATION_CREATION_FAILED",
      );
   }
}
