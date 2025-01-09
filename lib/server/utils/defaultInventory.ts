import { db } from "../db";
import { inventory } from "../schema";
import { ulid } from "ulid";
import type { InventoryType } from "../schema/inventory.schema";

export const DEFAULT_INVENTORIES = [
   { name: "Main Fridge", type: "fridge" as InventoryType },
   { name: "Freezer", type: "freezer" as InventoryType },
   { name: "Pantry", type: "pantry" as InventoryType },
   { name: "Kitchen Counter", type: "counter" as InventoryType },
] as const;

export async function createDefaultInventories(houseId: string) {
   return db.insert(inventory).values(
      DEFAULT_INVENTORIES.map(location => ({
         id: ulid(),
         name: location.name,
         type: location.type,
         house_id: houseId,
      }))
   ).returning();
} 