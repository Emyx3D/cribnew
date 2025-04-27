

'use client'; // Add 'use client' directive

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Bath, MapPin, Wallet, CheckCircle, MessageSquare, User, Phone, CalendarDays, Eye, EyeOff, ArrowLeft, Loader2, Video } from 'lucide-react'; // Added Video icon
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
async function getListingData(id: string): Promise<ListingData> {
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
        gallery: [ // Added gallery
            "https://picsum.photos/seed/house1_livingroom_lg/800/600",
            "https://picsum.photos/seed/house1_kitchen_lg/800/600",
            "https://picsum.photos/seed/house1_bedroom_lg/800/600",
            "https://picsum.photos/seed/house1_bathroom_lg/800/600",
        ],
        videoUrl: "https://videos.pexels.com/video-files/857802/857802-hd_1280_720_25fps.mp4", // Sample video URL
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
        gallery: [ // Added gallery
            "https://picsum.photos/seed/house2_bedroom_lg/800/600",
            "https://picsum.photos/seed/house2_kitchen_lg/800/600",
            "https://picsum.photos/seed/house2_exterior_lg/800/600",
        ],
        videoUrl: null, // No video
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
        gallery: [ // Added gallery
            "https://picsum.photos/seed/house3_studio_lg/800/600",
            "https://picsum.photos/seed/house3_bathroom_lg/800/600",
            "https://picsum.photos/seed/house3_entrance_lg/800/600",
        ],
        videoUrl: null, // No video
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
        gallery: [ // Added gallery
            "https://picsum.photos/seed/house4_compound_lg/800/600",
            "https://picsum.photos/seed/house4_livingroom_lg/800/600",
            "https://picsum.photos/seed/house4_garden_lg/800/600",
            "https://picsum.photos/seed/house4_masterbedroom_lg/800/600",
        ],
         videoUrl: "https://videos.pexels.com/video-files/5997169/5997169-hd_1280_720_30fps.mp4", // Sample video URL
        verified: true,
        amenities: ["Parking Space", "Water Heater", "Security", "Garden", "Gated Estate"],
         landlord: { id: "landlord_dangote", name: "Alhaji Dangote Properties", verified: true, phone: "+2348100000001" },
      },
      // Add the specific listing ID referenced in ManageListingsTable if needed
        {
            id: 'landlord_prop1', // Assuming this is a string ID
            title: "My Spacious 3 Bedroom Apartment",
            location: "Lekki Phase 1, Lagos",
            price: "₦3,500,000/year",
            bedrooms: 3,
            bathrooms: 4,
            imageUrl: "https://picsum.photos/seed/my_house1_exterior/800/600", // Updated image
            gallery: [
                "https://picsum.photos/seed/my_house1_exterior/800/600",
                "https://picsum.photos/seed/my_house1_kitchen/800/600",
                "https://picsum.photos/seed/my_house1_bedroom/800/600",
            ],
             videoUrl: null, // No video
            description: "This is the spacious 3 bedroom apartment listed by the test landlord. Excellent condition.",
            verified: true, // Assuming landlord is verified
            status: 'active',
            amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
            landlord: { id: "landlord_test", name: "Test Landlord", verified: true, phone: "+2348010101010" }, // Assuming landlord is verified
        },
        // Add another listing for testing links
         {
            id: 'landlord_prop2', // Assuming this is a string ID
            title: "My Cozy 2 Bedroom Flat",
            location: "Yaba, Lagos",
            price: "₦1,800,000/year",
            bedrooms: 2,
            bathrooms: 2,
            imageUrl: "https://picsum.photos/seed/my_house2_kitchen/800/600", // Updated image
             gallery: [
                 "https://picsum.photos/seed/my_house2_kitchen/800/600",
                 "https://picsum.photos/seed/my_house2_living/800/600",
             ],
             videoUrl: null, // No video
             description: "Cozy and affordable flat in Yaba.",
             verified: true,
             amenities: ["Water Supply", "Prepaid Meter"],
             landlord: { id: "landlord_test", name: "Test Landlord", verified: true, phone: "+2348010101010" }, // Assuming landlord is verified
        },
         // Add listings from FlaggedListingsTable for linking
        {
            id: 'prop123',
            title: 'Luxury Penthouse with Pool',
            location: "Banana Island, Lagos",
            price: "₦25,000,000/year",
            bedrooms: 4,
            bathrooms: 5,
            imageUrl: 'https://picsum.photos/seed/prop123_pool/800/600',
            gallery: ['https://picsum.photos/seed/prop123_pool/800/600', 'https://picsum.photos/seed/prop123_living/800/600'],
             videoUrl: null, // No video
            description: 'Ultra-luxury penthouse with amazing views and private pool.',
            verified: true, // Landlord might be verified even if listing is flagged
            amenities: ['Swimming Pool', 'Security', 'Parking Space', 'Gym'],
            landlord: { id: 'landlord_bigshot', name: 'Mr. Big Shot', verified: true, phone: '+2349011112222' }
        },
        {
            id: 'prop456',
            title: 'Cozy Studio Near Market',
            location: "Oshodi, Lagos",
            price: "₦500,000/year",
            bedrooms: 1,
            bathrooms: 1,
            imageUrl: 'https://picsum.photos/seed/prop456_studio/800/600',
            gallery: ['https://picsum.photos/seed/prop456_studio/800/600', 'https://picsum.photos/seed/prop456_bathroom/800/600'],
             videoUrl: null, // No video
            description: 'Affordable studio apartment with basic amenities, close to the market.',
            verified: true,
            amenities: ['Water Supply', 'Tiled Floors'],
            landlord: { id: 'landlord_reasonable', name: 'Mrs. Reasonable', verified: true, phone: '+2348033334444' }
        },
        {
            id: 'prop789',
            title: 'Beachfront Villa (URGENT RENT)',
            location: "Eleko Beach, Lagos",
            price: "₦8,000,000/year",
            bedrooms: 5,
            bathrooms: 6,
            imageUrl: 'https://picsum.photos/seed/prop789_beach/800/600',
            gallery: ['https://picsum.photos/seed/prop789_beach/800/600', 'https://picsum.photos/seed/prop789_interior/800/600'],
             videoUrl: null, // No video
            description: 'Spacious beachfront property, available for immediate rent. Great views!',
            verified: false, // Assume landlord verification might be pending or failed
            amenities: ['Beach Access', 'Balcony', 'Parking Space'],
            landlord: { id: 'landlord_scamface', name: 'Shady McScamface', verified: false, phone: '+2347055556666' }
        }
    ];

   // Find by string or number depending on how IDs are stored/passed
   const listing = listings.find(l => String(l.id) === String(id));

   if (!listing) {
     return null;
   }
   // Ensure the structure matches ListingData including the gallery
   return listing as ListingData; // Assuming the structure matches
}


