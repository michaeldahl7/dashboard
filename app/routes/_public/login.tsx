import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { MingcuteMailLine } from "~/lib/components/icons";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { Separator } from "~/lib/components/ui/separator";
import { dashboardLinkOptions } from "~/lib/utils";
import { authClient } from "~/lib/utils/authClient";
import { socialProviders, type SocialProvider } from "~/lib/config/social-provider";
import { cx } from "class-variance-authority";

export const Route = createFileRoute("/_public/login")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect(dashboardLinkOptions);
      }
   },
   component: LoginPage,
});

export function LoginPage() {
   const router = useRouter();

   useEffect(() => {
      if (
         !("PublicKeyCredential" in window) ||
         !PublicKeyCredential.isConditionalMediationAvailable ||
         !PublicKeyCredential.isConditionalMediationAvailable()
      ) {
         return;
      }

      void authClient.signIn
         .passkey({
            autoFill: true,
         })
         .then(() => {
            router.invalidate();
         });
   }, [router]);

   const handlePasskeySignIn = async () => {
      try {
         await authClient.signIn.passkey();
         router.invalidate();
      } catch (error) {
         console.error("Failed to sign in with passkey:", error);
      }
   };

   const handleSocialSignIn = async (provider: SocialProvider["id"]) => {
      try {
         await authClient.signIn.social({
            provider,
            callbackURL: "/",
         });
         router.invalidate();
      } catch (error) {
         console.error(`Failed to sign in with ${provider}:`, error);
      }
   };

   return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
         <div className="mb-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Choose your preferred sign in method</p>
         </div>

         <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
               <div className="flex flex-col gap-4">
                  <Button className="w-full" onClick={handlePasskeySignIn}>
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

                  {socialProviders.map((socialProvider) => (
                     <Button
                        key={socialProvider.id}
                        variant="outline"
                        onClick={() => handleSocialSignIn(socialProvider.id)}
                        style={{
                           ["--social-bg" as string]: socialProvider.backgroundColor,
                        }}
                        className={cx(
                           "w-full items-center justify-center gap-2 border",
                           "bg-[var(--social-bg)] hover:bg-[var(--social-bg)] focus-visible:ring-[var(--social-bg)]",
                           "brightness-100 hover:brightness-90",
                           socialProvider.id === "google" && "focus-visible:ring-ring",
                        )}
                     >
                        <socialProvider.icon
                           size={socialProvider.size}
                           color={socialProvider.logoColor}
                        />
                        <span style={{ color: socialProvider.textColor }}>
                           {socialProvider.name}
                        </span>
                     </Button>
                  ))}

                  {/* <MingcuteMailLine className="mr-2 h-4 w-4" />
                     Google
                  </Button>

                  <Button
                     variant="outline"
                     className="w-full"
                     onClick={() => handleSocialSignIn("discord")}
                  >
                     Discord
                  </Button> */}
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
