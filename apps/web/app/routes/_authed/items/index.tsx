import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authed/items/')({
  component: ItemsRoute,
});

function ItemsRoute() {
  // const { data: items } = useItems();

  return <div>ItemsRoute</div>;
}
