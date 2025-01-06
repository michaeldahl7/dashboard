import { createFileRoute, redirect } from '@tanstack/react-router'
import Signup from '~/lib/components/signup'

export const Route = createFileRoute('/signup')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: SignUpPage,
})

function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50">
      <Signup />
    </div>
  )
}
