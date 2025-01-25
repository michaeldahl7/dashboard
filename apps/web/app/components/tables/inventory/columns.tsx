import type { ItemSelect } from '@munchy/db/schema';
import type { ColumnDef } from '@tanstack/react-table';

export const columns: ColumnDef<ItemSelect>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
  },
  {
    accessorKey: 'unit',
    header: 'Unit',
  },
];
