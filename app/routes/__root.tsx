import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
   Outlet,
   ScrollRestoration,
   createRootRouteWithContext,
} from "@tanstack/react-router";
import { Meta, Scripts, createServerFn } from "@tanstack/start";
import { Suspense, lazy } from "react";

import fontsourceInter from "@fontsource-variable/inter?url";
import fontsourceJetBrainsMono from "@fontsource-variable/jetbrains-mono?url";

import { getWebRequest } from "vinxi/http";
import { ThemeProvider } from "~/lib/components/theme-provider";
import { type Auth, auth } from "~/lib/server/auth";
import appCss from "~/lib/styles/app.css?url";

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

const getAuth = createServerFn({ method: "GET" }).handler(async () => {
   const { headers } = getWebRequest();
   const session = await auth.api.getSession({ headers });
   const authResult: Auth = !session
      ? { isAuthenticated: false, user: null, session: null }
      : {
           isAuthenticated: true,
           user: session.user,
           session: session.session,
        };

   return authResult;
});

interface RouterContext {
   queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
   beforeLoad: async () => {
      const auth = await getAuth();
      return { auth };
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
         {
            rel: "icon",
            href: "/favicon.ico",
         },
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
      <html lang="en" suppressHydrationWarning>
         <head>
            <Meta />
         </head>
         <body>
            <ThemeProvider
               attribute="class"
               defaultTheme="system"
               enableSystem
               disableTransitionOnChange
            >
               {children}
            </ThemeProvider>
            <ScrollRestoration />
            <ReactQueryDevtools buttonPosition="bottom-left" />
            <Suspense>
               <TanStackRouterDevtools position="bottom-right" />
            </Suspense>

            <Scripts />
         </body>
      </html>
   );
}
