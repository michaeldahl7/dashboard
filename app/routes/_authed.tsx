import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppHeader } from '~/lib/components/layout/app-header'
import { authClient } from '~/lib/utils/authClient'

export const Route = createFileRoute('/_authed')({
  component: AuthedLayout,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/signup' });
    }
    return { user: context.auth.user };
  },
})

function AuthedLayout() {
  return (
    <main className="min-h-screen flex flex-col bg-background">
      <AppHeader />
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  )
}
