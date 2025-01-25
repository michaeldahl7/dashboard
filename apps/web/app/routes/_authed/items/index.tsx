import { createFileRoute } from "@tanstack/react-router";
import { useItems } from "~/services/item/item.query";
import { Card, CardContent, CardHeader, CardTitle } from "@munchy/ui/components/ui/card";
import { formatDate } from "~/utils/formatDate";

export const Route = createFileRoute("/_authed/items/")({
   component: ItemsRoute,
});

function ItemsRoute() {
   // const { data: items } = useItems();

   return <div>ItemsRoute</div>;
}
