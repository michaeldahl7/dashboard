// app/routes/index.tsx
import { Link, createFileRoute } from "@tanstack/react-router";
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
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/lib/components/ui/card";

import { useForm } from "@tanstack/react-form";
import { useInventoryMutations } from "~/lib/services/inventory.query";
import {
  locationTypes,
  categoryTypes,
  unitTypes,
  type ValidatedInsertFoodItem,
  type LocationType,
  type CategoryType,
  type UnitType,
} from "~/lib/server/db/schema";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user } = Route.useRouteContext();
  const { addItem } = useInventoryMutations();

  const form = useForm<ValidatedInsertFoodItem>({
    defaultValues: {
      name: "",
      quantity: 1,
      location: "pantry",
      category: undefined,
      unit: undefined,
      notes: "",
      expiry_date: undefined,
    },
    onSubmit: async ({ value }) => {
      await addItem.mutateAsync(value);
      form.reset();
    },
  });

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-4xl font-bold">Kitchen Tracker</h1>

      {user ? (
        <div className="flex flex-col gap-2">
          <p>Welcome back, {user.name}!</p>
          <Button asChild className="w-fit" size="lg">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-col gap-2">
            <p>You are not signed in.</p>
            <Button type="button" asChild className="w-fit" size="lg">
              <Link to="/signin">Sign in</Link>
            </Button>
          </div>
          <Card className="max-w-2xl">
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
                {/* Name */}
                <div>
                  <form.Field name="name">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          placeholder="Enter food item name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Quantity */}
                  <div>
                    <form.Field name="quantity">
                      {(field) => (
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={field.state.value}
                            onChange={(e) =>
                              field.handleChange(
                                Number.parseFloat(e.target.value),
                              )
                            }
                          />
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* Unit */}
                  <div>
                    <form.Field name="unit">
                      {(field) => (
                        <div className="space-y-2">
                          <Label>Unit</Label>
                          <Select
                            value={field.state.value || ""}
                            onValueChange={(value: UnitType) =>
                              field.handleChange(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              {unitTypes.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                  {unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* Location */}
                  <div>
                    <form.Field name="location">
                      {(field) => (
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Select
                            value={field.state.value || ""}
                            onValueChange={(value: LocationType) =>
                              field.handleChange(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locationTypes.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>

                  {/* Category */}
                  <div>
                    <form.Field name="category">
                      {(field) => (
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select
                            value={field.state.value || ""}
                            onValueChange={(value: CategoryType) =>
                              field.handleChange(value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryTypes.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {field.state.meta.errors && (
                            <p className="text-sm text-destructive">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <form.Field name="expiry_date">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          type="date"
                          value={field.state.value || ""}
                          onChange={(e) => {
                            const value = e.target.value || undefined;
                            field.handleChange(value);
                          }}
                        />
                        {field.state.meta.errors && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>

                {/* Notes */}
                <div>
                  <form.Field name="notes">
                    {(field) => (
                      <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                          placeholder="Add any notes about the item"
                          value={field.state.value || ""}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {field.state.meta.errors && (
                          <p className="text-sm text-destructive">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                      </div>
                    )}
                  </form.Field>
                </div>
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
        </div>
      )}
    </div>
  );
}
