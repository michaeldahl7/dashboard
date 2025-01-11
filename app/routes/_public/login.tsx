import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "~/lib/components/login";

export const Route = createFileRoute("/_public/login")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect({ to: "/dashboard" });
      }
   },
   component: LoginPage,
});

function LoginPage() {
   return (
      <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
         <Login title="Welcome back" />
      </div>
   );
}
