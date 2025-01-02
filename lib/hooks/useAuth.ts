import { Route } from '@tanstack/react-router'
import type { User } from '~/lib/types/user'

export function useAuth() {
  const { user } = Route.useRouteContext()
  if (!user) throw new Error('No user found in protected route')
  return user as User
} 