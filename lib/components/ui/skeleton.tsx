import type { ComponentProps } from "react";

import { cn } from "~/lib/utils";

const Skeleton = ({ className, ...props }: ComponentProps<"div">) => (
   <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
);

export { Skeleton };
