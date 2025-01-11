import { ulid } from "ulid";
import { db } from "~/lib/server/db";
import { location } from "~/lib/server/schema/location.schema";
import type { LocationType } from "~/lib/server/schema/location.schema";

export const DEFAULT_LOCATIONS = [
   { name: "Main Fridge", type: "fridge" as LocationType },
   { name: "Freezer", type: "freezer" as LocationType },
   { name: "Pantry", type: "pantry" as LocationType },
   { name: "Kitchen Counter", type: "counter" as LocationType },
] as const;

export async function createDefaultLocations(houseId: string) {
   return db
      .insert(location)
      .values(
         DEFAULT_LOCATIONS.map((location) => ({
            id: ulid(),
            name: location.name,
            type: location.type,
            house_id: houseId,
         })),
      )
      .returning();
}
