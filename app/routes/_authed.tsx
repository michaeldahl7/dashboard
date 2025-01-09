import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'
import { authClient } from '~/lib/utils/authClient'
import { ModeToggle } from '~/lib/components/mode-toggle'

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
      <header className="flex h-16 shrink-0 items-center justify-end border-b px-4">
        <div className="flex items-center gap-4">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => authClient.signOut()}
          >
            Sign out
          </Button>
        </div>
      </header>
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </main>
  )
}
