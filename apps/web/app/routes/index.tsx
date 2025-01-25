import { createFileRoute, redirect } from '@tanstack/react-router';
import { Homepage } from '~/components/homepage';
import { PublicHeader } from '~/components/layout/public-header';
import { dashboardLinkOptions } from '~/utils/link-options';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect(dashboardLinkOptions);
    }
  },
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />
      <Homepage />
    </div>
  );
}
