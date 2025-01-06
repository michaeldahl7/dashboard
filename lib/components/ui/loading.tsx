import { useNavigation } from "@tanstack/react-router"
import { Progress } from "~/lib/components/ui/progress"

export function LoadingBar() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  if (!isLoading) return null

  return (
    <Progress 
      value={undefined} 
      className="fixed top-0 w-full h-1 z-50 animate-pulse" 
    />
  )
} 