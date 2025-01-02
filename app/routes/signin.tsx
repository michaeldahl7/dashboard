import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'
// import { Discord } from 'lucide-react'

export const Route = createFileRoute('/signin')({
  component: SignIn,
})

function SignIn() {
  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">Welcome to KITCHN</h1>
      <Button
        size="lg"
        className="flex items-center gap-2"
        onClick={() => {
          // Redirect to Discord OAuth
          window.location.href = '/api/auth/discord'
        }}
      >
        {/* <Discord className="h-5 w-5" /> */}
        Sign in with Discord
      </Button>
    </div>
  )
}
