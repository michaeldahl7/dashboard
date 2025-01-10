// // app/components/inventory/inventory-form.tsx
// import { useForm } from "@tanstack/react-form";
// import { useInventoryMutations, useInventoryQuery } from "~/lib/services/location.query";
// import { Button } from "~/lib/components/ui/button";
// import { Input } from "~/lib/components/ui/input";
// import { Label } from "~/lib/components/ui/label";
// import {
//    Select,
//    SelectContent,
//    SelectItem,
//    SelectTrigger,
//    SelectValue,
// } from "~/lib/components/ui/select";
// import {
//    Card,
//    CardContent,
//    CardDescription,
//    CardFooter,
//    CardHeader,
//    CardTitle,
// } from "~/lib/components/ui/card";
// import {
//    quantityUnits,
//    type ItemForm as ItemFormType,
//    type QuantityUnit,
// } from "~/lib/server/schema/location.schema";

// export function ItemForm() {
//    const { addItem } = useInventoryMutations();

//    if (!user?.currentHouseId) {
//       return (
//          <Card>
//             <CardHeader>
//                <CardTitle>No House Selected</CardTitle>
//                <CardDescription>Please select a house to add items</CardDescription>
//             </CardHeader>
//          </Card>
//       );
//    }

//    const { data: inventories } = useInventoryQuery(user.currentHouseId);

//    const form = useForm<ItemFormType>({
//       defaultValues: {
//          name: "",
//          locationId: inventories?.[0]?.id ?? 0,
//          quantity: 1,
//          unit: "pieces" as QuantityUnit,
//       },
//       onSubmit: async ({ value }) => {
//          try {
//             await addItem.mutateAsync(value);
//             form.reset();
//          } catch (error) {
//             console.error("Failed to add item:", error);
//          }
//       },
//    });

//    return (
//       <Card>
//          <CardHeader>
//             <CardTitle>Add Item</CardTitle>
//             <CardDescription>Add a new item to an inventory</CardDescription>
//          </CardHeader>
//          <form onSubmit={form.handleSubmit}>
//             <CardContent className="space-y-4">
//                <form.Field name="name">
//                   {(field) => (
//                      <div className="space-y-2">
//                         <Label>Item Name</Label>
//                         <Input
//                            placeholder="e.g., Milk"
//                            value={field.state.value ?? ""}
//                            onChange={(e) => field.handleChange(e.target.value)}
//                         />
//                         {field.state.meta.errors && (
//                            <p className="text-sm text-destructive">
//                               {field.state.meta.errors}
//                            </p>
//                         )}
//                      </div>
//                   )}
//                </form.Field>

//                <form.Field name="inventory_id">
//                   {(field) => (
//                      <div className="space-y-2">
//                         <Label>Inventory</Label>
//                         <Select
//                            value={field.state.value?.toString()}
//                            onValueChange={(value) => field.handleChange(value)}
//                         >
//                            <SelectTrigger>
//                               <SelectValue placeholder="Select inventory" />
//                            </SelectTrigger>
//                            <SelectContent>
//                               {inventories?.map((inv) => (
//                                  <SelectItem key={inv.id} value={inv.id.toString()}>
//                                     {inv.name}
//                                  </SelectItem>
//                               ))}
//                            </SelectContent>
//                         </Select>
//                      </div>
//                   )}
//                </form.Field>

//                <form.Field name="quantity">
//                   {(field) => (
//                      <div className="space-y-2">
//                         <Label>Quantity</Label>
//                         <Input
//                            type="number"
//                            min="0"
//                            step="any"
//                            value={field.state.value ?? 1}
//                            onChange={(e) => field.handleChange(Number(e.target.value))}
//                         />
//                         {field.state.meta.errors && (
//                            <p className="text-sm text-destructive">
//                               {field.state.meta.errors}
//                            </p>
//                         )}
//                      </div>
//                   )}
//                </form.Field>

//                <form.Field name="unit">
//                   {(field) => (
//                      <div className="space-y-2">
//                         <Label>Unit</Label>
//                         <Select
//                            value={field.state.value ?? undefined}
//                            onValueChange={(value: QuantityUnit) =>
//                               field.handleChange(value)
//                            }
//                         >
//                            <SelectTrigger>
//                               <SelectValue placeholder="Select unit" />
//                            </SelectTrigger>
//                            <SelectContent>
//                               {quantityUnits.map((unit) => (
//                                  <SelectItem key={unit} value={unit}>
//                                     {unit}
//                                  </SelectItem>
//                               ))}
//                            </SelectContent>
//                         </Select>
//                      </div>
//                   )}
//                </form.Field>
//             </CardContent>
//             <CardFooter>
//                <Button type="submit" disabled={addItem.isPending}>
//                   {addItem.isPending ? "Adding..." : "Add Item"}
//                </Button>
//             </CardFooter>
//          </form>
//       </Card>
//    );
// }
