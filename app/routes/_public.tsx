import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold">
            Kitchen Tracker
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto flex justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link to="/dpa" className="hover:text-foreground transition-colors">
            Data Processing Agreement
          </Link>
        </div>
      </footer>
    </div>
  )
}
