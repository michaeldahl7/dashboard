import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { item, ItemInsertSchema } from "~/lib/server/schema";

export const getItems = createServerFn()
   .middleware([authMiddleware])
   .validator(z.number())
   .handler(async ({ data: locationId }) => {
      return db.select().from(item).where(eq(item.locationId, locationId));
   });

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator(ItemInsertSchema)
   .handler(async ({ data }) => {
      return db.insert(item).values(data).returning();
   });
