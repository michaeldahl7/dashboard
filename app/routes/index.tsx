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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className="flex items-center text-lg font-semibold"
            >
              Kitchen Tracker
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/signup">Sign up</Link>
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col space-y-3 mt-4">
                <Button asChild variant="ghost" onClick={() => setIsOpen(false)}>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild onClick={() => setIsOpen(false)}>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
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
