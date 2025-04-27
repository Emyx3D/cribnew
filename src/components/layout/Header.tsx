'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, ShieldCheck, LogOut } from 'lucide-react'; // Added ShieldCheck for Admin, LogOut
import { cn } from '@/lib/utils'; // Import cn if needed for conditional classes
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for logout redirection


// Type for user role
type UserRole = 'admin' | 'landlord' | 'tenant' | null;

// Updated hook to check sessionStorage for auth state
const useAuth = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userRole, setUserRole] = useState<UserRole>(null);

   useEffect(() => {
     // Check session storage on mount (client-side only)
     try {
       const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
       const role = sessionStorage.getItem('userRole') as UserRole; // Cast to UserRole or null

       setIsLoggedIn(loggedInStatus);
       setUserRole(loggedInStatus ? role : null); // Only set role if logged in
       console.log("Auth state from sessionStorage:", { loggedInStatus, role });
     } catch (error) {
        console.error("Could not access sessionStorage:", error);
        // Handle potential storage access issues (e.g., disabled cookies/storage in browser settings)
        setIsLoggedIn(false);
        setUserRole(null);
     }

     // Optional: Add event listener for storage changes if needed for multi-tab sync
     // window.addEventListener('storage', handleStorageChange);
     // return () => window.removeEventListener('storage', handleStorageChange);
   }, []);

   return { isLoggedIn, userRole };
};

export function Header() {
  const { isLoggedIn, userRole } = useAuth();
  const router = useRouter();

  // Simulated logout function
  const handleLogout = () => {
    try {
       sessionStorage.removeItem('isLoggedIn');
       sessionStorage.removeItem('userRole');
    } catch (error) {
       console.error("Could not clear sessionStorage:", error);
    }
    // Redirect to login or home page after logout
    router.push('/login');
    // Optionally force reload or use state management to update UI instantly
    router.refresh(); // Trigger a refresh to re-evaluate useAuth
    console.log('Logout simulated, sessionStorage cleared.');
  };


  const isAdmin = userRole === 'admin'; // Check if the user is an admin
  const isLandlord = userRole === 'landlord';
  const isTenant = userRole === 'tenant';

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
            {/* Only show "List Your Property" if not logged in or if logged in as a landlord */}
             {(!isLoggedIn || isLandlord) && (
                <Link
                href="/landlord/register"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                List Your Property
                </Link>
            )}
            {/* Admin link in desktop header */}
            {(isAdmin || isLandlord) && ( // Show Admin Dashboard for admin and landlord roles
                 <Link
                   href="/admin/dashboard"
                   className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
                 >
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    {isAdmin ? 'Admin Dashboard' : 'Landlord Dashboard'}
                 </Link>
            )}
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
                {(!isLoggedIn || isLandlord) && (
                   <Link href="/landlord/register" className="text-sm hover:text-primary transition-colors">
                     List Your Property
                   </Link>
                )}
               <hr className="my-2 border-border" /> {/* Separator */}
               {(isAdmin || isLandlord) && (
                   <Link href="/admin/dashboard" className="text-sm hover:text-primary transition-colors flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-1"/> {isAdmin ? 'Admin Dashboard' : 'Landlord Dashboard'}
                   </Link>
               )}
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
                    {/* Example: Conditionally show different dashboard based on role */}
                    {isTenant && (
                       <Link href="/tenant/dashboard" // TODO: Create tenant dashboard page
                           className="text-sm hover:text-primary transition-colors">
                          My Tenant Dashboard
                       </Link>
                    )}
                    {/* Generic Dashboard Link (if needed for other roles or fallback) */}
                    {/* {!isAdmin && !isLandlord && !isTenant && (
                       <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                         My Dashboard
                       </Link>
                    )} */}

                    {/* Logout Button */}
                    <Button variant="ghost" className="text-sm justify-start px-0 h-auto py-0 font-normal hover:text-primary transition-colors" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-1"/> Logout
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
                 {/* Example: Conditionally show different dashboard based on role */}
                 {(isAdmin || isLandlord) && (
                     <Button variant="ghost" asChild>
                         <Link href="/admin/dashboard">{isAdmin ? 'Admin' : 'Dashboard'}</Link>
                     </Button>
                 )}
                 {isTenant && (
                     <Button variant="ghost" asChild>
                         <Link href="/tenant/dashboard">Tenant Dashboard</Link> {/* TODO: Create tenant dashboard page */}
                     </Button>
                 )}
                 {/* Generic Dashboard Link (if needed) */}
                 {/* {!isAdmin && !isLandlord && !isTenant && (
                       <Button variant="ghost" asChild>
                           <Link href="/dashboard">Dashboard</Link>
                       </Button>
                 )} */}
                 {/* Logout Button */}
                 <Button variant="outline" onClick={handleLogout}>
                   <LogOut className="h-4 w-4 mr-1"/> Logout
                 </Button>
              </>
           )}
        </div>
      </div>
    </header>
  );
}
