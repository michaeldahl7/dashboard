import { createFileRoute } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { useState } from "react";

export const Route = createFileRoute("/$userId/$houseId/settings")({
  component: HouseSettings,
});

function HouseSettings() {
  const { houseId } = Route.useParams();
  const [houseName, setHouseName] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">House Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="houseName">House Name</label>
            <div className="flex gap-2">
              <Input
                id="houseName"
                placeholder="Enter new house name"
                value={houseName}
                onChange={(e) => setHouseName(e.target.value)}
              />
              <Button variant="secondary">Update</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Danger Zone</h3>
            <Button variant="destructive">Delete House</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 