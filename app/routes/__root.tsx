import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts, createServerFn } from "@tanstack/start";
import { Suspense, lazy } from "react";
// import type { RouterContext } from "~/app/router";

import fontsourceInter from "@fontsource-variable/inter?url";
import fontsourceJetBrainsMono from "@fontsource-variable/jetbrains-mono?url";

import appCss from "~/lib/styles/app.css?url";
// import { authQueryOptions } from "~/lib/services/auth.query";
import { getWebRequest } from "vinxi/http";
import { auth } from "~/lib/server/auth";

const TanStackRouterDevtools =
   process.env.NODE_ENV === "production"
      ? () => null // Render nothing in production
      : lazy(() =>
           // Lazy load in development
           import("@tanstack/router-devtools").then((res) => ({
              default: res.TanStackRouterDevtools,
           })),
        );

const TanStackQueryDevtools =
   process.env.NODE_ENV === "production"
      ? () => null // Render nothing in production
      : lazy(() =>
           // Lazy load in development
           import("@tanstack/react-query-devtools").then((res) => ({
              default: res.ReactQueryDevtools,
           })),
        );

const getUser = createServerFn({ method: "GET" }).handler(async () => {
   const { headers } = getWebRequest();
   const session = await auth.api.getSession({ headers });

   return session?.user || null;
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
   beforeLoad: async () => {
      const user = await getUser();
      return { user };
   },
   head: () => ({
      meta: [
         {
            charSet: "utf-8",
         },
         {
            name: "viewport",
            content: "width=device-width, initial-scale=1",
         },
         {
            title: "KITCN",
         },
      ],
      links: [
         { rel: "stylesheet", href: appCss },
         {
            rel: "stylesheet",
            href: fontsourceInter,
         },
         {
            rel: "stylesheet",
            href: fontsourceJetBrainsMono,
         },
      ],
   }),
   component: RootComponent,
});

function RootComponent() {
   return (
      <RootDocument>
         <Outlet />
      </RootDocument>
   );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <Meta />
         </head>
         <body>
            {children}
            <ScrollRestoration />
            <Scripts />
         </body>
      </html>
   );
}
