import type { ColumnDef } from "@tanstack/react-table";
import type { ItemSelect } from "~/lib/server/schema/location.schema";

// Define the schema for inventory items
// export const inventoryItemSchema = z.object({
//    id: z.string(),
//    name: z.string(),
//    quantity: z.number(),
//    unit: z.string(),
//    category: z.string(),
//    expirationDate: z.date().optional(),
//    lastUpdated: z.date(),
// });

// // Infer the type from the schema
// export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const columns: ColumnDef<ItemSelect>[] = [
   {
      accessorKey: "name",
      header: "Name",
   },
   {
      accessorKey: "quantity",
      header: "Quantity",
   },
   {
      accessorKey: "unit",
      header: "Unit",
   },
];
