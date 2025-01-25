import type { ItemSelect } from '@munchy/db/schema';
import { DataTable } from '~/components/tables/data-table';
import { columns } from '~/components/tables/inventory/columns';

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
