import { Link } from "@tanstack/react-router";
import { GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";
import { useCurrentHouseQuery } from "~/lib/services/house.query";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "~/lib/components/ui/sidebar";

export function NavMain() {
   const { data: currentHouse } = useCurrentHouseQuery();

   const routes = [
      {
         title: "Dashboard",
         url: "/dashboard",
         icon: SquareTerminal,
      },
      ...(currentHouse.role === "admin"
         ? [
              {
                 title: "Settings",
                 url: "/settings",
                 icon: Settings2,
              },
           ]
         : []),
   ];

   return (
      <SidebarMenu>
         {routes.map((item) => (
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
