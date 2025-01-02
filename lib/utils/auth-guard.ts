import type { User } from '~/lib/types/user'
import { redirect } from '@tanstack/react-router'

export function createProtectedRoute<T>(config: T) {
  return {
    ...config,
    beforeLoad: async ({ context }: { context: { user: User | null } }) => {
      if (!context.user) {
        throw redirect({ to: '/signin' })
      }
      return { user: context.user }
    },
  }
} 