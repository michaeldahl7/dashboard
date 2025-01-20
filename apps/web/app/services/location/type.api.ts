import { createServerFn } from "@tanstack/start";
import { eq, or, isNull } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/app/middleware/auth-guard";
import { db } from "@munchy/db/client";
import { locationType } from "@munchy/db/schema";

export const getLocationTypes = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: houseId }) => {
      return db
         .select()
         .from(locationType)
         .where(or(eq(locationType.houseId, houseId), isNull(locationType.houseId)));
   });
