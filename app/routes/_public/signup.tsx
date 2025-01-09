import { createFileRoute, redirect } from '@tanstack/react-router'
import Signup from '~/lib/components/signup'

export const Route = createFileRoute('/_public/signup')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: SignupPage,
})

function SignupPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
      <Signup />
    </div>
  )
} 