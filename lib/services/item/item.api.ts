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

export const addItemSchema = z.object({
   name: z.string().min(1, "Name is required"),
   quantity: z.number().min(1, "Quantity must be at least 1"),
   unit: z.enum([
      "pieces",
      "items",
      "packs",
      "grams",
      "kg",
      "oz",
      "lbs",
      "ml",
      "liters",
      "fl oz",
      "cups",
   ]),
   locationId: z.number(),
});

export type AddItemInput = z.infer<typeof addItemSchema>;

export const addItem = createServerFn()
   .middleware([authMiddleware])
   .validator(addItemSchema)
   .handler(async ({ data }) => {
      return db
         .insert(item)
         .values({
            name: data.name,
            quantity: data.quantity,
            unit: data.unit,
            locationId: data.locationId,
         })
         .returning();
   });
