import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "~/lib/components/ui/sidebar";

export function NavMain({
   items,
}: {
   items: {
      title: string;
      url: string;
      icon?: LucideIcon;
      isActive?: boolean;
   }[];
}) {
   return (
      <SidebarMenu>
         {items.map((item) => (
            <SidebarMenuItem key={item.title}>
               <SidebarMenuButton asChild>
                  <Link to={item.url}>
                     {item.icon && <item.icon />}
                     <span>{item.title}</span>
                  </Link>
               </SidebarMenuButton>
            </SidebarMenuItem>
         ))}
      </SidebarMenu>
   );
}
