import { createServerFn } from "@tanstack/start";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import { db } from "~/lib/server/db";
import { item, location } from "~/lib/server/schema";
import { KitchenError } from "~/lib/server/utils/errors";

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
   locationId: z.number().optional(),
   categoryId: z.number().optional(),
   expiryDate: z.date().optional(),
   brand: z.string().optional(),
});

export type AddItemInput = z.infer<typeof addItemSchema>;

const getAllItems = createServerFn()
   .middleware([authMiddleware])
   .handler(async ({ context }) => {
      const { user } = context.auth;
      if (!user.currentHouseId) throw new Error("No house selected");

      const results = await db
         .select()
         .from(item)
         .leftJoin(location, eq(item.locationId, location.id))
         .where(eq(item.houseId, user.currentHouseId));

      // Transform the joined data into a cleaner structure
      return results.map(({ item, location }) => ({
         id: item.id,
         name: item.name,
         quantity: item.quantity,
         unit: item.unit,
         brand: item.brand,
         expiryDate: item.expiryDate,
         location: location
            ? {
                 id: location.id,
                 name: location.name,
              }
            : null,
      }));
   });

const createItem = createServerFn()
   .middleware([authMiddleware])
   .validator(addItemSchema)
   .handler(async ({ data, context }) => {
      // Debug logs
      console.log("Creating item with data:", data);
      console.log("Current house:", context.auth.user.currentHouseId);

      if (!context.auth.user.currentHouseId) {
         throw new KitchenError("No house selected", "NO_CURRENT_HOUSE");
      }

      if (data.locationId) {
         const locationCheck = await db.query.location.findFirst({
            where: eq(location.id, data.locationId),
            columns: { houseId: true },
         });

         // Debug log
         console.log("Location check result:", locationCheck);

         if (!locationCheck) {
            throw new KitchenError("Location not found", "INVALID_LOCATION");
         }

         if (locationCheck.houseId !== context.auth.user.currentHouseId) {
            throw new KitchenError(
               "Location does not belong to current house",
               "INVALID_LOCATION",
            );
         }
      }

      const itemData = {
         ...data,
         houseId: context.auth.user.currentHouseId,
      };

      const [newItem] = await db.insert(item).values(itemData).returning();
      return newItem;
   });

export const itemApi = {
   getAll: getAllItems,
   create: createItem,
};
