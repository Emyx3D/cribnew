import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn if needed for conditional classes

export function Header() {
  // Example: Add logic here if needed to conditionally show/hide Login/Signup
  const isLoggedIn = false; // Placeholder: Replace with actual auth state check

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              CribDirect
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/listings"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Browse Listings
            </Link>
            <Link
              href="/landlord/register"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              List Your Property
            </Link>
             {/* Add other desktop nav links here if needed */}
          </nav>
        </div>

        {/* Mobile Nav Trigger */}
        <Sheet>
          <SheetTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               className="inline-flex md:hidden mr-2" // Show only on mobile
             >
               <Menu className="h-5 w-5" />
               <span className="sr-only">Toggle Menu</span>
             </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <Link
              href="/"
              className="flex items-center space-x-2 mb-6 pl-6" // Added padding to align with items below
            >
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold">CribDirect</span>
            </Link>
            <nav className="flex flex-col space-y-3 pl-6"> {/* Changed to nav, adjusted spacing */}
               <Link href="/listings" className="text-sm hover:text-primary transition-colors">
                 Browse Listings
               </Link>
               <Link href="/landlord/register" className="text-sm hover:text-primary transition-colors">
                 List Your Property
               </Link>
               {/* Add other mobile nav links here */}
               <hr className="my-2 border-border" /> {/* Separator */}
               {!isLoggedIn ? (
                 <>
                   <Link href="/register" className="text-sm hover:text-primary transition-colors">
                     Sign Up
                   </Link>
                   <Link href="/login" className="text-sm hover:text-primary transition-colors">
                     Login
                   </Link>
                 </>
               ) : (
                 <>
                    {/* Add authenticated user links here (e.g., Dashboard, Logout) */}
                    <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                      My Dashboard
                    </Link>
                    <Button variant="ghost" className="text-sm justify-start px-0 h-auto py-0 font-normal hover:text-primary transition-colors">
                      Logout {/* TODO: Implement logout functionality */}
                    </Button>
                 </>
               )}
            </nav>
          </SheetContent>
        </Sheet>

         {/* Spacer to push right-side items */}
         <div className="flex-1 md:hidden" />

         {/* Desktop Right Side Auth Buttons */}
        <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
           {!isLoggedIn ? (
             <>
               <Button variant="ghost" asChild>
                 <Link href="/login">Login</Link>
               </Button>
               <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                 <Link href="/register">Sign Up</Link>
               </Button>
             </>
           ) : (
              <>
                {/* Add authenticated user buttons here (e.g., Profile, Logout) */}
                 <Button variant="ghost" asChild>
                   <Link href="/dashboard">Dashboard</Link>
                 </Button>
                 <Button variant="outline">
                   Logout {/* TODO: Implement logout functionality */}
                 </Button>
              </>
           )}
        </div>
      </div>
    </header>
  );
}
