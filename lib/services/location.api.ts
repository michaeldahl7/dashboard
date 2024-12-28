import { db } from "~/lib/server/db";
import { location } from "~/lib/server/db/schema";
import { createServerFn } from "@tanstack/start";
import { authMiddleware } from "~/lib/middleware/auth-guard";



export const getLocations = createServerFn()
   .middleware([authMiddleware])
   .handler(async () => {
      return db.select().from(location);
   });