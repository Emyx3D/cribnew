import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, ShieldCheck } from 'lucide-react'; // Added ShieldCheck for Admin
import { cn } from '@/lib/utils'; // Import cn if needed for conditional classes

// TODO: Replace these with actual authentication and role checking logic
// This requires fetching user state, possibly from context or a server component prop
const useAuth = () => {
   // Replace with your actual auth state logic
   return {
      isLoggedIn: false, // Example: Set to true if user is logged in
      userRole: null, // Example: Set to 'admin', 'landlord', 'tenant'
   };
};

export function Header() {
  const { isLoggedIn, userRole } = useAuth();
  const isAdmin = userRole === 'admin'; // Check if the user is an admin

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
            {/* Admin link in desktop header */}
            {isAdmin && (
                 <Link
                   href="/admin/dashboard"
                   className="flex items-center transition-colors hover:text-foreground/80 text-foreground/60"
                 >
                    <ShieldCheck className="h-4 w-4 mr-1" />
                    Admin Dashboard
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
               <Link href="/landlord/register" className="text-sm hover:text-primary transition-colors">
                 List Your Property
               </Link>
               {/* Add other mobile nav links here */}
               <hr className="my-2 border-border" /> {/* Separator */}
               {isAdmin && (
                   <Link href="/admin/dashboard" className="text-sm hover:text-primary transition-colors flex items-center">
                      <ShieldCheck className="h-4 w-4 mr-1"/> Admin Dashboard
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
                    {userRole === 'landlord' && (
                       <Link href="/landlord/dashboard" className="text-sm hover:text-primary transition-colors">
                          My Landlord Dashboard
                       </Link>
                    )}
                     {userRole === 'tenant' && (
                       <Link href="/tenant/dashboard" className="text-sm hover:text-primary transition-colors">
                          My Tenant Dashboard
                       </Link>
                    )}
                    {/* Fallback dashboard if roles aren't specific or for other roles */}
                    {!isAdmin && userRole !== 'landlord' && userRole !== 'tenant' && (
                       <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
                         My Dashboard
                       </Link>
                    )}

                    {/* TODO: Implement actual logout functionality */}
                    <Button variant="ghost" className="text-sm justify-start px-0 h-auto py-0 font-normal hover:text-primary transition-colors" onClick={() => console.log('Logout clicked')}>
                      Logout
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
                 {isAdmin && (
                     <Button variant="ghost" asChild>
                         <Link href="/admin/dashboard">Admin</Link>
                     </Button>
                 )}
                 {userRole === 'landlord' && (
                     <Button variant="ghost" asChild>
                         <Link href="/landlord/dashboard">Landlord Dashboard</Link>
                     </Button>
                 )}
                 {userRole === 'tenant' && (
                     <Button variant="ghost" asChild>
                         <Link href="/tenant/dashboard">Tenant Dashboard</Link>
                     </Button>
                 )}
                  {!isAdmin && userRole !== 'landlord' && userRole !== 'tenant' && (
                       <Button variant="ghost" asChild>
                           <Link href="/dashboard">Dashboard</Link>
                       </Button>
                 )}
                 {/* TODO: Implement actual logout functionality */}
                 <Button variant="outline" onClick={() => console.log('Logout clicked')}>
                   Logout
                 </Button>
              </>
           )}
        </div>
      </div>
    </header>
  );
}
