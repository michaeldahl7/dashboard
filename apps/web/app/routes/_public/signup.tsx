import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { cx } from "class-variance-authority";
import { Button } from "~/app/components/ui/button";
import { Card, CardContent } from "~/app/components/ui/card";
import { type SocialProvider, socialProviders } from "~/app/utils/social-provider";
import { dashboardLinkOptions } from "~/app/utils";
import { authClient } from "~/app/utils/authClient";

export const Route = createFileRoute("/_public/signup")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect(dashboardLinkOptions);
      }
   },
   component: SignupPage,
});

function SignupPage() {
   const handleSocialSignIn = async (provider: SocialProvider["id"]) => {
      try {
         await authClient.signIn.social({
            provider,
            callbackURL: "/",
         });
      } catch (error) {
         console.error(`Failed to sign in with ${provider}:`, error);
      }
   };

   return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
         <div className="mb-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground">Choose your preferred sign up method</p>
         </div>

         <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
               <div className="flex flex-col gap-4">
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
                           Continue with {socialProvider.name}
                        </span>
                     </Button>
                  ))}
               </div>
            </CardContent>

            <div className="px-6 pb-4 text-center">
               <p className="text-sm text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="hover:underline font-medium text-primary">
                     Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/dpa" className="hover:underline font-medium text-primary">
                     Data Processing Agreement
                  </Link>
               </p>
            </div>
         </Card>

         <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
               Already have an account?
            </span>
            <Button variant="link" asChild className="p-0">
               <Link to="/login">Login -&gt;</Link>
            </Button>
         </div>
      </div>
   );
}
