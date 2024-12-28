// app/components/inventory/inventory-form.tsx
import { useForm } from "@tanstack/react-form";
import { useInventoryMutations } from "~/lib/services/inventory.query";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { Label } from "~/lib/components/ui/label";
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
  inventoryTypes,
  type InventoryType,
  type InventoryForm as InventoryFormType,
} from "~/lib/server/db/schema";

export function AddInventoryForm() {
  const { addInventory } = useInventoryMutations();

  const form = useForm<InventoryFormType>({
    defaultValues: {
      name: "",
      type: "fridge" as InventoryType,
    },
    onSubmit: async ({ value }) => {
      try {
        await addInventory.mutateAsync(value);
        form.reset();
      } catch (error) {
        console.error('Failed to add inventory:', error);
      }
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
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="type">
            {(field) => (
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value: InventoryType) => field.handleChange(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors && (
                  <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                )}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={addInventory.isPending}>
            {addInventory.isPending ? "Adding..." : "Add Inventory"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}