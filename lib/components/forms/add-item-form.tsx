import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
import { useAddItem } from "~/lib/services/item/item.query";
import { addItemSchema, type AddItemInput } from "~/lib/services/item/item.api";
import { toast } from "sonner";

export function AddItemForm() {
   //    const { toast } = useToast();
   const { mutate: addItem, isPending } = useAddItem();

   const form = useForm<AddItemInput>({
      defaultValues: {
         name: "",
         quantity: 1,
         unit: "pieces" as const,
         locationId: 1,
      },
      onSubmit: async ({ value }) => {
         try {
            addItem(value);
            toast.success("Item added successfully");
            form.reset();
         } catch (error) {
            toast.error("Failed to add item");
         }
      },
   });

   return (
      <form
         onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
         }}
         className="space-y-6"
      >
         <div className="space-y-2">
            <Label htmlFor="name">Item Name</Label>
            <form.Field
               name="name"
               children={(field) => (
                  <div className="space-y-1">
                     <Input
                        id="name"
                        placeholder="Enter item name"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                     />
                     {field.state.meta.errors ? (
                        <div className="text-sm text-red-500">
                           {field.state.meta.errors}
                        </div>
                     ) : null}
                  </div>
               )}
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <form.Field
               name="quantity"
               children={(field) => (
                  <div className="space-y-1">
                     <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(Number(e.target.value))}
                     />
                     {field.state.meta.errors ? (
                        <div className="text-sm text-red-500">
                           {field.state.meta.errors}
                        </div>
                     ) : null}
                  </div>
               )}
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <form.Field
               name="unit"
               children={(field) => (
                  <div className="space-y-1">
                     <Input
                        id="unit"
                        placeholder="e.g., kg, pieces, liters"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                     />
                     {field.state.meta.errors ? (
                        <div className="text-sm text-red-500">
                           {field.state.meta.errors}
                        </div>
                     ) : null}
                  </div>
               )}
            />
         </div>

         <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add Item"}
         </Button>
      </form>
   );
}
