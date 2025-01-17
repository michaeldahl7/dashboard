import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "~/lib/components/theme-toggle";
import { Button } from "~/lib/components/ui/button";
import { authClient } from "~/lib/utils/authClient";
import { LuHouse } from "react-icons/lu";

export function AppHeader() {
   return (
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
         <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
               <Link to="/dashboard" className="font-semibold">
                  <LuHouse />
               </Link>
            </Button>
         </div>

         <div className="flex items-center gap-4">
            <ThemeToggle />
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
