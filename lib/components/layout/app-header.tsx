import { Link, useLocation } from "@tanstack/react-router";
import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/lib/components/ui/breadcrumb";
import { Separator } from "~/lib/components/ui/separator";
import { SidebarTrigger } from "~/lib/components/ui/sidebar";
import { ModeToggle } from "~/lib/components/mode-toggle";

export function AppHeader() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  // Convert path to readable title
  const getReadableTitle = (path: string) => {
    return path
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>

            {paths.map((path, idx) => {
              const isLast = idx === paths.length - 1;
              const hasNext = idx + 1 < paths.length;
              const title = getReadableTitle(path);
              const href = `/${paths.slice(0, idx + 1).join("/")}`;

              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={href}>{title}</Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
}
