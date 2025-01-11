import { MingcuteDashboardLine, MingcuteSettingsLine } from "~/lib/components/icons";
import type { ComponentType, SVGProps } from "react";

interface NavigationItem {
   title: string;
   href: "/_authed/dashboard" | "/_authed/settings";
   icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const navigationItems: NavigationItem[] = [
   {
      title: "Dashboard",
      href: "/_authed/dashboard",
      icon: MingcuteDashboardLine,
   },
   {
      title: "Settings",
      href: "/_authed/settings",
      icon: MingcuteSettingsLine,
   },
];
