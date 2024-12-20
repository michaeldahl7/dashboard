// app/components/inventory/inventory-form.tsx
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useInventoryMutations } from "~/services/inventory.query";
import { insertInventorySchema } from "~/services/inventory.schema";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { quantityUnits } from "~/server/db/schema";

export default function InventoryForm() {
  const { addItem } = useInventoryMutations();

  const form = useForm({
    defaultValues: {
      product_name: "",
      location_id: 1, // You might want to make this dynamic
      quantity: 1,
      unit: "pieces",
      expiry_date: "",
      notes: "",
    },
    onSubmit: async ({ value }) => {
      await addItem.mutateAsync(value);
    },
    validator: zodValidator(insertInventorySchema),
  });

  return (
    <div className="max-w-xl">
      <form.Provider>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          <div>
            <form.Field
              name="product_name"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Product Name</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter product name"
                  />
                  {field.state.meta.errors?.length ? (
                    <span className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  ) : null}
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form.Field
              name="quantity"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Quantity</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    min="0"
                    step="0.01"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  {field.state.meta.errors?.length ? (
                    <span className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  ) : null}
                </div>
              )}
            />

            <form.Field
              name="unit"
              children={(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Unit</Label>
                  <Select
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name}>
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
                  {field.state.meta.errors?.length ? (
                    <span className="text-sm text-destructive">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  ) : null}
                </div>
              )}
            />
          </div>

          <form.Field
            name="expiry_date"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Expiry Date</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors?.length ? (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                ) : null}
              </div>
            )}
          />

          <form.Field
            name="notes"
            children={(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Notes</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Add any notes..."
                />
                {field.state.meta.errors?.length ? (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                ) : null}
              </div>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <div className="flex justify-end">
                <Button type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Item"}
                </Button>
              </div>
            )}
          />
        </form>
      </form.Provider>
    </div>
  );
}
