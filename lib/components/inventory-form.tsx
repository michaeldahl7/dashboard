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
   type InventoryType,
   inventoryTypes,
   type InventoryForm,
} from "~/lib/server/db/schema";
import { z } from "zod";

export const ItemFormSchema = z.object({
   name: z.string().min(1),
   inventory_id: z.number(),
   quantity: z.number().optional(),
   unit: z.enum(quantityUnits).optional(),
});

export function AddInventoryForm() {
   const { addInventory } = useInventoryMutations();

   const form = useForm<InventoryForm>({
      defaultValues: {
         name: "",
         type: "fridge",
      },
      onSubmit: async ({ value }) => {
         await addInventory.mutateAsync(value);
         form.reset();
      },
   });

   return (
      <Card>
         <CardHeader>
            <CardTitle>Add New Inventory</CardTitle>
            <CardDescription>Add a new storage location like "Garage Fridge"</CardDescription>
         </CardHeader>
         <form onSubmit={form.handleSubmit}>
            <CardContent className="space-y-4">
               <form.Field name="name">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                           placeholder="e.g., Garage Fridge"
                           value={field.state.value ?? ""}
                           onChange={(e) => field.handleChange(e.target.value)}
                        />
                     </div>
                  )}
               </form.Field>

               <form.Field name="type">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                           value={field.state.value ?? undefined}
                           onValueChange={(value: InventoryType) => field.handleChange(value)}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                           </SelectTrigger>
                           <SelectContent>
                              {inventoryTypes.map((type) => (
                                 <SelectItem key={type} value={type}>
                                    {type}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  )}
               </form.Field>
            </CardContent>
            <CardFooter>
               <Button type="submit">Add Inventory</Button>
            </CardFooter>
         </form>
      </Card>
   );
}
