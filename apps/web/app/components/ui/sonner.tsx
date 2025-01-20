import { Toaster as Sonner } from "sonner";
import type { ComponentProps } from "react";

import { useTheme } from "next-themes";

function Toaster(props: ComponentProps<typeof Sonner>) {
   const { theme = "system" } = useTheme();

   return (
      <Sonner
         theme={theme as "light" | "dark" | "system"}
         style={{ zIndex: 999 }}
         className="toaster group"
         toastOptions={{
            classNames: {
               toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans",
               description: "group-[.toast]:text-muted-foreground",
               actionButton:
                  "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
               cancelButton:
                  "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
            },
         }}
         {...props}
      />
   );
}

export { Toaster };
