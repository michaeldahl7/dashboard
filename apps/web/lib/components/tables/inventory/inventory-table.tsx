import { DataTable } from "~/lib/components/ui/data-table";
import { columns } from "~/lib/components/tables/inventory/columns";
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
