import { Link } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'

export function PublicHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-xl font-semibold">
          Kitchen Tracker
        </Link>
      </div>

      <nav className="flex items-center gap-4">
        <Button asChild variant="secondary">
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign up</Link>
        </Button>
      </nav>
    </header>
  )
} 