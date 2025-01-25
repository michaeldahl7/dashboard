import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@munchy/ui/components/ui/breadcrumb';
import { Separator } from '@munchy/ui/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@munchy/ui/components/ui/sidebar';
import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from '@tanstack/react-router';
import { AppSidebar } from '~/components/layout/app-sidebar';

import {
  createDefaultHouseQueryOptions,
  getHousesQueryOptions,
} from '~/services/house/house.query';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: '/signup' });
    }

    if (!context.auth.user.currentHouseId) {
      // Create default house and set it as current
      await context.queryClient.ensureQueryData(
        createDefaultHouseQueryOptions()
      );
    }

    // Load houses data
    await context.queryClient.ensureQueryData(getHousesQueryOptions());

    return { user: context.auth.user };
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Munchy</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
