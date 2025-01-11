import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/signup")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect({ to: "/dashboard" });
      }
   },
   component: SignupPage,
});

import { Link } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { Card, CardContent } from "~/lib/components/ui/card";
import { Separator } from "~/lib/components/ui/separator";
import { authClient } from "~/lib/utils/authClient";

export default function SignupPage() {
   return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
         <div className="mb-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground">Choose your preferred sign up method</p>
         </div>

         <Card className="w-full max-w-sm">
            <CardContent className="pt-6">
               <div className="flex flex-col gap-4">
                  <Button
                     className="w-full"
                     onClick={() =>
                        authClient.signIn.social({
                           provider: "google",
                           callbackURL: "/",
                        })
                     }
                  >
                     Continue with Google
                  </Button>

                  <Button
                     className="w-full"
                     onClick={() =>
                        authClient.signIn.social({
                           provider: "discord",
                           callbackURL: "/",
                        })
                     }
                  >
                     Continue with Discord
                  </Button>
               </div>
            </CardContent>

            <div className="relative my-4">
               <div className="absolute inset-0 flex items-center">
                  <Separator />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground" />
               </div>
            </div>

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
