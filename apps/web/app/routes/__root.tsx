import type { QueryClient } from '@tanstack/react-query';
import {
  Outlet,
  ScrollRestoration,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { Meta, Scripts } from '@tanstack/start';
import { Suspense, lazy } from 'react';
import type React from 'react';

import { Toaster } from '~/components/ui/sonner';

import fontsourceInter from '@fontsource-variable/inter?url';
import fontsourceJetBrainsMono from '@fontsource-variable/jetbrains-mono?url';

import appCss from '~/styles/app.css?url';
// import appCss from "@munchy/ui/globals.css?url";

import { ThemeProvider } from '~/components/theme-provider';

import { getAuth } from '~/services/auth.api';

const TanStackRouterDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/router-devtools').then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

const TanStackQueryDevtools =
  process.env.NODE_ENV === 'production'
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import('@tanstack/react-query-devtools').then((res) => ({
          default: res.ReactQueryDevtools,
        }))
      );

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
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'KITCN',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'stylesheet',
        href: fontsourceInter,
      },
      {
        rel: 'stylesheet',
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
        <ThemeProvider attribute="class">
          {children}
          <Toaster />
        </ThemeProvider>
        <ScrollRestoration />
        <Suspense>
          <TanStackQueryDevtools buttonPosition="bottom-left" />
        </Suspense>
        <Suspense>
          <TanStackRouterDevtools position="bottom-right" />
        </Suspense>
        <Scripts />
      </body>
    </html>
  );
}
