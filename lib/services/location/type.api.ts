import { createServerFn } from "@tanstack/start";
import { eq, or, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { locationType } from "~/lib/server/schema";

export const getLocationTypes = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db
         .select()
         .from(locationType)
         .where(or(eq(locationType.houseId, houseId), isNull(locationType.houseId)));
   });
