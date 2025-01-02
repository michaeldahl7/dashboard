import { createFileRoute } from "@tanstack/react-router";
import { AddInventoryForm } from "~/lib/components/inventory-form";
import { ItemForm } from "~/lib/components/item-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/lib/components/ui/tabs";

export const Route = createFileRoute("/$userId/$houseId/inventory")({
  component: HouseInventory,
});

function HouseInventory() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Inventory Management</h2>
      
      <Tabs defaultValue="inventory" className="w-full max-w-2xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="inventory">Add Inventory</TabsTrigger>
          <TabsTrigger value="item">Add Item</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory">
          <AddInventoryForm />
        </TabsContent>
        <TabsContent value="item">
          <ItemForm />
        </TabsContent>
      </Tabs>
    </div>
  );
} 