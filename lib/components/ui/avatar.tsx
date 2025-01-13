// import * as AvatarPrimitive from "@radix-ui/react-avatar";
// import * as React from "react";

// import { cn } from "~/lib/utils";

// const Avatar = React.forwardRef<
//    React.ElementRef<typeof AvatarPrimitive.Root>,
//    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
// >(({ className, ...props }, ref) => (
//    <AvatarPrimitive.Root
//       ref={ref}
//       className={cn(
//          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
//          className,
//       )}
//       {...props}
//    />
// ));
// Avatar.displayName = AvatarPrimitive.Root.displayName;

// const AvatarImage = React.forwardRef<
//    React.ElementRef<typeof AvatarPrimitive.Image>,
//    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
// >(({ className, ...props }, ref) => (
//    <AvatarPrimitive.Image
//       ref={ref}
//       className={cn("aspect-square h-full w-full", className)}
//       {...props}
//    />
// ));
// AvatarImage.displayName = AvatarPrimitive.Image.displayName;

// const AvatarFallback = React.forwardRef<
//    React.ElementRef<typeof AvatarPrimitive.Fallback>,
//    React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
// >(({ className, ...props }, ref) => (
//    <AvatarPrimitive.Fallback
//       ref={ref}
//       className={cn(
//          "flex h-full w-full items-center justify-center rounded-full bg-muted",
//          className,
//       )}
//       {...props}
//    />
// ));
// AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

// export { Avatar, AvatarImage, AvatarFallback };

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
   return (
      <AvatarPrimitive.Root
         className={cn(
            "relative flex size-10 shrink-0 overflow-hidden rounded-full",
            className,
         )}
         {...props}
      />
   );
}

function AvatarImage({
   className,
   ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
   return (
      <AvatarPrimitive.Image
         className={cn("aspect-square size-full", className)}
         {...props}
      />
   );
}

function AvatarFallback({
   className,
   ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
   return (
      <AvatarPrimitive.Fallback
         className={cn(
            "flex size-full items-center justify-center rounded-full bg-muted",
            className,
         )}
         {...props}
      />
   );
}

export { Avatar, AvatarFallback, AvatarImage };
