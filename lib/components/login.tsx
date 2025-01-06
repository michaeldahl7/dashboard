import { Mail } from "lucide-react";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { Separator } from "~/lib/components/ui/separator";
import { authClient } from "~/lib/utils/authClient";
import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";

export default function Login({ title }: { title: string }) {
  const router = useRouter();

  // Enable conditional UI for passkeys if supported
  useEffect(() => {
    if (
      !('PublicKeyCredential' in window) ||
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey({ 
      autoFill: true,
    }).then(() => {
      // Invalidate router to trigger re-auth and redirects
      router.invalidate();
    });
  }, [router]);

  const handlePasskeySignIn = async () => {
    try {
      await authClient.signIn.passkey();
      // Invalidate router to trigger re-auth and redirects
      router.invalidate();
    } catch (error) {
      console.error('Failed to sign in with passkey:', error);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "discord") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/"
      });
      router.invalidate();
    } catch (error) {
      console.error(`Failed to sign in with ${provider}:`, error);
    }
  };

  return (
    <>
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">Choose your preferred sign in method</p>
      </div>
      
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
            <Button 
              className="w-full"
              onClick={handlePasskeySignIn}
            >
              Continue with Passkey
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  or continue with
                </span>
              </div>
            </div>

            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("google")}
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => handleSocialSignIn("discord")}
            >
              Discord
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
