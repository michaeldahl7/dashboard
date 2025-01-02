import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { useCreateHouse } from "~/lib/services/house.query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

export function CreateHouseOnboarding({ userId }: { userId: string }) {
  const [houseName, setHouseName] = useState("");
  const createHouse = useCreateHouse();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to KITCHN!</CardTitle>
          <CardDescription>
            Let's set up your first house to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="houseName">House Name</label>
            <Input
              id="houseName"
              placeholder="My House"
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
                      to: "/$userId/$houseId",
                      params: { userId, houseId: house.id },
                    });
                  },
                }
              );
            }}
            disabled={!houseName}
          >
            Create House
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 