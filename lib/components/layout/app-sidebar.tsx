import type { ComponentProps } from "react";
import { ChevronsUpDown, Plus, Settings2, SquareTerminal } from "lucide-react";
import { LuLogOut } from "react-icons/lu";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuShortcut,
} from "~/lib/components/ui/dropdown-menu";
import { useCurrentHouseQuery, useUserHousesQuery } from "~/lib/services/house.query";
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarRail,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "~/lib/components/ui/sidebar";
import { useCurrentAuthQuery } from "~/lib/services/auth.query";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
import { authClient } from "~/lib/utils/authClient";
import { Link } from "@tanstack/react-router";

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

export function HouseSwitcher() {
   const { data: currentHouse } = useCurrentHouseQuery();
   const { data: houses } = useUserHousesQuery();
   const { isMobile } = useSidebar();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <currentHouse.logo className="size-4" />
                     </div> */}
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                           {currentHouse.name}
                        </span>
                        {/* <span className="truncate text-xs">{currentHouse.plan}</span> */}
                     </div>
                     <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side={isMobile ? "bottom" : "right"}
                  sideOffset={4}
               >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                     Houses
                  </DropdownMenuLabel>
                  {houses.map((house, index) => (
                     <DropdownMenuItem
                        key={house.name}
                        // onClick={() => setActivehouse(house)}
                        className="gap-2 p-2"
                     >
                        {/* <div className="flex size-6 items-center justify-center rounded-sm border">
                           <house.logo className="size-4 shrink-0" />
                        </div> */}
                        {house.name}
                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                     </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                     <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <Plus className="size-4" />
                     </div>
                     <div className="font-medium text-muted-foreground">Add house</div>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}

export function NavUser() {
   const { data: auth } = useCurrentAuthQuery();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                     <Avatar className="h-8 w-8">
                        <AvatarImage
                           src={auth.user.image ?? ""}
                           alt={auth.user.name ?? ""}
                        />
                        <AvatarFallback>
                           {auth.user.name?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                     </Avatar>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="font-semibold">{auth.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                           {auth.user.email}
                        </span>
                     </div>
                     <ChevronsUpDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                     onSelect={() =>
                        authClient.signOut().then(() => {
                           window.location.reload();
                           window.location.href = "/";
                        })
                     }
                  >
                     <LuLogOut />
                     Sign Out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
