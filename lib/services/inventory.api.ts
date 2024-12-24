// app/services/inventory.api.ts
import { createServerFn } from "@tanstack/start";
import { zodValidator } from "@tanstack/zod-adapter";
import { db } from "~/lib/server/db";
import { inventoryItem, foodItems } from "~/lib/server/db/schema";
import { eq, and } from "drizzle-orm";
import { authMiddleware } from "~/lib/middleware/auth-guard";
import {
  insertInventorySchema,
  updateInventorySchema,
  deleteInventorySchema,
} from "./inventory.schema";

import {
  itemInsertSchema,
  type InventoryItem,
  insertFoodItemSchema,
} from "~/lib/server/db/schema";

// export const getInventoryItems = createServerFn({ method: "GET" })
//   .middleware([authMiddleware])
//   .handler(async ({ context }) => {
//     return db.query.inventoryItem.findMany({
//       where: eq(inventoryItem.user_id, context.user.id),
//       with: {
//         product: true,
//         location: true,
//         zone: true,
//       },
//     });
//   });

export const addInventoryItem = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(zodValidator(insertFoodItemSchema))
  .handler(async ({ context, data }) => {
    return db
      .insert(foodItems)
      .values({
        ...data,
        user_id: context.user.id,
      })
      .returning()
      .then((rows) => rows[0]);
  });

// export const updateInventoryItem = createServerFn({ method: "POST" })
//   .middleware([authMiddleware])
//   .validator(zodValidator(updateInventorySchema))
//   .handler(async ({ context, data: { id, data } }) => {
//     const updated = await db
//       .update(inventoryItem)
//       .set(data)
//       .where(and(eq(inventoryItem.id, id), eq(inventoryItem.user_id, context.user.id)))
//       .returning();

//     if (!updated[0]) throw new Error("Item not found or unauthorized");
//     return updated[0];
//   });

// export const deleteInventoryItem = createServerFn({ method: "POST" })
//   .middleware([authMiddleware])
//   .validator(zodValidator(deleteInventorySchema))
//   .handler(async ({ context, data: id }) => {
//     const deleted = await db
//       .delete(inventoryItem)
//       .where(and(eq(inventoryItem.id, id), eq(inventoryItem.user_id, context.user.id)))
//       .returning();

//     if (!deleted[0]) throw new Error("Item not found or unauthorized");
//     return deleted[0];
//   });
