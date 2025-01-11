import { Link } from "@tanstack/react-router";
import { ModeToggle } from "~/lib/components/mode-toggle";
import { Button } from "~/lib/components/ui/button";
import { SidebarTrigger } from "~/lib/components/ui/sidebar";
import { authClient } from "~/lib/utils/authClient";
import { MingcuteHomeLine } from "../icons";

export function AppHeader() {
   return (
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
         <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
               <Link to="/dashboard" className="font-semibold">
                  <MingcuteHomeLine />
               </Link>
            </Button>
         </div>

         <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
               variant="ghost"
               size="sm"
               onClick={() => {
                  authClient.signOut().then(() => {
                     window.location.reload();
                     window.location.href = "/";
                  });
               }}
            >
               Sign out
            </Button>
         </div>
      </header>
   );
}
