
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Home, BarChart, ArrowLeft } from "lucide-react"; // Added ArrowLeft
import Link from "next/link";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils'; // Import cn

// TODO: Fetch landlord specific data (listings count, messages count etc.)

export default function LandlordDashboardPage() {
    const router = useRouter();
    const [listingsCount, setListingsCount] = useState(0); // Initialize with 0
    const [unreadMessages, setUnreadMessages] = useState(0); // Initialize with 0
    const [pendingInspections, setPendingInspections] = useState(0); // Initialize with 0

    // Basic Authentication Check
    useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const userRole = sessionStorage.getItem('userRole');

            if (!isLoggedIn || userRole !== 'landlord') {
                console.warn('Unauthorized access attempt to landlord dashboard.');
                router.push('/login'); // Redirect non-landlords or logged out users
            } else {
                 // Fetch dashboard data if logged in (replace with actual API call)
                 fetchDashboardData();

                 // Read unread count from session storage
                 const storedUnreadCount = sessionStorage.getItem('landlordUnreadCount');
                 setUnreadMessages(storedUnreadCount ? parseInt(storedUnreadCount, 10) : 0);
            }
        } catch (error) {
            console.error("Error accessing sessionStorage for auth check:", error);
            router.push('/login'); // Redirect if storage access fails
        }
    }, [router]);

    // Mock function to fetch dashboard data
    async function fetchDashboardData() {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setListingsCount(3); // Example data
        // setUnreadMessages(2); // Example data - Now read from storage
        setPendingInspections(1); // Example data
    }

    return (
        <div className="container mx-auto px-4 py-12">
             {/* Back Button */}
             <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
             </Button>
            <h1 className="text-3xl font-bold mb-8">Landlord Dashboard</h1>

            {/* Quick Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{listingsCount}</div>
                        {/* <p className="text-xs text-muted-foreground">+2 since last month</p> */}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{unreadMessages}</div>
                        <Link href="/landlord/dashboard/messages" className="text-xs text-primary hover:underline">View Messages</Link>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Inspections</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" /> {/* Replace icon if needed */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingInspections}</div>
                        {/* <Link href="/landlord/dashboard/inspections" className="text-xs text-primary hover:underline">Manage Requests</Link> */}
                    </CardContent>
                </Card>
            </div>

            {/* Action Buttons/Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><PlusCircle className="text-primary" /> Add New Listing</CardTitle>
                        <CardDescription>Create a new property listing to attract tenants.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                            <Link href="/landlord/dashboard/listings/new"> {/* Ensure Link is single child */}
                                Create Listing
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Home className="text-primary" /> Manage Listings</CardTitle>
                        <CardDescription>View, edit, or deactivate your existing property listings.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/landlord/dashboard/listings"> {/* Ensure Link is single child */}
                                View My Listings
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MessageSquare className="text-primary" /> Messages</CardTitle>
                        <CardDescription>Communicate with potential tenants and manage inquiries.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/landlord/dashboard/messages"> {/* Ensure Link is single child */}
                                Open Messages {unreadMessages > 0 ? `(${unreadMessages} new)` : ''}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><BarChart className="text-primary" /> Performance</CardTitle>
                        <CardDescription>See how your listings are performing (views, contacts).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Apply disabled styles directly to Link and remove disabled from Button */}
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/landlord/dashboard/analytics" // Ensure Link is single child
                                  className={cn(
                                      "pointer-events-none opacity-50", // Add disabled styles/behavior
                                      // Ensure button styles are still applied correctly by Button's default classes
                                      // The buttonVariants() function is internal to Button, but we mimic the styling
                                      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium"
                                    )}
                                  aria-disabled="true" // For accessibility
                                  tabIndex={-1} // Prevent tabbing
                                  onClick={(e) => e.preventDefault()} // Prevent click navigation
                                  >
                                View Analytics (Coming Soon)
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}

