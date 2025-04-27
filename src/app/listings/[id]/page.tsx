
'use client'; // Add 'use client' directive

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Bath, MapPin, Wallet, CheckCircle, MessageSquare, User, Phone, CalendarDays, Eye, EyeOff, ArrowLeft } from 'lucide-react'; // Added Eye, EyeOff, ArrowLeft
import Image from "next/image";
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
} from "@/components/ui/alert-dialog"; // For inspection request (example)
import Link from 'next/link'; // Import Link
import { useToast } from '@/hooks/use-toast'; // Import toast
import { useRouter } from 'next/navigation'; // Import router


// Mock function to get listing data by ID - Replace with actual data fetching
// Keep this async function outside the component or use useEffect for client-side fetching
async function getListingData(id: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 100));

  // Find listing from mock data (replace with DB query)
   const listings = [
      {
        id: 1,
        title: "Spacious 3 Bedroom Apartment",
        location: "Lekki Phase 1, Lagos",
        price: "₦3,500,000/year",
        bedrooms: 3,
        bathrooms: 4,
        description: "A well-maintained and spacious 3-bedroom flat located in a serene part of Lekki Phase 1. Features include large living areas, modern kitchen fittings, and ample parking space. Close to major roads and amenities.",
        imageUrl: "https://picsum.photos/seed/house1_livingroom_lg/800/600", // Living room for house 1
        verified: true,
        amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
        landlord: { id: "landlord_adekunle", name: "Mr. Adekunle Gold", verified: true, phone: "+2348012345678" },
      },
      {
        id: 2,
        title: "Cozy 2 Bedroom Flat",
        location: "Yaba, Lagos",
        price: "₦1,800,000/year",
        bedrooms: 2,
        bathrooms: 2,
         description: "A lovely and affordable 2-bedroom flat perfect for young professionals or small families. Located in the heart of Yaba with easy access to transportation. Prepaid electricity meter installed.",
        imageUrl: "https://picsum.photos/seed/house2_bedroom_lg/800/600", // Bedroom for house 2
        verified: true,
        amenities: ["Water Supply", "Prepaid Meter", "Tiled Floors"],
         landlord: { id: "landlord_funke", name: "Mrs. Funke Akindele", verified: true, phone: "+2348098765432" },
      },
        {
        id: 3,
        title: "Modern Studio Apartment",
        location: "Ikeja GRA, Lagos",
        price: "₦1,200,000/year",
        bedrooms: 1,
        bathrooms: 1,
         description: "Compact and modern studio apartment in the secure and quiet Ikeja GRA. Ideal for singles. Comes furnished with basic amenities and has a backup generator.",
        imageUrl: "https://picsum.photos/seed/house3_bathroom_lg/800/600", // Bathroom for house 3
        verified: false, // Example of unverified landlord
        amenities: ["Furnished", "Generator", "Air Conditioning"],
         landlord: { id: "landlord_bovi", name: "Mr. Bovi Ugboma", verified: false, phone: "+2347011223344" }, // Phone might be hidden until verified
      },
       {
        id: 4,
        title: "Family Duplex with Garden",
        location: "Magodo Phase 2, Lagos",
        price: "₦5,000,000/year",
        bedrooms: 4,
        bathrooms: 5,
        description: "Large family-sized duplex in a gated estate in Magodo Phase 2. Features a private garden, ample parking, water heater in all bathrooms, and good security.",
        imageUrl: "https://picsum.photos/seed/house4_compound_lg/800/600", // Compound/Exterior for house 4
        verified: true,
        amenities: ["Parking Space", "Water Heater", "Security", "Garden", "Gated Estate"],
         landlord: { id: "landlord_dangote", name: "Alhaji Dangote Properties", verified: true, phone: "+2348100000001" },
      },
    ];
  // Convert id param to number if mock data uses numbers
  const listingId = parseInt(id, 10);
  const listing = listings.find(l => l.id === listingId);

  if (!listing) {
    // Handle not found case - maybe redirect or show a 404 component
    return null;
  }
  return listing;
}


interface ListingDetailPageProps {
  params: { id: string };
}


