import type { ComponentProps } from "react";

import {
   LuBox,
   LuChefHat,
   LuLogOut,
   LuSquareTerminal,
   LuChevronsUpDown,
   LuPlus,
   LuMapPin,
} from "react-icons/lu";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
   DropdownMenuShortcut,
} from "~/app/components/ui/dropdown-menu";
import {
   useCreateHouse,
   useCurrentHouse,
   useHouses,
   useSetCurrentHouse,
   getHousesQueryOptions,
   getCurrentHouseQueryOptions,
} from "~/app/services/house/house.query";

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
} from "~/app/components/ui/sidebar";
import { useCurrentAuthQuery } from "~/app/services/auth.query";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarFallback, AvatarImage } from "~/app/components/ui/avatar";
import { authClient } from "~/app/utils/authClient";
import { Link } from "@tanstack/react-router";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "~/app/components/ui/dialog";
import { Button } from "~/app/components/ui/button";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "~/app/components/ui/input";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const createHouseSchema = z.object({
   name: z.string().min(1, "House name is required").max(50, "Name too long"),
});

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
         title: "Items",
         url: "/items",
         icon: LuChefHat,
      },
      {
         title: "Locations",
         url: "/locations",
         icon: LuMapPin,
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
   const { data: currentHouse } = useCurrentHouse();
   const { data: houses } = useHouses();
   const { isMobile } = useSidebar();
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const createHouse = useCreateHouse();
   const setCurrentHouse = useSetCurrentHouse();

   const form = useForm({
      defaultValues: {
         name: "",
      },
      onSubmit: async ({ value }) => {
         try {
            await createHouse.mutateAsync({ name: value.name });
            setIsDialogOpen(false);
         } catch (error) {
            console.error("Failed to create house:", error);
         }
      },
   });

   if (!currentHouse || !houses) return null;

   return (
      <>
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
                        <DropdownMenuItem
                           key={house.name}
                           className="gap-2 p-2"
                           onSelect={() => {
                              setCurrentHouse.mutate(house.id);
                           }}
                        >
                           {house.name}
                           <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                        </DropdownMenuItem>
                     ))}
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        className="gap-2 p-2"
                        onSelect={() => setIsDialogOpen(true)}
                     >
                        <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                           <LuPlus className="size-4" />
                        </div>
                        <div className="font-medium text-muted-foreground">Add house</div>
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </SidebarMenuItem>
         </SidebarMenu>

         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Create New House</DialogTitle>
               </DialogHeader>
               <form
                  onSubmit={(e) => {
                     e.preventDefault();
                     e.stopPropagation();
                     form.handleSubmit();
                  }}
                  className="space-y-4"
               >
                  <form.Field
                     name="name"
                     validators={{
                        onChange: z.string().min(1, "House name is required"),
                     }}
                  >
                     {(field) => (
                        <div>
                           <Input
                              placeholder="Enter house name"
                              value={field.state.value}
                              onChange={(e) => field.handleChange(e.target.value)}
                           />
                           {field.state.meta.errors && (
                              <span className="text-sm text-destructive">
                                 {field.state.meta.errors.join(", ")}
                              </span>
                           )}
                        </div>
                     )}
                  </form.Field>
                  <div className="flex justify-end gap-2">
                     <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        type="button"
                     >
                        Cancel
                     </Button>
                     <Button type="submit" disabled={createHouse.isPending}>
                        {createHouse.isPending ? "Creating..." : "Create House"}
                     </Button>
                  </div>
               </form>
            </DialogContent>
         </Dialog>
      </>
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
