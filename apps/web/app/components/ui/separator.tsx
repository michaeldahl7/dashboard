import * as SeparatorPrimitive from "@radix-ui/react-separator";
import type { ComponentProps } from "react";

import { cn } from "~/app/utils";

function Separator({
   decorative = true,
   orientation = "horizontal",
   className,
   ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
   return (
      <SeparatorPrimitive.Root
         decorative={decorative}
         orientation={orientation}
         className={cn(
            "shrink-0 bg-border",
            orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
            className,
         )}
         {...props}
      />
   );
}

export { Separator };
