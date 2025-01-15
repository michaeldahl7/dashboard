import { createServerFn } from "@tanstack/start";
import { eq, or, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { itemCategory } from "~/lib/server/schema";

export const getItemCategories = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db
         .select()
         .from(itemCategory)
         .where(or(eq(itemCategory.houseId, houseId), isNull(itemCategory.houseId)));
   });
