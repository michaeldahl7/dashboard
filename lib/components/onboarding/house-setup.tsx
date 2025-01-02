import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '~/lib/components/ui/button'
import { Input } from '~/lib/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/lib/components/ui/card'
import { useCreateHouse } from '~/lib/services/house.query'

export function HouseSetup({ userId }: { userId: string }) {
  const [houseName, setHouseName] = useState('')
  const createHouse = useCreateHouse()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to KITCHN!</CardTitle>
          <CardDescription>
            Let's set up your first house to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="houseName">What should we call your house?</label>
            <Input
              id="houseName"
              placeholder="My Home"
              value={houseName}
              onChange={(e) => setHouseName(e.target.value)}
            />
          </div>
          <Button
            onClick={() => {
              createHouse.mutate(
                { name: houseName, ownerId: userId },
                {
                  onSuccess: (house) => {
                    navigate({
                      to: '/$userId/$houseId/setup',
                      params: { 
                        userId, 
                        houseId: house.id 
                      }
                    })
                  },
                }
              )
            }}
            disabled={!houseName}
          >
            Create House
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 