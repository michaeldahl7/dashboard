import {
  Link,
  Outlet,
  createFileRoute,
  redirect,
} from "@tanstack/react-router";

import { History, Home, ListPlus, ShoppingCart } from "lucide-react";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  // beforeLoad: async ({ context }) => {
  //   if (!context.user) {
  //     throw redirect({ to: "/signin" });
  //   }
  // },
});

function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <div className="flex">
              <Link to="/" className="font-semibold text-lg">
                Kitchen Tracker
              </Link>
            </div>

            <div className="flex gap-6">
              <Link
                to="/"
                className="flex items-center gap-2 hover:text-primary"
              >
                <Home size={20} />
                <span>Inventory</span>
              </Link>
              {/* <Link
								to="/add"
								className="flex items-center gap-2 hover:text-primary"
							>
								<ListPlus size={20} />
								<span>Add Item</span>
							</Link> */}
              {/* <Link
								to="/shopping"
								className="flex items-center gap-2 hover:text-primary"
							>
								<ShoppingCart size={20} />
								<span>Shopping</span>
							</Link>
							<Link
								to="/history"
								className="flex items-center gap-2 hover:text-primary"
							>
								<History size={20} />
								<span>History</span>
							</Link> */}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-screen-xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
    // <div className="flex flex-col gap-4 p-4">
    //   <h1 className="text-4xl font-bold">Dashboard Layout</h1>
    //   <div className="flex items-center gap-2">
    //     This is a protected layout:
    //     <pre className="rounded-md border bg-card p-1 text-card-foreground">
    //       routes/dashboard.tsx
    //     </pre>
    //   </div>

    //   <Button type="button" asChild className="w-fit" size="lg">
    //     <Link to="/">Back to Home</Link>
    //   </Button>

    //   <Outlet />
    // </div>
  );
}
