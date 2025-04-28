

'use client';

import React, { useState, useEffect, use } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Bath, MapPin, Wallet, CheckCircle, MessageSquare, User, Phone, CalendarDays, Eye, EyeOff, ArrowLeft, Loader2, Video, Gamepad2 } from 'lucide-react'; // Added Gamepad2
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
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


// Mock function to get listing data by ID - Replace with actual data fetching
// Updated locations and image seeds for more realism
async function getListingData(id: string): Promise<ListingData | null> { // Added null return type
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
        imageUrl: "https://picsum.photos/seed/lekki_apt_living_lg/800/600", // More specific seed
        gallery: [ // Added gallery
            "https://picsum.photos/seed/lekki_apt_living_lg/800/600",
            "https://picsum.photos/seed/lekki_apt_kitchen_lg/800/600",
            "https://picsum.photos/seed/lekki_apt_bedroom_lg/800/600",
            "https://picsum.photos/seed/lekki_apt_bathroom_lg/800/600",
        ],
        videoUrl: "https://videos.pexels.com/video-files/857802/857802-hd_1280_720_25fps.mp4", // Sample video URL
        verified: true,
        amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
        propertyType: "apartment", // Added propertyType
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
        imageUrl: "https://picsum.photos/seed/yaba_flat_bedroom_lg/800/600", // More specific seed
        gallery: [ // Added gallery
            "https://picsum.photos/seed/yaba_flat_bedroom_lg/800/600",
            "https://picsum.photos/seed/yaba_flat_kitchen_lg/800/600",
            "https://picsum.photos/seed/yaba_flat_exterior_lg/800/600",
        ],
        videoUrl: null, // No video
        verified: true,
        amenities: ["Water Supply", "Prepaid Meter", "Tiled Floors"],
        propertyType: "apartment", // Added propertyType
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
        imageUrl: "https://picsum.photos/seed/ikeja_studio_interior_lg/800/600", // More specific seed
        gallery: [ // Added gallery
            "https://picsum.photos/seed/ikeja_studio_interior_lg/800/600",
            "https://picsum.photos/seed/ikeja_studio_bathroom_lg/800/600",
            "https://picsum.photos/seed/ikeja_studio_entrance_lg/800/600",
        ],
        videoUrl: null, // No video
        verified: false, // Example of unverified landlord
        amenities: ["Furnished", "Generator", "Air Conditioning"],
        propertyType: "studio", // Added propertyType
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
        imageUrl: "https://picsum.photos/seed/magodo_duplex_exterior_lg/800/600", // More specific seed
        gallery: [ // Added gallery
            "https://picsum.photos/seed/magodo_duplex_exterior_lg/800/600",
            "https://picsum.photos/seed/magodo_duplex_livingroom_lg/800/600",
            "https://picsum.photos/seed/magodo_duplex_garden_lg/800/600",
            "https://picsum.photos/seed/magodo_duplex_masterbedroom_lg/800/600",
        ],
         videoUrl: "https://videos.pexels.com/video-files/5997169/5997169-hd_1280_720_30fps.mp4", // Sample video URL
        verified: true,
        amenities: ["Parking Space", "Water Heater", "Security", "Garden", "Gated Estate"],
        propertyType: "duplex", // Added propertyType
         landlord: { id: "landlord_dangote", name: "Alhaji Dangote Properties", verified: true, phone: "+2348100000001" },
      },
       {
        id: 5,
        title: "Luxury Penthouse",
        location: "Ikoyi, Lagos",
        price: "₦15,000,000/year",
        bedrooms: 4,
        bathrooms: 5,
        imageUrl: "https://picsum.photos/seed/ikoyi_penthouse_view_lg/800/600", // More specific seed
        gallery: [
            "https://picsum.photos/seed/ikoyi_penthouse_view_lg/800/600",
            "https://picsum.photos/seed/ikoyi_penthouse_living_lg/800/600",
            "https://picsum.photos/seed/ikoyi_penthouse_balcony_lg/800/600",
        ],
        videoUrl: null,
        verified: true,
        amenities: ["Swimming Pool", "Gym", "Security", "Parking Space", "Water Heater"],
        propertyType: "penthouse", // Added propertyType
        landlord: { id: "landlord_dangote", name: "Alhaji Dangote Properties", verified: true, phone: "+2348100000001" },
      },
      {
        id: 6,
        title: "Affordable Self-Contain",
        location: "Surulere, Lagos",
        price: "₦450,000/year",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: "https://picsum.photos/seed/surulere_selfcon_room_lg/800/600", // More specific seed
        gallery: [
            "https://picsum.photos/seed/surulere_selfcon_room_lg/800/600",
            "https://picsum.photos/seed/surulere_selfcon_interior_lg/800/600",
        ],
        videoUrl: null,
        verified: true,
        amenities: ["Water Supply", "Tiled Floors"],
        propertyType: "self-contain", // Added propertyType
        landlord: { id: "landlord_funke", name: "Mrs. Funke Akindele", verified: true, phone: "+2348098765432" },
      },
      {
        id: 7,
        title: "Short Let Apartment",
        location: "Victoria Island, Lagos",
        price: "₦30,000/week",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: "https://picsum.photos/seed/vi_shortlet_living_lg/800/600", // More specific seed
        gallery: [
            "https://picsum.photos/seed/vi_shortlet_living_lg/800/600",
            "https://picsum.photos/seed/vi_shortlet_interior_lg/800/600",
        ],
        videoUrl: null,
        verified: true,
        amenities: ["Furnished", "Air Conditioning", "Electricity", "Wifi", "PS5"], // Added PS5
        propertyType: "airbnb", // Added propertyType
        landlord: { id: "landlord_adekunle", name: "Mr. Adekunle Gold", verified: true, phone: "+2348012345678" },
      },
      {
        id: 8,
        title: "Newly Built Terrace House",
        location: "Wuse 2, Abuja", // Changed Location
        price: "₦4,800,000/year",
        bedrooms: 3,
        bathrooms: 3,
        imageUrl: "https://picsum.photos/seed/abuja_terrace_exterior_lg/800/600", // Specific seed
        gallery: [
            "https://picsum.photos/seed/abuja_terrace_exterior_lg/800/600",
            "https://picsum.photos/seed/abuja_terrace_interior_lg/800/600",
            "https://picsum.photos/seed/abuja_terrace_kitchen_lg/800/600",
        ],
        videoUrl: "https://videos.pexels.com/video-files/855389/855389-hd_1280_720_25fps.mp4", // Sample video
        verified: true,
        amenities: ["Gated Estate", "Security", "Water Supply", "Prepaid Meter"],
        propertyType: "terrace", // Added propertyType
        landlord: { id: "landlord_adekunle", name: "Mr. Adekunle Gold", verified: true, phone: "+2348012345678" },
      },
      {
        id: 9,
        title: "Modern 2BR Short Let",
        location: "New GRA, Port Harcourt", // Changed Location
        price: "₦40,000/week",
        bedrooms: 2,
        bathrooms: 2,
        imageUrl: "https://picsum.photos/seed/ph_shortlet_modern_lg/800/600", // Specific seed
        gallery: [
             "https://picsum.photos/seed/ph_shortlet_modern_lg/800/600",
             "https://picsum.photos/seed/ph_shortlet_living_lg/800/600",
             "https://picsum.photos/seed/ph_shortlet_bedroom_lg/800/600",
        ],
        videoUrl: null,
        verified: true,
        amenities: ["Furnished", "Air Conditioning", "Wifi", "Generator", "Security"],
        propertyType: "airbnb", // Added propertyType
        landlord: { id: "landlord_test", name: "Test Landlord", verified: true, phone: "+2348010101010" },
      },
      {
        id: 10,
        title: "Detached Bungalow with BQ",
        location: "Bodija, Ibadan", // Changed Location
        price: "₦2,200,000/year",
        bedrooms: 3,
        bathrooms: 3,
        imageUrl: "https://picsum.photos/seed/ibadan_bungalow_garden_lg/800/600", // Specific seed
        gallery: [
            "https://picsum.photos/seed/ibadan_bungalow_garden_lg/800/600",
            "https://picsum.photos/seed/ibadan_bungalow_compound_lg/800/600",
            "https://picsum.photos/seed/ibadan_bungalow_interior_lg/800/600",
        ],
        videoUrl: null,
        verified: true,
        amenities: ["Garden", "Parking Space", "Water Supply"],
        propertyType: "bungalow", // Added propertyType
        landlord: { id: "landlord_funke", name: "Mrs. Funke Akindele", verified: true, phone: "+2348098765432" },
      },
      {
        id: 11,
        title: "Student Hostel Room (Self-Contained)",
        location: "Samaru, Zaria", // Changed Location
        price: "₦250,000/year",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: "https://picsum.photos/seed/zaria_hostel_room_lg/800/600", // Specific seed
        gallery: ["https://picsum.photos/seed/zaria_hostel_room_lg/800/600"], // Single image example
        videoUrl: null,
        verified: false, // Unverified example
        amenities: ["Water Supply", "Prepaid Meter"],
        propertyType: "self-contain", // Added propertyType
        landlord: { id: "landlord_bovi", name: "Mr. Bovi Ugboma", verified: false, phone: "+2347011223344" },
      },
      {
        id: 12,
        title: "Executive 5-Bedroom Duplex",
        location: "Asokoro, Abuja", // Kept Abuja for variety
        price: "₦12,000,000/year",
        bedrooms: 5,
        bathrooms: 6,
        imageUrl: "https://picsum.photos/seed/asokoro_duplex_pool_lg/800/600", // Specific seed
        gallery: [
            "https://picsum.photos/seed/asokoro_duplex_pool_lg/800/600",
            "https://picsum.photos/seed/asokoro_duplex_interior_lg/800/600",
            "https://picsum.photos/seed/asokoro_duplex_gate_lg/800/600",
        ],
        videoUrl: "https://videos.pexels.com/video-files/5359829/5359829-hd_1920_1080_25fps.mp4", // Sample video
        verified: true,
        amenities: ["Gated Estate", "Security", "Swimming Pool", "Gym", "Generator", "Parking Space"],
        propertyType: "duplex", // Added propertyType
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
            imageUrl: "https://picsum.photos/seed/test_landlord_apt_exterior_lg/800/600", // Unique image
            gallery: [
                "https://picsum.photos/seed/test_landlord_apt_exterior_lg/800/600",
                "https://picsum.photos/seed/test_landlord_apt_kitchen_lg/800/600",
                "https://picsum.photos/seed/test_landlord_apt_bedroom_lg/800/600",
            ],
             videoUrl: null, // No video
            description: "This is the spacious 3 bedroom apartment listed by the test landlord. Excellent condition.",
            verified: true, // Assuming landlord is verified
            status: 'active',
            amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
            propertyType: "apartment", // Added propertyType
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
            imageUrl: "https://picsum.photos/seed/test_landlord_flat_kitchen_lg/800/600", // Unique image
             gallery: [
                 "https://picsum.photos/seed/test_landlord_flat_kitchen_lg/800/600",
                 "https://picsum.photos/seed/test_landlord_flat_living_lg/800/600",
             ],
             videoUrl: null, // No video
             description: "Cozy and affordable flat in Yaba.",
             verified: true,
             amenities: ["Water Supply", "Prepaid Meter"],
             propertyType: "apartment", // Added propertyType
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
            imageUrl: 'https://picsum.photos/seed/banana_island_penthouse_pool_lg/800/600', // Specific seed
            gallery: ['https://picsum.photos/seed/banana_island_penthouse_pool_lg/800/600', 'https://picsum.photos/seed/banana_island_penthouse_living_lg/800/600'],
             videoUrl: null, // No video
            description: 'Ultra-luxury penthouse with amazing views and private pool.',
            verified: true, // Landlord might be verified even if listing is flagged
            amenities: ['Swimming Pool', 'Security', 'Parking Space', 'Gym'],
            propertyType: "penthouse", // Added propertyType
            landlord: { id: 'landlord_bigshot', name: 'Mr. Big Shot', verified: true, phone: '+2349011112222' }
        },
        {
            id: 'prop456',
            title: 'Cozy Studio Near Market',
            location: "Oshodi, Lagos",
            price: "₦500,000/year",
            bedrooms: 1,
            bathrooms: 1,
            imageUrl: 'https://picsum.photos/seed/oshodi_studio_simple_lg/800/600', // Specific seed
            gallery: ['https://picsum.photos/seed/oshodi_studio_simple_lg/800/600', 'https://picsum.photos/seed/oshodi_studio_bathroom_lg/800/600'],
             videoUrl: null, // No video
            description: 'Affordable studio apartment with basic amenities, close to the market.',
            verified: true,
            amenities: ['Water Supply', 'Tiled Floors'],
            propertyType: "studio", // Added propertyType
            landlord: { id: 'landlord_reasonable', name: 'Mrs. Reasonable', verified: true, phone: '+2348033334444' }
        },
        {
            id: 'prop789',
            title: 'Beachfront Villa (URGENT RENT)',
            location: "Eleko Beach, Lagos",
            price: "₦8,000,000/year",
            bedrooms: 5,
            bathrooms: 6,
            imageUrl: 'https://picsum.photos/seed/eleko_villa_beachview_lg/800/600', // Specific seed
            gallery: ['https://picsum.photos/seed/eleko_villa_beachview_lg/800/600', 'https://picsum.photos/seed/eleko_villa_interior_lg/800/600'],
             videoUrl: null, // No video
            description: 'Spacious beachfront property, available for immediate rent. Great views!',
            verified: false, // Assume landlord verification might be pending or failed
            amenities: ['Beach Access', 'Balcony', 'Parking Space'],
            propertyType: "duplex", // Assuming Villa maps to Duplex // Added propertyType
            landlord: { id: 'landlord_scamface', name: 'Shady McScamface', verified: false, phone: '+2347055556666' }
        },
         {
            id: 13,
            title: "Daily Rental Condo",
            location: "Maitama, Abuja",
            price: "₦50,000/day", // Daily price example
            bedrooms: 1,
            bathrooms: 1,
            imageUrl: "https://picsum.photos/seed/maitama_condo_daily/800/600",
            gallery: [
                 "https://picsum.photos/seed/maitama_condo_daily/800/600",
                 "https://picsum.photos/seed/maitama_condo_interior/800/600",
            ],
             videoUrl: null,
            verified: true,
            amenities: ["Furnished", "Air Conditioning", "Wifi", "PS5"], // Added PS5
            propertyType: "airbnb",
            landlord: { id: "landlord_test", name: "Test Landlord", verified: true, phone: "+2348010101010" },
        },
    ];

   // Find by string or number depending on how IDs are stored/passed
   const listing = listings.find(l => String(l.id) === String(id));

   if (!listing) {
     // Simulate throwing a 404 error or return null if not found
     // For simplicity in this mock, we return null. In a real app, you might throw an error.
     console.error(`Listing with ID ${id} not found.`);
     return null;
   }
   // Ensure the structure matches ListingData including the gallery
   return listing as ListingData; // Assuming the structure matches
}


