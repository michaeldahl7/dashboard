import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute('/_authed/$username')({
   component: UserLayout,
   beforeLoad: ({ params, context }) => {
      if (!context.auth.user) {
         throw redirect({ to: "/signup" });
      }

      if (context.auth.user.username !== params.username) {
         throw redirect({ to: "/" });
      }

      return { user: context.auth.user };
   },
});

function UserLayout() {
   return <Outlet />;
}
