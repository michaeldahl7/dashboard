import { db } from '@munchy/db/client';
import { locationType } from '@munchy/db/schema';
import { createServerFn } from '@tanstack/start';
import { eq, isNull, or } from 'drizzle-orm';
import { z } from 'zod';
import { authMiddleware } from '~/middleware/auth-guard';

export const getLocationTypes = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: houseId }) => {
    await db
      .select()
      .from(locationType)
      .where(
        or(eq(locationType.houseId, houseId), isNull(locationType.houseId))
      );
  });
