import { useForm } from '@tanstack/react-form'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Label } from '~/lib/components/ui/label'
import { checkUsername } from '~/lib/services/user.api'
import { useUpdateOnboardingStatus, useUpdateOnboardingStep } from '~/lib/services/user.query'
import { useNavigate } from '@tanstack/react-router'
import { z } from 'zod'

// Define the validation schema
const UsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Username can only contain lowercase letters, numbers, and dashes')
})

interface UsernameFormProps {
  userId: string;
  onSuccess: () => Promise<void>;
}

export function UsernameForm({ userId, onSuccess }: UsernameFormProps) {
  const updateOnboardingStatus = useUpdateOnboardingStatus()
  const updateOnboardingStep = useUpdateOnboardingStep()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      username: '',
    },
    onSubmit: async ({ value }) => {
      // Check if the username already exists
      const { exists } = await checkUsername({ data: { username: value.username } })
      if (exists) {
        alert('This username is already taken')
        return
      }

      // Update onboarding status and step
      await updateOnboardingStatus.mutateAsync({
        data: {
          userId,
          updates: { username: value.username }
        }
      })
      await updateOnboardingStep.mutateAsync({
        data: {
          userId,
          step: "house"
        }
      })
      navigate({ to: '/onboarding/house', replace: true })
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
          onBlurAsync: async ({ value }) => {
            if (!value) return 'Username is required'
              await UsernameFormSchema.parseAsync({ username: value })
          },
          onChangeAsync: async ({ value }) => {
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