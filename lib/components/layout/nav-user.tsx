import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/lib/components/ui/avatar";
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
import { authClient } from "~/lib/utils/authClient";
import { useCurrentAuthQuery } from "~/lib/services/auth.query";
import { Button } from "../ui/button";

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
                  <DropdownMenuItem asChild>
                     <Button
                        onClick={() => {
                           authClient.signOut().then(() => {
                              window.location.reload();
                              window.location.href = "/";
                           });
                        }}
                        className="flex w-full cursor-pointer items-center gap-2"
                     >
                        <LogOut className="h-4 w-4" />
                        Sign out
                     </Button>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
