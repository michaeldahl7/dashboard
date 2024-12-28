// app/components/inventory/inventory-form.tsx
import { useForm } from "@tanstack/react-form";
import { useInventoryMutations, useInventoryQuery } from "~/lib/services/inventory.query";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { Textarea } from "~/lib/components/ui/textarea";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "~/lib/components/ui/select";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "~/lib/components/ui/card";
import {
   quantityUnits,
   type InsertItem,
   InsertItemSchema,
   type QuantityUnit,
   InsertInventory,
   InventoryType,
} from "~/lib/server/db/schema";
import { z } from "zod";

export const ItemFormSchema = z.object({
   name: z.string().min(1),
   inventory_id: z.number(),
   quantity: z.number().optional(),
   unit: z.enum(quantityUnits).optional(),
});

export function ItemForm() {
   const { addItem } = useInventoryMutations();
   const { data: inventories } = useInventoryQuery();

   const form = useForm<InsertItem>({
      defaultValues: {
         name: "",
         inventory_id: inventories?.[0]?.id ?? 0,
         quantity: 1,
         unit: "pieces" as QuantityUnit,
      },
      onSubmit: async ({ value }) => {
         await addItem.mutateAsync(value);
         form.reset();
      },
   });

   return (
      <Card>
         <CardHeader>
            <CardTitle>Add Item</CardTitle>
            <CardDescription>Add a new item to an inventory</CardDescription>
         </CardHeader>
         <form>
            <CardContent className="space-y-4">
               <form.Field name="name">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Item Name</Label>
                        <Input
                           placeholder="e.g., Milk"
                           value={field.state.value}
                           onChange={(e) => field.handleChange(e.target.value)}
                        />
                     </div>
                  )}
               </form.Field>

               <form.Field name="inventory_id">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Inventory</Label>
                        <Select
                           value={field.state.value?.toString()}
                           onValueChange={(value) => field.handleChange(Number.parseInt(value))}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select inventory" />
                           </SelectTrigger>
                           <SelectContent>
                              {inventories?.map((inv) => (
                                 <SelectItem key={inv.id} value={inv.id.toString()}>
                                    {inv.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  )}
               </form.Field>

               <form.Field name="quantity">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                           type="number"
                           value={field.state.value}
                           onChange={(e) => field.handleChange(Number.parseFloat(e.target.value))}
                        />
                     </div>
                  )}
               </form.Field>

               <form.Field name="unit">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select
                           value={field.state.value ?? undefined}
                           onValueChange={(value: QuantityUnit) => field.handleChange(value)}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                           </SelectTrigger>
                           <SelectContent>
                              {quantityUnits.map((unit) => (
                                 <SelectItem key={unit} value={unit}>
                                    {unit}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  )}
               </form.Field>
            </CardContent>
            <CardFooter>
               <Button type="submit">Add Item</Button>
            </CardFooter>
         </form>
      </Card>
   );
} 