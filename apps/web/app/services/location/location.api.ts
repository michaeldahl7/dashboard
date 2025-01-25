import { db } from '@munchy/db/client';
import { location, locationType } from '@munchy/db/schema';
import { locationSettings } from '@munchy/db/schema';
import { createServerFn } from '@tanstack/start';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { authMiddleware } from '~/middleware/auth-guard';

const getAllLocations = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: houseId }) => {
    const locations = await db.query.location.findMany({
      where: eq(location.houseId, houseId),
      with: {
        type: true,
        items: true,
      },
    });
    return locations;
  });

const createLocation = createServerFn()
  .middleware([authMiddleware])
  // .validator(locationInsertSchema)
  .handler(async ({ data }) => {
    return await db.insert(location).values(data).returning();
  });

const getLocationSettings = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: locationId }) => {
    return await db.query.locationSettings.findFirst({
      where: eq(locationSettings.locationId, locationId),
    });
  });

const getLocationTypes = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: houseId }) => {
    return await db.query.locationType.findMany({
      where: eq(locationType.houseId, houseId),
    });
  });

export const locationApi = {
  getAll: getAllLocations,
  create: createLocation,
  getSettings: getLocationSettings,
  getLocationTypes: getLocationTypes,
};
