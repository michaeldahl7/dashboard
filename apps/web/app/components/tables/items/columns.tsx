import type { ColumnDef } from "@tanstack/react-table";
import type { ItemSelect } from "@munchy/db/schema";
import { formatDate } from "~/app/utils/formatDate";

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
   {
      accessorKey: "brand",
      header: "Brand",
   },
   {
      accessorKey: "expiryDate",
      header: "Expiry Date",
      cell: ({ row }) => {
         const date = row.getValue("expiryDate") as Date;
         return date ? formatDate(date) : "-";
      },
   },
   {
      accessorKey: "location.name",
      header: "Location",
   },
];
