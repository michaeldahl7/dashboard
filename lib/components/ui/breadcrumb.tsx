// import { Slot } from "@radix-ui/react-slot";
// import * as React from "react";
// import { LuChevronsLeftRight, LuEllipsis } from "react-icons/lu";

// import { cn } from "~/lib/utils";

// const Breadcrumb = React.forwardRef<
//    HTMLElement,
//    React.ComponentPropsWithoutRef<"nav"> & {
//       separator?: React.ReactNode;
//    }
// >(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
// Breadcrumb.displayName = "Breadcrumb";

// const BreadcrumbList = React.forwardRef<
//    HTMLOListElement,
//    React.ComponentPropsWithoutRef<"ol">
// >(({ className, ...props }, ref) => (
//    <ol
//       ref={ref}
//       className={cn(
//          "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
//          className,
//       )}
//       {...props}
//    />
// ));
// BreadcrumbList.displayName = "BreadcrumbList";

// const BreadcrumbItem = React.forwardRef<
//    HTMLLIElement,
//    React.ComponentPropsWithoutRef<"li">
// >(({ className, ...props }, ref) => (
//    <li
//       ref={ref}
//       className={cn("inline-flex items-center gap-1.5", className)}
//       {...props}
//    />
// ));
// BreadcrumbItem.displayName = "BreadcrumbItem";

// const BreadcrumbLink = React.forwardRef<
//    HTMLAnchorElement,
//    React.ComponentPropsWithoutRef<"a"> & {
//       asChild?: boolean;
//    }
// >(({ asChild, className, ...props }, ref) => {
//    const Comp = asChild ? Slot : "a";

//    return (
//       <Comp
//          ref={ref}
//          className={cn("transition-colors hover:text-foreground", className)}
//          {...props}
//       />
//    );
// });
// BreadcrumbLink.displayName = "BreadcrumbLink";

// const BreadcrumbPage = React.forwardRef<
//    HTMLSpanElement,
//    React.ComponentPropsWithoutRef<"span">
// >(({ className, ...props }, ref) => (
//    <span
//       ref={ref}
//       role="link"
//       aria-disabled="true"
//       aria-current="page"
//       tabIndex={0}
//       className={cn("font-normal text-foreground", className)}
//       {...props}
//    />
// ));
// BreadcrumbPage.displayName = "BreadcrumbPage";

// const BreadcrumbSeparator = ({
//    children,
//    className,
//    ...props
// }: React.ComponentProps<"li">) => (
//    <li
//       role="presentation"
//       aria-hidden="true"
//       className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
//       {...props}
//    >
//       {children ?? <LuChevronsLeftRight />}
//    </li>
// );
// BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
//    <span
//       role="presentation"
//       aria-hidden="true"
//       className={cn("flex h-9 w-9 items-center justify-center", className)}
//       {...props}
//    >
//       <LuEllipsis className="h-4 w-4" />
//       <span className="sr-only">More</span>
//    </span>
// );
// BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

// export {
//    Breadcrumb,
//    BreadcrumbList,
//    BreadcrumbItem,
//    BreadcrumbLink,
//    BreadcrumbPage,
//    BreadcrumbSeparator,
//    BreadcrumbEllipsis,
// };

import { LuChevronRight, LuEllipsis } from "react-icons/lu";
import type { ComponentProps } from "react";

import { Slot } from "~/lib/components/ui/slot";
import { cn } from "~/lib/utils";
import type { AsChildProps } from "~/lib/components/ui/slot";

function Breadcrumb(props: ComponentProps<"nav">) {
   return (
      <nav aria-label="breadcrumb" {...props}>
         {props.children}
      </nav>
   );
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
   return (
      <ol
         className={cn(
            "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
            className,
         )}
         {...props}
      />
   );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
   return <li className={cn("inline-flex items-center gap-1.5", className)} {...props} />;
}

function BreadcrumbLink({
   asChild,
   className,
   ...props
}: ComponentProps<"a"> & AsChildProps) {
   const Comp = asChild ? Slot : "a";

   return <Comp className={cn("hover:text-foreground", className)} {...props} />;
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
   return (
      // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
      <span
         role="link"
         aria-disabled="true"
         aria-current="page"
         className={cn("font-normal text-foreground", className)}
         {...props}
      />
   );
}

function BreadcrumbSeparator({ children, className, ...props }: ComponentProps<"li">) {
   return (
      <li
         role="presentation"
         aria-hidden="true"
         className={cn("[&>svg]:size-3.5", className)}
         {...props}
      >
         {children ?? <LuChevronRight />}
      </li>
   );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
   return (
      <span
         role="presentation"
         aria-hidden="true"
         className={cn("flex size-9 items-center justify-center", className)}
         {...props}
      >
         <LuEllipsis className="size-4" />
         <span className="sr-only">More</span>
      </span>
   );
}

export {
   Breadcrumb,
   BreadcrumbEllipsis,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbPage,
   BreadcrumbSeparator,
};
