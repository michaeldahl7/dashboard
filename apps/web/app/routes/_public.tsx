import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { PublicHeader } from '~/components/layout/public-header';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex-1">
        <div className="container mx-auto py-6">
          <Outlet />
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto flex justify-center gap-4 text-muted-foreground text-sm">
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms of Service
          </Link>
          <Link to="/dpa" className="transition-colors hover:text-foreground">
            Data Processing Agreement
          </Link>
        </div>
      </footer>
    </div>
  );
}
