import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { PublicHeader } from '~/lib/components/layout/public-header'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicHeader />

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
