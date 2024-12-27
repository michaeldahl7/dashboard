// app/components/inventory/inventory-form.tsx
import { useForm } from "@tanstack/react-form";
import { useInventoryMutations } from "~/lib/services/inventory.query";
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
   type InsertInventoryItem,
   insertInventorySchema,
   type QuantityUnit,
} from "~/lib/server/db/schema";

export default function InventoryForm() {
   const { addItem } = useInventoryMutations();

   const form = useForm<InsertInventoryItem>({
      defaultValues: {
         name: "",
         location_id: 1,
         quantity: 1,
         unit: "pieces" as QuantityUnit,
         expiry_date: null,
         notes: null,
      },
      onSubmit: async ({ value }) => {
         await addItem.mutateAsync(value);
         form.reset();
      },
      validators: {
         onSubmit: insertInventorySchema,
      },
   });

   return (
      <Card>
         <CardHeader>
            <CardTitle>Add Food Item</CardTitle>
            <CardDescription>Add a new item to your kitchen</CardDescription>
         </CardHeader>
         <form
            onSubmit={(e) => {
               e.preventDefault();
               e.stopPropagation();
               void form.handleSubmit();
            }}
         >
            <CardContent className="space-y-4">
               <div>
                  <form.Field name="name">
                     {(field) => (
                        <div className="space-y-2">
                           <Label>Name</Label>
                           <Input
                              placeholder="Enter food item name"
                              value={field.state.value ?? ""}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(e.target.value)}
                           />
                           {field.state.meta.errors ? (
                              <p className="text-sm text-destructive">
                                 {field.state.meta.errors}
                              </p>
                           ) : null}
                        </div>
                     )}
                  </form.Field>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <form.Field name="quantity">
                     {(field) => (
                        <div className="space-y-2">
                           <Label>Quantity</Label>
                           <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) => field.handleChange(Number(e.target.value))}
                           />
                           {field.state.meta.errors ? (
                              <p className="text-sm text-destructive">
                                 {field.state.meta.errors}
                              </p>
                           ) : null}
                        </div>
                     )}
                  </form.Field>

                  <form.Field name="unit">
                     {(field) => (
                        <div className="space-y-2">
                           <Label>Unit</Label>
                           <Select
                              value={field.state.value ?? undefined}
                              onValueChange={(value: QuantityUnit) =>
                                 field.handleChange(value)
                              }
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
                           {field.state.meta.errors ? (
                              <p className="text-sm text-destructive">
                                 {field.state.meta.errors}
                              </p>
                           ) : null}
                        </div>
                     )}
                  </form.Field>
               </div>

               <form.Field name="expiry_date">
                  {(field) => {
                     const dateValue =
                        field.state.value instanceof Date
                           ? field.state.value.toISOString().slice(0, 16)
                           : "";

                     return (
                        <div className="space-y-2">
                           <Label>Expiry Date</Label>
                           <Input
                              type="datetime-local"
                              value={dateValue}
                              onBlur={field.handleBlur}
                              onChange={(e) => {
                                 const date = e.target.value
                                    ? new Date(e.target.value)
                                    : null;
                                 field.handleChange(date);
                              }}
                           />
                           {field.state.meta.errors ? (
                              <p className="text-sm text-destructive">
                                 {field.state.meta.errors}
                              </p>
                           ) : null}
                        </div>
                     );
                  }}
               </form.Field>

               <form.Field name="notes">
                  {(field) => (
                     <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                           placeholder="Add any notes about the item"
                           value={field.state.value ?? ""}
                           onBlur={field.handleBlur}
                           onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors ? (
                           <p className="text-sm text-destructive">
                              {field.state.meta.errors}
                           </p>
                        ) : null}
                     </div>
                  )}
               </form.Field>
            </CardContent>

            <CardFooter className="flex gap-2">
               <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting]}
               >
                  {([canSubmit, isSubmitting]) => (
                     <>
                        <Button type="submit" disabled={!canSubmit}>
                           {isSubmitting ? "Adding..." : "Add Item"}
                        </Button>
                        <Button
                           type="button"
                           variant="outline"
                           onClick={() => form.reset()}
                        >
                           Reset
                        </Button>
                     </>
                  )}
               </form.Subscribe>
            </CardFooter>
         </form>
      </Card>
   );
}
