import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "~/lib/components/ui/sidebar";

export function HouseSwitcher({
   houses,
}: {
   houses: {
      name: string;
      logo: React.ElementType;
   }[];
}) {
   const { isMobile } = useSidebar();
   const [activehouse, setActivehouse] = React.useState(houses[0]);

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                     size="lg"
                     className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                     <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <activehouse.logo className="size-4" />
                     </div>
                     <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{activehouse.name}</span>
                        {/* <span className="truncate text-xs">{activehouse.plan}</span> */}
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
                        onClick={() => setActivehouse(house)}
                        className="gap-2 p-2"
                     >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                           <house.logo className="size-4 shrink-0" />
                        </div>
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
