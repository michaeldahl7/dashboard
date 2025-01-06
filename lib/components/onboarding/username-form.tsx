import { useForm } from '@tanstack/react-form'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { useUpdateOnboardingStatus } from '~/lib/services/user.query'
import { useUpdateOnboardingStep } from '~/lib/services/user.query'
// import { navigate } from '~/lib/services/navigation.api'

interface UsernameFormProps {
  userId: string;
  onSuccess: () => Promise<void>;
}

export function UsernameForm({ userId, onSuccess }: UsernameFormProps) {
  const updateOnboardingStatus = useUpdateOnboardingStatus()
  const updateOnboardingStep = useUpdateOnboardingStep()

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      await updateOnboardingStatus({ 
        data: {
          userId,
          updates: { username: value.username }
        }
      });
      await updateOnboardingStep({
        data: {
          userId,
          step: "house"
        }
      });
      navigate({ to: '/onboarding/house', replace: true });
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
      <form.Field
        name="username"
        validators={{
          onBlur: ({ value }) => {
            if (!value) return 'Username is required'
            if (value.length < 3) return 'Username must be at least 3 characters'
            if (!/^[a-z0-9-]+$/.test(value)) {
              return 'Username can only contain lowercase letters, numbers, and dashes'
            }
          },
          onBlurAsync: async ({ value }) => {
            if (!value) return
            const { exists } = await checkUsername({ data: { username: value } })
            return exists ? 'This username is already taken' : undefined
          }
        }}
      >
        {(field) => (
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              placeholder="username"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value.toLowerCase())}
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
        disabled={!form.state.canSubmit || form.state.isSubmitting}
      >
        {form.state.isSubmitting ? 'Setting up...' : 'Continue'}
      </Button>
    </form>
  )
} 