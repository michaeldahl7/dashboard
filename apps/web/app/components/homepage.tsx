import { Link } from '@tanstack/react-router';
// import { Button } from "@munchy/ui/components/ui/button";
import { Button } from '~/components/ui/button';
export function Homepage() {
  return (
    <main className="flex-1">
      <section className="space-y-12 px-4 pt-12 text-center md:pt-24">
        <div className="mx-auto max-w-[800px] space-y-6">
          <h1 className="font-bold text-4xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Track Your Kitchen Inventory
          </h1>
          <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            The smart way to manage your kitchen. Never waste food again.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-8 px-4 md:grid-cols-3 md:px-6 lg:px-8">
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Track Inventory</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Keep track of what's in your kitchen and when it expires
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Smart Shopping</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Generate shopping lists based on what you need
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl">Reduce Waste</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Get notified before food expires to reduce waste
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
