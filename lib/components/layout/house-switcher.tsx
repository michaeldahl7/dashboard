import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "~/lib/components/ui/dropdown-menu";
import {
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "~/lib/components/ui/sidebar";
import { useCurrentHouseQuery, useUserHousesQuery } from "~/lib/services/house.query";
import { Button } from "../ui/button";
import { Link } from "@tanstack/react-router";

export function HouseSwitcher() {
   const { data: currentHouse } = useCurrentHouseQuery();
   const { data: userHouses } = useUserHousesQuery();

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                     <div className="flex-1 text-left">
                        <p className="text-sm font-medium leading-none">
                           {currentHouse.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                           {currentHouse.role === "admin" ? "Admin" : "Member"}
                        </p>
                     </div>
                     <ChevronsUpDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="start" className="w-[200px]">
                  <DropdownMenuLabel>Switch house</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {userHouses.map((house) => (
                     <DropdownMenuItem key={house.id} asChild>
                        <Link
                           to="/dashboard"
                           search={{ houseId: house.id }}
                           className="w-full cursor-pointer"
                        >
                           {house.name}
                           <span className="ml-auto text-xs text-muted-foreground">
                              {house.role}
                           </span>
                        </Link>
                     </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     {/* <Link to="/houses/new" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create House
                     </Link> */}
                     <Button asChild variant="ghost" size="sm">
                        <div className="flex items-center gap-2">
                           <Plus className="h-4 w-4" />
                           Create House
                        </div>
                     </Button>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
