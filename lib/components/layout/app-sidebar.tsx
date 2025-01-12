import { NavMain } from "~/lib/components/layout/nav-main";
import { NavUser } from "~/lib/components/layout/nav-user";
import { HouseSwitcher } from "~/lib/components/layout/house-switcher";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarRail,
} from "~/lib/components/ui/sidebar";
import type { ComponentProps } from "react";

export function AppSidebar(props: ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <HouseSwitcher />
         </SidebarHeader>
         <SidebarContent>
            <NavMain />
         </SidebarContent>
         <SidebarFooter>
            <NavUser />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   );
}
