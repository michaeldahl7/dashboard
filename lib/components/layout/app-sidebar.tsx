import { Link, useRouter } from '@tanstack/react-router'
import {
  BarChart,
  Calendar,
  KanbanSquare,
  LayoutDashboard,
  Settings,
  ShoppingCart,
} from "lucide-react"
import { Button } from '~/lib/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '~/lib/components/ui/sidebar'
import { authClient } from '~/lib/utils/authClient'

const mainNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Shopping List",
    icon: ShoppingCart,
    href: "/shopping",
  },
  {
    title: "Meal Planner",
    icon: Calendar,
    href: "/meals",
  },
  {
    title: "Usage Stats",
    icon: BarChart,
    href: "/stats",
  },
  {
    title: "Categories",
    icon: KanbanSquare,
    href: "/categories",
  },
];

interface AppSidebarProps {
  username: string;
}

export function AppSidebar({ username }: AppSidebarProps) {
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <Link to="/" className="flex items-center gap-2 px-2">
          <span className="text-lg font-bold">Kitchen Tracker</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-2"
                      activeProps={{
                        className: "bg-accent text-accent-foreground",
                      }}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link
                  to="/$username/settings"
                  params={{ username }}
                  className="flex items-center gap-2"
                  activeProps={{
                    className: "bg-accent text-accent-foreground",
                  }}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={async () => {
                  await authClient.signOut();
                  router.invalidate();
                }}
              >
                Sign out
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  )
}