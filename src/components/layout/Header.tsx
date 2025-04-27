
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, ShieldCheck, LogOut, User, LayoutDashboard, Settings } from 'lucide-react'; // Added Settings icon
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import Avatar for user icon


// Type for user role
type UserRole = 'admin' | 'landlord' | 'tenant' | null;

// Updated hook to check sessionStorage for auth state
const useAuth = () => {
   const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [userRole, setUserRole] = useState<UserRole>(null);
    const [userName, setUserName] = useState<string | null>(null); // Added state for user name
   const [isMounted, setIsMounted] = useState(false); // Track if component is mounted

   useEffect(() => {
     // Ensure this runs only on the client
     setIsMounted(true);
     try {
       const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
       const role = sessionStorage.getItem('userRole') as UserRole;
       const name = sessionStorage.getItem('userName'); // Get user name

       setIsLoggedIn(loggedInStatus);
       setUserRole(loggedInStatus ? role : null);
       setUserName(loggedInStatus ? name : null); // Set user name if logged in
       console.log("useAuth: Session state read", { loggedInStatus, role, name });
     } catch (error) {
        console.error("useAuth: Could not access sessionStorage:", error);
        // Set default non-logged-in state if storage access fails
        setIsLoggedIn(false);
        setUserRole(null);
        setUserName(null);
     }
   }, []); // Run only once on mount

   // Function to update state manually after login/logout if needed, though refresh handles it
   const updateAuthState = () => {
      try {
         const loggedInStatus = sessionStorage.getItem('isLoggedIn') === 'true';
         const role = sessionStorage.getItem('userRole') as UserRole;
         const name = sessionStorage.getItem('userName'); // Get user name
         setIsLoggedIn(loggedInStatus);
         setUserRole(loggedInStatus ? role : null);
         setUserName(loggedInStatus ? name : null); // Set user name if logged in
      } catch(error) {
         console.error("useAuth: Failed to update auth state manually:", error);
      }
   };

   return { isLoggedIn, userRole, userName, isMounted, updateAuthState }; // Return isMounted, update function, and userName
};

