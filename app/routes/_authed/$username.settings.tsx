import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/lib/components/ui/card";
import { Button } from "~/lib/components/ui/button";
import { Key, Shield } from "lucide-react";
import { Separator } from "~/lib/components/ui/separator";
import { useState } from "react";
import { authClient } from "~/lib/utils/authClient";

export const Route = createFileRoute('/_authed/$username/settings')({
  component: SettingsRoute
});

function SettingsRoute() {
  const [isRegistering, setIsRegistering] = useState(false);

  const handlePasskeyRegistration = async () => {
    try {
      setIsRegistering(true);
      await authClient.passkey.addPasskey();
      // Show success message
    } catch (error) {
      console.error('Failed to register passkey:', error);
      // Show error message
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security and sign-in methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <Key className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <h4 className="text-sm font-medium leading-none">
                  Passkey Authentication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use your device's biometrics or screen lock for secure, passwordless sign-in
                </p>
                <Button
                  onClick={handlePasskeyRegistration}
                  disabled={isRegistering}
                  className="mt-2"
                >
                  {isRegistering ? 'Setting up...' : 'Set up Passkey'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