// Define the listing type based on mock data structure
// In a real app, this would likely come from a shared types file
type ListingData = Awaited<ReturnType<typeof getListingData>>;

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const [listing, setListing] = useState<ListingData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  // Fetch data on the client side since this is now a Client Component
  useEffect(() => {
     // Access params.id inside useEffect to avoid top-level access warning
    const listingId = params.id;
    if (!listingId) return; // Don't fetch if id is not available

    setIsLoading(true);
    getListingData(listingId)
      .then(data => {
        if (data) {
            setListing(data);
        } else {
            // Handle listing not found (e.g., show 404 or redirect)
            console.error("Listing not found for ID:", listingId);
            // Optionally redirect: router.push('/404');
        }
      })
      .catch(err => {
        console.error("Failed to load listing data:", err);
        // Optionally show an error message or redirect
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id]); // Dependency array ensures fetch runs when id changes


  const handleRequestInspection = () => {
      // TODO: Implement actual inspection request logic (e.g., API call)
      console.log("Requesting inspection for listing:", listing?.id);
       toast({
            title: "Inspection Requested",
            description: "Your request has been sent to the landlord. They will contact you.",
       });
  };

  if (isLoading) {
     // Optional: Add a loading skeleton here
     return <div className="container mx-auto py-12 text-center">Loading listing details...</div>;
  }


  if (!listing) {
    // Improved message for when listing is definitively not found after loading
    return <div className="container mx-auto py-12 text-center">Listing not found. It may have been removed or the link is incorrect.</div>;
  }

  // Determine if the "Send Message" button should be enabled
  // Requires user to be logged in as a tenant (example logic)
  let isTenantLoggedIn = false;
  try {
     // Check if running in a browser environment before accessing sessionStorage
     if (typeof window !== 'undefined') {
       isTenantLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' && sessionStorage.getItem('userRole') === 'tenant';
     }
  } catch (e) {
     console.error("Error accessing sessionStorage:", e);
  }


  return (
    <div className="container mx-auto px-4 py-12">
       {/* Back Button */}
       <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
       </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Image & Details) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-lg">
             <Image
                src={listing.imageUrl}
                alt={listing.title}
                width={800}
                height={500}
                className="w-full h-64 md:h-96 object-cover"
                priority
                unoptimized // Added for picsum consistency
              />
             <CardContent className="p-6">
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                 <div className="flex items-center text-muted-foreground mb-4 gap-1">
                    <MapPin className="w-5 h-5" />
                    <span>{listing.location}</span>
                 </div>
                <div className="flex flex-wrap items-center gap-6 mb-4 text-md">
                    <span className="flex items-center gap-1.5">
                      <BedDouble className="w-5 h-5 text-primary" /> {listing.bedrooms} Bedrooms
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Bath className="w-5 h-5 text-primary" /> {listing.bathrooms} Bathrooms
                    </span>
                     <span className="flex items-center gap-1.5 font-semibold text-primary">
                      <Wallet className="w-5 h-5"/> {listing.price}
                    </span>
                 </div>

                <Separator className="my-6" />

                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground mb-6">
                  {listing.description}
                </p>

                 <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                 <div className="flex flex-wrap gap-2">
                    {listing.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="px-3 py-1 text-sm">
                           <CheckCircle className="w-4 h-4 mr-1 text-green-600"/> {amenity}
                        </Badge>
                    ))}
                 </div>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar (Landlord & Actions) */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="shadow-md sticky top-20">
             <CardHeader>
                <CardTitle>Landlord Information</CardTitle>
                <CardDescription>Contact the landlord directly for inquiries.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-muted-foreground"/>
                    <span className="font-medium">{listing.landlord.name}</span>
                     {listing.landlord.verified && (
                         <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 text-xs">
                             <CheckCircle className="w-3 h-3 mr-1"/> Verified
                         </Badge>
                    )}
                     {!listing.landlord.verified && (
                         <Badge variant="destructive" className="text-xs">
                             Verification Pending
                         </Badge>
                    )}
                </div>
                {listing.landlord.verified && ( // Only show phone option if verified
                 <div className="flex items-center gap-3">
                     <Phone className="w-5 h-5 text-muted-foreground"/>
                     {showPhoneNumber ? (
                        <span className="text-muted-foreground">{listing.landlord.phone}</span>
                     ) : (
                         <Button variant="outline" size="sm" onClick={() => setShowPhoneNumber(true)} disabled={!isTenantLoggedIn} title={!isTenantLoggedIn ? "Login as tenant to view number" : ""}>
                            <Eye className="w-4 h-4 mr-1" /> View Number
                         </Button>
                     )}
                 </div>
                )}

                 <Separator/>

                 {/* Link to message page or disable if not logged in */}
                 {isTenantLoggedIn ? (
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                         {/* TODO: Update href to actual message creation/view page */}
                         <Link href={`/messages/new?landlordId=${listing.landlord.id}&listingId=${listing.id}`}>
                             <MessageSquare className="w-4 h-4 mr-2"/> Send Message to Landlord
                         </Link>
                     </Button>
                  ) : (
                     <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled title="Login as tenant to send message">
                        <MessageSquare className="w-4 h-4 mr-2"/> Send Message to Landlord
                     </Button>
                  )}


                 {/* Inspection Request */}
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="outline" className="w-full" disabled={!isTenantLoggedIn} title={!isTenantLoggedIn ? "Login as tenant to request inspection" : ""}>
                          <CalendarDays className="w-4 h-4 mr-2"/> Request Property Inspection
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Inspection Request</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to request an inspection for "{listing.title}"? The landlord will be notified and may contact you to schedule.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRequestInspection}>Confirm Request</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>

             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

