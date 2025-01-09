import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  ShoppingCart,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '~/lib/components/ui/sidebar'

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
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-lg font-semibold">Kitchen Tracker</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link to={item.href} className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}