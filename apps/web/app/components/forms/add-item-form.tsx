import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Button } from "@munchy/ui/components/ui/button";
import { Input } from "@munchy/ui/components/ui/input";
import { Label } from "@munchy/ui/components/ui/label";
import { useCreateItem } from "~/services/item/item.query";
import { addItemSchema, type AddItemInput } from "~/services/item/item.api";
import { toast } from "sonner";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@munchy/ui/components/ui/select";
import { quantityUnits } from "@munchy/db/schema";
import { useCurrentHouse } from "~/services/house/house.query";
import { useLocations } from "~/services/location/location.query";

export function AddItemForm() {
   const { mutate: createItem, isPending } = useCreateItem();
   const { data: currentHouse } = useCurrentHouse();
   const { data: locations } = useLocations(currentHouse?.id!);

   const form = useForm<AddItemInput>({
      defaultValues: {
         name: "",
         quantity: 1,
         unit: "pieces",
      },
      validators: {
         onSubmit: addItemSchema,
      },
      onSubmit: async ({ value }) => {
         try {
            createItem(value);
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
                     <Select
                        defaultValue={field.state.value}
                        onValueChange={(value) =>
                           field.handleChange(value as AddItemInput["unit"])
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
                     {field.state.meta.errors && (
                        <div className="text-sm text-red-500">
                           {field.state.meta.errors}
                        </div>
                     )}
                  </div>
               )}
            />
         </div>

         <div className="space-y-2">
            <Label htmlFor="locationId">Location (Optional)</Label>
            <form.Field
               name="locationId"
               children={(field) => (
                  <div className="space-y-1">
                     <Select
                        defaultValue={field.state.value?.toString()}
                        onValueChange={(value) =>
                           field.handleChange(
                              value === "none" ? undefined : Number(value),
                           )
                        }
                     >
                        <SelectTrigger>
                           <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="none">No Location</SelectItem>
                           {locations?.map((location) => (
                              <SelectItem
                                 key={location.id}
                                 value={location.id.toString()}
                              >
                                 {location.name}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               )}
            />
         </div>

         <Button variant="secondary" disabled={isPending}>
            {isPending ? "Adding..." : "Add Item"}
         </Button>
      </form>
   );
}
