import type { User } from './user'

type AuthRouteConfig = {
  beforeLoad: ({ context }: { context: { user: User | null } }) => Promise<{ user: User }>
}

declare module '@tanstack/react-router' {
  interface Register {
    protectedRoutes: AuthRouteConfig
  }
} 