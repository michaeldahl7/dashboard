import { createFileRoute } from "@tanstack/react-router";
import { useItems } from "~/lib/services/item/item.query";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { formatDate } from "~/lib/utils/formatDate";

export const Route = createFileRoute("/_authed/items/")({
   component: ItemsRoute,
});

function ItemsRoute() {
   // const { data: items } = useItems();

   return <div>ItemsRoute</div>;
}
