import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
import { PublicHeader } from "~/lib/components/layout/public-header";
import { Button } from "~/lib/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "~/lib/components/ui/sheet";

export const Route = createFileRoute("/")({
   beforeLoad: ({ context }) => {
      if (context.auth.isAuthenticated) {
         throw redirect({ to: "/dashboard" });
      }
   },
   component: LandingPage,
});

function LandingPage() {
   return (
      <div className="min-h-screen flex flex-col bg-background">
         <PublicHeader />

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
