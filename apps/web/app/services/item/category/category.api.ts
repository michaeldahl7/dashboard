// import { db } from "~/server/db";
import { db } from '@munchy/db/client';
import { itemCategory } from '@munchy/db/schema';
import { createServerFn } from '@tanstack/start';
import { eq, isNull, or } from 'drizzle-orm';
import { z } from 'zod';
import { authMiddleware } from '~/middleware/auth-guard';

const getAllCategories = createServerFn()
  .middleware([authMiddleware])
  .validator(z.number())
  .handler(async ({ data: houseId }) => {
    return db.query.itemCategory.findMany({
      where: or(
        eq(itemCategory.houseId, houseId),
        isNull(itemCategory.houseId)
      ),
    });
  });

const createCategory = createServerFn()
  .middleware([authMiddleware])
  .validator(
    z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      houseId: z.number(),
    })
  )
  .handler(async ({ data }) => {
    return db.insert(itemCategory).values(data).returning();
  });

export const categoryApi = {
  getAll: getAllCategories,
  create: createCategory,
};
