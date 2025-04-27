import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home } from 'lucide-react';

export function Header() {
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
          </nav>
        </div>
        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
             <Button
               variant="ghost"
               size="icon"
               className="inline-flex md:hidden mr-2"
             >
               <Menu className="h-5 w-5" />
               <span className="sr-only">Toggle Menu</span>
             </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
             <Link
              href="/"
              className="flex items-center space-x-2 mb-6"
            >
              <Home className="h-6 w-6 text-primary" />
              <span className="font-bold">CribDirect</span>
            </Link>
            <div className="flex flex-col space-y-4 pl-6">
               <Link href="/listings" className="text-sm">
                 Browse Listings
               </Link>
               <Link href="/landlord/register" className="text-sm">
                 List Your Property
               </Link>
               <Link href="/register" className="text-sm">
                 Sign Up
               </Link>
                <Link href="/login" className="text-sm">
                 Login
               </Link>
            </div>
          </SheetContent>
        </Sheet>
         {/* Desktop Right Side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="ghost" asChild className="hidden md:inline-flex">
             <Link href="/login">Login</Link>
           </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
             <Link href="/register">Sign Up</Link>
           </Button>
        </div>
      </div>
    </header>
  );
}
