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
} from "~/lib/components/ui/sidebar";

import { Link, linkOptions } from "@tanstack/react-router";
import { MingcuteHomeLine, MingcuteSettingsLine } from "~/lib/components/icons";

// // Menu items.
// const items = [
//    {
//       title: "Home",
//       url: "/dashboard",
//       icon: MingcuteHomeLine,
//    },
//    {
//       title: "Settings",
//       url: "/settings",
//       icon: MingcuteSettingsLine,
//    },
// ];

const dashboardLinkOptions = linkOptions([
   {
      to: "/dashboard",
      label: "Dashboard",
      icon: MingcuteHomeLine,
      activeOptions: { exact: true },
   },
   {
      to: "/settings",
      label: "Settings",
      icon: MingcuteSettingsLine,
   },
]);

export function AppSidebar() {
   return (
      <Sidebar>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Kitchn</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {dashboardLinkOptions.map((item) => (
                        <SidebarMenuItem key={item.label}>
                           <SidebarMenuButton asChild>
                              <Link to={item.to}>
                                 <item.icon />
                                 <span>{item.label}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </Sidebar>
   );
}
