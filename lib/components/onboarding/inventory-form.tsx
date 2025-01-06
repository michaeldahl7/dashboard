import { useForm } from '@tanstack/react-form'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/lib/components/ui/select'
import { useInventoryMutations } from '~/lib/services/inventory.query'
import { inventoryTypes } from "~/lib/server/schema/inventory.schema"
import { Plus, Trash2 } from 'lucide-react'
import type { InventoryType } from "~/lib/server/schema/inventory.schema"

interface InventoryFormProps {
  userId: string;
  houseId: string;
  onSuccess: () => Promise<void>;
}

type FormInventory = {
  name: string;
  type: InventoryType;
}

export function InventoryForm({ userId, houseId, onSuccess }: InventoryFormProps) {
  const { addInventory } = useInventoryMutations()

  const form = useForm<{ inventories: FormInventory[] }>({
    defaultValues: {
      inventories: [
        { name: "Fridge", type: "fridge" },
        { name: "Freezer", type: "freezer" },
        { name: "Pantry", type: "pantry" }
      ]
    },
    onSubmit: async ({ value }) => {
      await Promise.all(value.inventories.map(inventory => 
        addInventory.mutateAsync({
          ...inventory,
          houseId
        })
      ));
      await onSuccess();
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field name="inventories" mode="array">
        {(field) => (
          <div className="space-y-4">
            {field.state.value.map((location, index) => (
              <div 
                key={`${location.name}-${index}`} 
                className="space-y-4 p-4 border rounded-lg relative"
              >
                {index > 2 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => field.removeValue(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}

                <form.Field
                  name={`inventories[${index}].name`}
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) return 'Name is required'
                      if (value.length < 2) return 'Name must be at least 2 characters'
                      if (value.length > 50) return 'Name must be less than 50 characters'
                    }
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      {field.state.meta.errors && (
                        <p className="text-sm text-destructive">{field.state.meta.errors}</p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name={`inventories[${index}].type`}
                  validators={{
                    onChange: ({ value }) => {
                      if (!value) return 'Type is required'
                      if (!inventoryTypes.includes(value)) return 'Invalid type'
                    }
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => 
                          field.handleChange(value as typeof inventoryTypes[number])
                        }
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
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => field.pushValue({ 
                name: '', 
                type: "pantry" as const 
              })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        )}
      </form.Field>

      <Button 
        type="submit"
        className="w-full"
        disabled={!form.state.canSubmit || form.state.isSubmitting}
      >
        {form.state.isSubmitting ? 'Setting up...' : 'Complete Setup'}
      </Button>
    </form>
  )
}