// Helper to get initials
const getInitials = (name?: string | null) => {
    if (!name) return 'U'; // Default to 'U' for User
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export function Header() {
  const { isLoggedIn, userRole, userName, isMounted, updateAuthState } = useAuth(); // Get userName
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  // Re-check auth state when route changes (useful after login/logout redirects)
  useEffect(() => {
    const handleRouteChange = () => {
      if (isMounted) {
        updateAuthState();
      }
    };
    // Listen to route changes - This requires a more robust solution than just relying on router object
    // Using router.refresh() after login/logout is generally more reliable for App Router
    // For now, we'll rely on the initial mount check and manual updates

    // Re-check on mount just in case sessionStorage updated before mount finished
    if (isMounted) {
        updateAuthState();
    }

  }, [isMounted, router, updateAuthState]);

  // Simulated logout function
  const handleLogout = () => {
    try {
       sessionStorage.removeItem('isLoggedIn');
       sessionStorage.removeItem('userRole');
       sessionStorage.removeItem('landlordVerificationStatus');
       sessionStorage.removeItem('landlordConversations');
       sessionStorage.removeItem('landlordUnreadCount');
       sessionStorage.removeItem('userName'); // Remove username on logout
       console.log('handleLogout: Session storage cleared.');
    } catch (error) {
       console.error("handleLogout: Could not clear sessionStorage:", error);
    }
    // Update state immediately for faster UI feedback before refresh completes
    updateAuthState();
    // Redirect to login or home page after logout
    router.push('/login');
    router.refresh(); // Force refresh to update server components and potentially re-run useAuth
  };

  const isAdmin = userRole === 'admin';
  const isLandlord = userRole === 'landlord';
  const isTenant = userRole === 'tenant';

  // Avoid rendering auth buttons until client-side check is complete
   if (!isMounted) {
     // Render a placeholder or skeleton header while checking auth
     return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="mr-4 flex items-center">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Home className="h-6 w-6 text-primary" />
                        <span className="hidden font-bold sm:inline-block">
                            CribDirect
                        </span>
                    </Link>
                    {/* Placeholder Nav Links */}
                    <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
                       <div className="h-4 w-20 bg-muted rounded"></div>
                       <div className="h-4 w-24 bg-muted rounded"></div>
                    </div>
                </div>
                 <div className="hidden md:flex items-center space-x-2">
                    <div className="h-8 w-16 bg-muted rounded"></div>
                    <div className="h-8 w-20 bg-muted rounded"></div>
                 </div>
                 <div className="md:hidden">
                    <Menu className="h-5 w-5 text-muted" />
                 </div>
            </div>
        </header>
     );
   }

  // Close mobile menu on navigation
  const handleLinkClick = () => {
     setMobileMenuOpen(false);
  }

  // Define dashboard link based on role
   const dashboardLink = isAdmin ? "/admin/dashboard" : isLandlord ? "/landlord/dashboard" : "/"; // Tenants don't have a separate dashboard currently

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Desktop Left Side */}
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
             {/* Show "List Your Property" only if not logged in OR if logged in as landlord */}
             {(!isLoggedIn || isLandlord) && (
                <Link
                  href={isLandlord ? "/landlord/dashboard/listings/new" : "/landlord/register"}
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  List Your Property
                </Link>
            )}
             {/* Show Dashboard link only if logged in as Admin or Landlord */}
             {(isAdmin || isLandlord) && (
                <Link
                    href={dashboardLink}
                    className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
                >
                     {isAdmin && <ShieldCheck className="h-4 w-4 mr-1" />}
                     {isLandlord && <LayoutDashboard className="h-4 w-4 mr-1" />}
                    Dashboard
                </Link>
            )}
          </nav>
        </div>

        {/* Mobile Nav Trigger & Logo */}
        <div className="flex items-center md:hidden flex-1">
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
               <SheetTrigger asChild>
                 <Button
                   variant="ghost"
                   size="icon"
                   className="mr-2" // Added margin
                 >
                   <Menu className="h-5 w-5" />
                   <span className="sr-only">Toggle Menu</span>
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="pr-0 w-3/4"> {/* Adjusted width */}
                 <Link
                   href="/"
                   onClick={handleLinkClick}
                   className="flex items-center space-x-2 mb-6 pl-6 pt-4" // Added padding top
                 >
                   <Home className="h-6 w-6 text-primary" />
                   <span className="font-bold">CribDirect</span>
                 </Link>
                 <nav className="flex flex-col space-y-3 pl-6">
                   <Link href="/listings" onClick={handleLinkClick} className="text-base hover:text-primary transition-colors"> {/* Increased text size */}
                     Browse Listings
                   </Link>
                   {(!isLoggedIn || isLandlord) && (
                     <Link
                       href={isLandlord ? "/landlord/dashboard/listings/new" : "/landlord/register"}
                       onClick={handleLinkClick}
                       className="text-base hover:text-primary transition-colors"
                     >
                       List Your Property
                     </Link>
                   )}
                   {(isAdmin || isLandlord) && ( // Show dashboard link for admin/landlord
                     <Link href={dashboardLink} onClick={handleLinkClick} className="text-base hover:text-primary transition-colors flex items-center">
                         {isAdmin && <ShieldCheck className="h-4 w-4 mr-1" />}
                         {isLandlord && <LayoutDashboard className="h-4 w-4 mr-1" />}
                         Dashboard
                     </Link>
                    )}
                   <hr className="my-2 border-border" />

                   {/* Auth Links */}
                   {!isLoggedIn ? (
                     <>
                       <Link href="/login" onClick={handleLinkClick} className="text-base hover:text-primary transition-colors">
                         Login
                       </Link>
                       <Link href="/register" onClick={handleLinkClick} className="text-base hover:text-primary transition-colors">
                         Sign Up
                       </Link>
                     </>
                   ) : (
                     <>
                       <Link href="/profile" onClick={handleLinkClick} className="text-base hover:text-primary transition-colors flex items-center">
                         <User className="h-4 w-4 mr-1" /> Profile
                       </Link>
                       <Button variant="ghost" className="text-base justify-start px-0 h-auto py-0 font-normal hover:text-primary transition-colors" onClick={() => { handleLogout(); handleLinkClick(); }}>
                         <LogOut className="h-4 w-4 mr-1" /> Logout
                       </Button>
                     </>
                   )}
                 </nav>
               </SheetContent>
             </Sheet>
             {/* Mobile Logo - Centered (flex-1 pushes it) */}
             <Link href="/" className="flex items-center space-x-2">
               <Home className="h-6 w-6 text-primary md:hidden" /> {/* Show only on mobile */}
               <span className="font-bold md:hidden">CribDirect</span>
             </Link>
             <div className="flex-1"></div> {/* Pushes logo to center (if needed) or next element to right */}
        </div>


         {/* Desktop Right Side Auth */}
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
                 {/* Desktop User Dropdown */}
                 <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                          <Avatar className="h-8 w-8">
                            {/* TODO: Add dynamic avatar image source if available */}
                            {/* <AvatarImage src="/path/to/avatar.png" alt={userName || 'User'} /> */}
                            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                          </Avatar>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                           <div className="flex flex-col space-y-1">
                             <p className="text-sm font-medium leading-none">{userName || userRole}</p>
                             {/* Optional: Add email */}
                             {/* <p className="text-xs leading-none text-muted-foreground">
                               {userEmail}
                             </p> */}
                           </div>
                        </DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem asChild className="cursor-pointer">
                             <Link href="/profile"><User className="mr-2 h-4 w-4" />Profile</Link>
                         </DropdownMenuItem>
                         {/* Optional Settings Link */}
                         {/* <DropdownMenuItem className="cursor-pointer">
                             <Settings className="mr-2 h-4 w-4" />Settings
                         </DropdownMenuItem> */}
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                             <LogOut className="mr-2 h-4 w-4" /> Logout
                         </DropdownMenuItem>
                     </DropdownMenuContent>
                 </DropdownMenu>
              </>
           )}
        </div>
      </div>
    </header>
  );
}
