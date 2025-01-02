import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { Button } from "~/lib/components/ui/button";
import { Input } from "~/lib/components/ui/input";
import { useState } from "react";

export const Route = createFileRoute("/$userId/settings")({
  component: UserSettings,
});

function UserSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-4xl font-bold">User Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Name</label>
            <div className="flex gap-2">
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Button variant="secondary">Update</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="secondary">Update</Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-medium">Danger Zone</h3>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 