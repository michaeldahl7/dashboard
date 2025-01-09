import { SidebarTrigger } from "~/lib/components/ui/sidebar";
import { ModeToggle } from "~/lib/components/mode-toggle";
import { Button } from "~/lib/components/ui/button";
import { authClient } from "~/lib/utils/authClient";

export function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => authClient.signOut()}
        >
          Sign out
        </Button>
      </div>
    </header>
  );
}
