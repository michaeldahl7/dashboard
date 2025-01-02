import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/lib/components/ui/tabs'
import { AddInventoryForm } from '~/lib/components/inventory-form'
import { ItemForm } from '~/lib/components/item-form'

export const Route = createFileRoute('/$userId/$houseId/setup')({
  component: HouseSetup
})

function HouseSetup() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>Set Up Your House</CardTitle>
          <CardDescription>
            Let's add some inventory spaces and items to your house
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="inventory">Add Inventory Spaces</TabsTrigger>
              <TabsTrigger value="items">Add Items</TabsTrigger>
            </TabsList>
            <TabsContent value="inventory">
              <AddInventoryForm />
            </TabsContent>
            <TabsContent value="items">
              <ItemForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 