interface ListingDetailPageProps {
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
    propertyType: string; // Added propertyType
    landlord: {
        id: string;
        name: string;
        verified: boolean;
        phone: string;
    };
}; // Removed null allowance here, handle not found in component


export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  // Accessing params directly is supported but shows a warning in newer Next.js versions with App Router.
  // Using `useParams` from 'next/navigation' is the recommended way in Client Components.
  // However, for simplicity and given the current setup, direct access is used here.
  // We'll handle potential undefined `params.id` within useEffect.

  const [listing, setListing] = useState<ListingData | null>(null); // Allow null state initially
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize router


  // Fetch data on the client side since this is now a Client Component
  useEffect(() => {
     // Access params.id inside useEffect to handle potential undefined
    const listingId = params.id;
    if (!listingId) {
        console.error("Listing ID is missing from params.");
        setIsLoading(false); // Stop loading if ID is missing
        // Optionally redirect to a 404 page or listings page
        // router.push('/404');
        toast({ variant: 'destructive', title: "Error", description: "Invalid listing ID." });
        router.push('/listings');
        return;
    }

    setIsLoading(true);
    getListingData(listingId)
      .then(data => {
        if (data) {
            setListing(data);
        } else {
            // Handle case where data is explicitly null (not found)
            console.error("Listing not found for ID:", listingId);
             toast({ variant: 'destructive', title: "Not Found", description: "Listing could not be found." });
             router.push('/listings'); // Redirect if not found
        }
      })
      .catch(err => {
        console.error("Failed to load listing data:", err);
         toast({ variant: 'destructive', title: "Error", description: "Failed to load listing details." });
         // Optionally redirect on error
         // router.push('/listings');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, router, toast]); // Dependency on params.id


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
    // Render this specific message if loading finished but listing is still null
    return <div className="container mx-auto py-12 text-center">Listing not found or could not be loaded.</div>;
  }

  // Determine if the "Send Message" button should be enabled
  let isTenantLoggedIn = false;
  try {
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
                           {amenity === 'PS5' ? <Gamepad2 className="w-4 h-4 mr-1 text-purple-600"/> : <CheckCircle className="w-4 h-4 mr-1 text-green-600"/>}
                           {amenity}
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
