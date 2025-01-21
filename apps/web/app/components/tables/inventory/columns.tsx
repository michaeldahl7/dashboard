import type { ColumnDef } from "@tanstack/react-table";
import type { ItemSelect } from "@munchy/db/schema";

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
