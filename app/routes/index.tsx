import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { Button } from "~/lib/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/lib/components/ui/sheet";
import { useState } from "react";

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: LandingPage
});

function LandingPage() {

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold">
            Kitchen Tracker
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/signup">Sign up</Link>
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="space-y-12 px-4 pt-12 md:pt-24 text-center">
          <div className="space-y-6 max-w-[800px] mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Track Your Kitchen Inventory
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              The smart way to manage your kitchen. Never waste food again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-8 px-4 md:grid-cols-3 md:px-6 lg:px-8">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Track Inventory</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Keep track of what's in your kitchen and when it expires
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Smart Shopping</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Generate shopping lists based on what you need
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Reduce Waste</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Get notified before food expires to reduce waste
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
