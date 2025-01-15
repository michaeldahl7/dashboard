import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { location, LocationInsertSchema, item, locationType } from "~/lib/server/schema";
import { locationSettings } from "~/lib/server/schema";

export const getLocations = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      // First get locations with their types
      const locations = await db
         .select()
         .from(location)
         .where(eq(location.houseId, houseId))
         .leftJoin(locationType, eq(location.typeId, locationType.id));

      // Then get items for each location
      const locationsWithItems = await Promise.all(
         locations.map(async (loc) => {
            const items = await db
               .select()
               .from(item)
               .where(eq(item.locationId, loc.location.id));

            return {
               ...loc.location,
               type: loc.location_type ?? {
                  id: 0,
                  name: "Unknown",
                  createdAt: new Date(),
                  updatedAt: null,
                  isDefault: false,
                  houseId: null,
               },
               items,
            };
         }),
      );

      return locationsWithItems;
   });

export const addLocation = createServerFn()
   .middleware([authMiddleware])
   .validator(LocationInsertSchema)
   .handler(async ({ data }) => {
      const [newLocation] = await db
         .insert(location)
         .values({
            name: data.name,
            typeId: data.typeId,
            houseId: data.houseId,
         })
         .returning();

      return newLocation;
   });

export const getLocationSettings = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: locationId }) => {
      return db.query.locationSettings.findFirst({
         where: eq(locationSettings.locationId, locationId),
      });
   });
