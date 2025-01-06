import { Link } from '@tanstack/react-router'
import type { OnboardingStep } from '~/lib/server/schema/types'

export function OnboardingProgress({ currentStep }: { currentStep: OnboardingStep }) {
  return (
    <div className="flex gap-2">
      <Link 
        to="/" 
        activeProps={{ className: 'font-bold' }}
        preload="intent"
      >
        Username
      </Link>
      <Link 
        to="/onboarding/house"
        activeProps={{ className: 'font-bold' }}
        preload="intent"
      >
        House
      </Link>
      <Link 
        to="/onboarding/inventory"
        activeProps={{ className: 'font-bold' }}
        preload="intent"
      >
        Inventory
      </Link>
    </div>
  )
} 