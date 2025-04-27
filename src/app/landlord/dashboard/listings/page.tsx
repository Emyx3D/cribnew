'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, MapPin, Wallet, Pencil, Trash2, Eye, Loader2, PlusCircle, MessageSquare, ArrowLeft } from 'lucide-react'; // Added MessageSquare, ArrowLeft
import Image from 'next/image';
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';


// TODO: Define listing type (could be imported from a shared types file)
type LandlordListing = {
  id: string;
  title: string;
  location: string;
  price: string; // Keep as string to include frequency e.g., "₦3,500,000/year"
  bedrooms: number;
  bathrooms: number;
  imageUrl: string; // Cover image URL
  status: 'active' | 'inactive' | 'pending_review'; // Add status
  createdAt: Date;
  views?: number; // Optional analytics
  contacts?: number; // Optional analytics
};

// --- Mock API Functions ---
// TODO: Replace with actual API calls to fetch and manage landlord's listings

async function fetchLandlordListings(): Promise<LandlordListing[]> {
    console.log("Fetching landlord listings...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    // Return mock data - Tailor this to represent listings for the logged-in landlord
    return [
        {
            id: 'landlord_prop1',
            title: "My Spacious 3 Bedroom Apartment",
            location: "Lekki Phase 1, Lagos",
            price: "₦3,500,000/year",
            bedrooms: 3,
            bathrooms: 4,
            imageUrl: "https://picsum.photos/400/300?random=10",
            status: 'active',
            createdAt: new Date(Date.now() - 86400000 * 10),
            views: 1205,
            contacts: 45,
        },
        {
            id: 'landlord_prop2',
            title: "My Cozy 2 Bedroom Flat",
            location: "Yaba, Lagos",
            price: "₦1,800,000/year",
            bedrooms: 2,
            bathrooms: 2,
            imageUrl: "https://picsum.photos/400/300?random=11",
            status: 'inactive', // Example inactive
            createdAt: new Date(Date.now() - 86400000 * 30),
            views: 850,
            contacts: 20,
        },
         {
            id: 'landlord_prop3',
            title: "Newly Renovated Studio",
            location: "Ikeja GRA, Lagos",
            price: "₦1,200,000/year",
            bedrooms: 1,
            bathrooms: 1,
            imageUrl: "https://picsum.photos/400/300?random=12",
            status: 'pending_review', // Example pending
            createdAt: new Date(Date.now() - 86400000 * 1),
        },
    ];
}

async function deleteListing(id: string): Promise<{ success: boolean; error?: string }> {
    console.log(`Deleting listing ${id}...`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // Simulate success/failure
    if (id === 'fail_delete_id') {
        return { success: false, error: "Simulated server error during deletion." };
    }
    return { success: true };
}
// --- End Mock API Functions ---


export default function ManageListingsPage() {
    const [listings, setListings] = useState<LandlordListing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

     // Authentication Check
     useEffect(() => {
        try {
            const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const userRole = sessionStorage.getItem('userRole');
            if (!isLoggedIn || userRole !== 'landlord') {
                router.push('/login');
            }
        } catch (error) {
             router.push('/login');
        }
    }, [router]);


    useEffect(() => {
        setIsLoading(true);
        fetchLandlordListings()
            .then(data => {
                setListings(data);
            })
            .catch(err => {
                console.error("Error fetching listings:", err);
                toast({ variant: 'destructive', title: "Error", description: "Could not fetch your listings." });
            })
            .finally(() => setIsLoading(false));
    }, [toast]);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        const result = await deleteListing(id);
        if (result.success) {
            setListings(prev => prev.filter(l => l.id !== id));
            toast({ title: "Success", description: "Listing deleted successfully." });
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to delete listing." });
        }
        setDeletingId(null);
    };

    const getStatusBadgeVariant = (status: LandlordListing['status']): "default" | "secondary" | "outline" | "destructive" => {
        switch (status) {
            case 'active': return 'secondary'; // Greenish bg? Check globals.css
            case 'inactive': return 'outline'; // Greyish
            case 'pending_review': return 'default'; // Bluish/Yellowish? Check globals.css
            default: return 'default';
        }
    }

    const getStatusText = (status: LandlordListing['status']): string => {
        switch (status) {
            case 'active': return 'Active';
            case 'inactive': return 'Inactive';
            case 'pending_review': return 'Pending Review';
            default: return status;
        }
    }


    return (
        <div className="container mx-auto px-4 py-12">
             {/* Back Button */}
             <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
             </Button>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage My Listings</h1>
                 <Button asChild>
                    <Link href="/landlord/dashboard/listings/new">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
                    </Link>
                 </Button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : listings.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-lg">
                    {/* Use Home icon from lucide-react if available, otherwise replace */}
                    {/* <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" /> */}
                    <PlusCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" /> {/* Using PlusCircle as placeholder */}
                    <h2 className="text-xl font-semibold mb-2">No listings yet!</h2>
                    <p className="text-muted-foreground mb-4">Get started by adding your first property.</p>
                    <Button asChild>
                       <Link href="/landlord/dashboard/listings/new">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Listing
                       </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((listing) => (
                        <Card key={listing.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="p-0 relative">
                                <Image
                                    src={listing.imageUrl}
                                    alt={listing.title}
                                    width={400}
                                    height={200} // Adjust height for management view
                                    className="w-full h-40 object-cover" // Smaller height
                                />
                                <Badge
                                    variant={getStatusBadgeVariant(listing.status)}
                                    className="absolute top-2 right-2 text-xs"
                                >
                                    {getStatusText(listing.status)}
                                </Badge>
                                 <Badge variant="outline" className="absolute top-2 left-2 text-xs bg-background/80">
                                    {listing.createdAt.toLocaleDateString()}
                                </Badge>
                            </CardHeader>
                            <CardContent className="p-4 flex-grow">
                                <CardTitle className="text-lg mb-1 line-clamp-2">{listing.title}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                                    <MapPin className="w-4 h-4" /> {listing.location}
                                </CardDescription>
                                <div className="flex items-center gap-4 text-sm mb-3">
                                    <span className="flex items-center gap-1">
                                        <BedDouble className="w-4 h-4 text-primary" /> {listing.bedrooms} Beds
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Bath className="w-4 h-4 text-primary" /> {listing.bathrooms} Baths
                                    </span>
                                </div>
                                <div className="text-lg font-semibold text-primary flex items-center gap-1 mb-3">
                                    <Wallet className="w-5 h-5" /> {listing.price}
                                </div>
                                {/* Optional Analytics */}
                                {listing.status === 'active' && (listing.views !== undefined || listing.contacts !== undefined) && (
                                    <div className="text-xs text-muted-foreground flex gap-3 mt-2 border-t pt-2">
                                        {listing.views !== undefined && <span><Eye className="inline w-3 h-3 mr-1"/>{listing.views} views</span>}
                                        {listing.contacts !== undefined && <span><MessageSquare className="inline w-3 h-3 mr-1"/>{listing.contacts} contacts</span>}
                                    </div>
                                )}

                            </CardContent>
                            <CardFooter className="p-3 border-t flex justify-end gap-2">
                                {/* TODO: Add Edit Functionality */}
                                <Button variant="outline" size="sm" asChild disabled={deletingId === listing.id}>
                                   <Link href={`/landlord/dashboard/listings/edit/${listing.id}`}> {/* TODO: Create edit page */}
                                        <Pencil className="h-4 w-4" />
                                        <span className="ml-1 hidden sm:inline">Edit</span>
                                   </Link>
                                </Button>

                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                         <Button variant="destructive" size="sm" disabled={deletingId === listing.id}>
                                            {deletingId === listing.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                 <Trash2 className="h-4 w-4" />
                                            )}
                                             <span className="ml-1 hidden sm:inline">Delete</span>
                                         </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the listing "{listing.title}".
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel disabled={deletingId === listing.id}>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDelete(listing.id)}
                                            disabled={deletingId === listing.id}
                                            className="bg-destructive hover:bg-destructive/90"
                                        >
                                            {deletingId === listing.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            Confirm Delete
                                        </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>


                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
