import { useForm } from '@tanstack/react-form'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { useHouseMutations } from '~/lib/services/house.query'
import { updateOnboardingStep, updateOnboardingStatus } from '~/lib/services/user.api'
import { useNavigate } from '@tanstack/react-router'

interface HouseFormProps {
  userId: string;
  onSuccess: () => Promise<void>;
}

export function HouseForm({ userId, onSuccess }: HouseFormProps) {
  const { addHouse } = useHouseMutations()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: async ({ value }) => {
      const { house } = await addHouse.mutateAsync({ name: value.name });
      await updateOnboardingStatus({ 
        data: {
          userId,
          updates: { currentHouseId: house.id }
        }
      });
      navigate({ 
        to: '/onboarding/inventory',
        replace: true
      })
    }
  })

  const isSubmitting = form.state.isSubmitting || addHouse.isPending

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onBlur: ({ value }) => {
            if (!value) return 'House name is required'
            if (value.length < 2) return 'House name must be at least 2 characters'
            if (value.length > 50) return 'House name must be less than 50 characters'
          }
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label>House Name</Label>
            <Input
              placeholder="My Kitchen"
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

      <Button 
        type="submit"
        className="w-full"
        disabled={!form.state.canSubmit || isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create House'}
      </Button>
    </form>
  )
} 