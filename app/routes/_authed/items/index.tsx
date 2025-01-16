import { createFileRoute } from "@tanstack/react-router";
import { useItems } from "~/lib/services/item/item.query";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { formatDate } from "~/lib/utils/formatDate";

export const Route = createFileRoute("/_authed/items/")({
   component: ItemsRoute,
});

function ItemsRoute() {
   const { data: items } = useItems();

   return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
         <div className="flex-1 space-y-4">
            <Card>
               <CardHeader>
                  <CardTitle>Items</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {items?.length ? (
                        items.map((item) => (
                           <Card key={item.id}>
                              <CardHeader>
                                 <CardTitle>{item.name}</CardTitle>
                                 <span className="text-sm text-muted-foreground">
                                    {item.location?.name}
                                 </span>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                       Quantity
                                    </span>
                                    <span>
                                       {item.quantity} {item.unit}
                                    </span>
                                 </div>
                                 {item.brand && (
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">
                                          Brand
                                       </span>
                                       <span>{item.brand}</span>
                                    </div>
                                 )}
                                 {item.expiryDate && (
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">
                                          Expires
                                       </span>
                                       <span>{formatDate(item.expiryDate)}</span>
                                    </div>
                                 )}
                              </CardContent>
                           </Card>
                        ))
                     ) : (
                        <div className="col-span-full text-center text-muted-foreground">
                           No items found.
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
