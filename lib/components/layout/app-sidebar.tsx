import type { ComponentProps } from "react";

import {
   LuBox,
   LuSettings2,
   LuLogOut,
   LuSquareTerminal,
   LuChevronsUpDown,
   LuPlus,
} from "react-icons/lu";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuShortcut,
} from "~/lib/components/ui/dropdown-menu";
import { useGetCurrentHouse, useGetHousesOfUser } from "~/lib/services/house/house.query";

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
   // const { data: currentHouse } = useGetCurrentHouse();

   const routes = [
      {
         title: "Dashboard",
         url: "/dashboard",
         icon: LuSquareTerminal,
      },
      {
         title: "Locations",
         url: "/locations",
         icon: LuBox,
      },
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
   const { data: currentHouse } = useGetCurrentHouse();
   const { data: houses } = useGetHousesOfUser();
   console.log("Current House:", currentHouse, "Houses:", houses);
   const { isMobile } = useSidebar();

   if (!currentHouse || !houses) return null;

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                           {currentHouse.name}
                        </span>
                     </div>
                     <LuChevronsUpDown className="ml-auto" />
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
                     <DropdownMenuItem key={house.name} className="gap-2 p-2">
                        {house.name}
                        <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                     </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 p-2">
                     <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                        <LuPlus className="size-4" />
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
                     <LuChevronsUpDown className="ml-auto h-4 w-4" />
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
