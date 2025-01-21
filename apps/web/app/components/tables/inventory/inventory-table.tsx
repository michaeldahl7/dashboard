import { DataTable } from "~/app/components/tables/data-table";
import { columns } from "~/app/components/tables/inventory/columns";
import type { ItemSelect } from "@munchy/db/schema";

interface InventoryTableProps {
   items: ItemSelect[];
}

export function InventoryTable({ items }: InventoryTableProps) {
   return (
      <DataTable
         columns={columns}
         data={items}
         emptyMessage="No inventory items found. Add some items to get started!"
      />
   );
}