interface ListingDetailPageProps {
  // Keep `params` as the prop name expected by Next.js for dynamic routes
  params: { id: string };
}


// Define the listing type based on mock data structure
// Add 'gallery' and 'videoUrl' to the type definition
type ListingData = {
    id: number | string; // Allow string IDs
    title: string;
    location: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    description: string;
    imageUrl: string;
    gallery: string[]; // Array of image URLs
    videoUrl?: string | null; // Optional video URL
    verified: boolean;
    amenities: string[];
    landlord: {
        id: string;
        name: string;
        verified: boolean;
        phone: string;
    };
} | null; // Allow null if not found


export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  // Note: `React.use()` is not suitable for Client Components in this context.
  // The warning about direct `params` access is informational for future compatibility.
  // We will continue accessing `params.id` directly within `useEffect` and use it in the dependency array.

  const [listing, setListing] = useState<ListingData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router


  // Fetch data on the client side since this is now a Client Component
  useEffect(() => {
     // Access params.id inside useEffect to avoid top-level access warning
     // Direct access is still supported in this Next.js version, despite the warning.
    const listingId = params.id;
    if (!listingId) {
        console.error("Listing ID is missing from params.");
        setIsLoading(false); // Stop loading if ID is missing
        // Optionally redirect or show an error message
        router.push('/404'); // Example redirect
        return; // Don't fetch if id is not available
    }

    setIsLoading(true);
    getListingData(listingId)
      .then(data => {
        if (data) {
            setListing(data);
        } else {
            // Handle listing not found (e.g., show 404 or redirect)
            console.error("Listing not found for ID:", listingId);
             toast({ variant: 'destructive', title: "Not Found", description: "Listing could not be found." });
             router.push('/listings'); // Redirect back to listings if not found
            // Optionally redirect: router.push('/404');
        }
      })
      .catch(err => {
        console.error("Failed to load listing data:", err);
         toast({ variant: 'destructive', title: "Error", description: "Failed to load listing details." });
        // Optionally show an error message or redirect
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, router, toast]); // Correctly pass params.id


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
     return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[50vh]">
             <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }


  if (!listing) {
    // Improved message for when listing is definitively not found after loading
     // This state might be reached briefly before redirecting if toast/redirect logic is added above
    return <div className="container mx-auto py-12 text-center">Listing not found or could not be loaded.</div>;
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
          Back
       </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (Image & Details) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden shadow-lg">
             {/* Main Image */}
             <Image
                src={listing.imageUrl}
                alt={listing.title}
                width={800}
                height={500}
                className="w-full h-64 md:h-96 object-cover"
                priority
                unoptimized // Added for picsum consistency
              />
             {/* Image Gallery */}
             {listing.gallery && listing.gallery.length > 1 && (
                 <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-4 border-t">
                    {listing.gallery.slice(0, 4).map((imgUrl, index) => ( // Show first 4 gallery images
                         <Image
                            key={index}
                            src={imgUrl}
                            alt={`${listing.title} - view ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            unoptimized
                            // TODO: Add onClick handler to open a lightbox/modal viewer
                         />
                    ))}
                 </div>
             )}
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
                <p className="text-muted-foreground mb-6 whitespace-pre-line"> {/* Use whitespace-pre-line for line breaks */}
                  {listing.description}
                </p>

                 <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                 <div className="flex flex-wrap gap-2 mb-6">
                    {listing.amenities.map(amenity => (
                        <Badge key={amenity} variant="secondary" className="px-3 py-1 text-sm">
                           <CheckCircle className="w-4 h-4 mr-1 text-green-600"/> {amenity}
                        </Badge>
                    ))}
                 </div>

                  {/* Video Section */}
                 {listing.videoUrl && (
                    <>
                      <Separator className="my-6" />
                      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <Video className="w-5 h-5" /> Video Tour
                      </h2>
                      <div className="aspect-video w-full max-w-2xl mx-auto bg-muted rounded-lg overflow-hidden">
                          <video
                              controls
                              src={listing.videoUrl}
                              className="w-full h-full object-contain"
                              preload="metadata" // Load metadata for duration etc.
                          >
                               Your browser does not support the video tag.
                           </video>
                      </div>
                    </>
                 )}
             </CardContent>
          </Card>
        </div>

        {/* Sidebar (Landlord & Actions) */}
        <div className="lg:col-span-1 space-y-6">
           <Card className="shadow-md sticky top-20"> {/* Made sidebar sticky */}
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
                             {isTenantLoggedIn ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                             View Number
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

