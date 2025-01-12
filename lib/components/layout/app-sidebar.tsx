import { GalleryVerticalEnd, Settings2, SquareTerminal } from "lucide-react";

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

// import { linkOptions } from "@tanstack/react-router";
// import { MingcuteHomeLine, MingcuteSettingsLine } from "../icons";

// const dashboardLinkOptions = linkOptions([
//    {
//       to: "/dashboard",
//       title: "Dashboard",
//       icon: MingcuteHomeLine,
//       activeOptions: { exact: true },
//    },
//    {
//       to: "/settings",
//       title: "Settings",
//       icon: MingcuteSettingsLine,
//    },
// ]);

// This is sample data.
const data = {
   user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
   },
   houses: [
      {
         name: "My House",
         logo: GalleryVerticalEnd,
      },
   ],
   navMain: [
      {
         title: "Dashboard",
         url: "/dashboard",
         icon: SquareTerminal,
         isActive: true,
      },

      {
         title: "Settings",
         url: "/settings",
         icon: Settings2,
      },
   ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   return (
      <Sidebar {...props}>
         <SidebarHeader>
            <HouseSwitcher houses={data.houses} />
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={data.navMain} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser user={data.user} />
         </SidebarFooter>
         <SidebarRail />
      </Sidebar>
   );
}
