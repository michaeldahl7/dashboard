import { createFileRoute, redirect } from '@tanstack/react-router'
import Login from '~/lib/components/login'

export const Route = createFileRoute('/login')({
  beforeLoad: async ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50">
      <Login title="Welcome back" />
    </div>
  )
}
