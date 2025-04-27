
'use client'; // Make this a client component to fetch ads

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, MapPin, Wallet, MessageSquare, Loader2 } from 'lucide-react'; // Added Loader2
import Image from 'next/image';
import Link from "next/link";
import { FilterSidebar } from './_components/FilterSidebar';
import { useEffect, useState } from 'react';

// Define Advertisement type (should match ManageAdvertsTable)
type Advertisement = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  targetPages: ('landing' | 'listings')[];
  status: 'active' | 'inactive';
  createdAt: Date;
};

// Mock function to fetch active ads for the listings page
// TODO: Replace with actual API call
async function fetchListingsPageAds(): Promise<Advertisement[]> {
    console.log("Fetching listings page ads...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
        const storedAds = localStorage.getItem('cribdirectAds');
        if (storedAds) {
            const allAds: Advertisement[] = JSON.parse(storedAds, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
            });
            const activeListingsAds = allAds.filter(ad => ad.status === 'active' && ad.targetPages.includes('listings'));
            console.log("Loaded active listings page ads from localStorage");
            return activeListingsAds;
        }
    } catch (e) {
        console.error("Could not parse ads from localStorage for listings page", e);
    }
    console.log("Using mock listings page ad data (fallback)");
    // Fallback mock data
    return [
        { id: 'ad2', title: 'New Listings Alert', imageUrl: 'https://picsum.photos/seed/listingsAd/900/150', linkUrl: 'https://example.com/new', targetPages: ['listings'], status: 'active', createdAt: new Date() }
    ];
}


// Mock data for listings - replace with actual data fetching
const listings = [
  {
    id: 1,
    title: "Spacious 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦3,500,000/year",
    bedrooms: 3,
    bathrooms: 4,
    imageUrl: "https://picsum.photos/seed/house1_livingroom/400/300", // Updated image
    verified: true,
    amenities: ["Water Supply", "Electricity", "Security"],
  },
  {
    id: 2,
    title: "Cozy 2 Bedroom Flat",
    location: "Yaba, Lagos",
    price: "₦1,800,000/year",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://picsum.photos/seed/house2_bedroom/400/300", // Updated image
    verified: true,
    amenities: ["Water Supply", "Prepaid Meter"],
  },
  {
    id: 3,
    title: "Modern Studio Apartment",
    location: "Ikeja GRA, Lagos",
    price: "₦1,200,000/year",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/seed/house3_studio/400/300", // Updated image
    verified: false, // Example of unverified landlord
    amenities: ["Furnished", "Generator"],
  },
   {
    id: 4,
    title: "Family Duplex with Garden",
    location: "Magodo Phase 2, Lagos",
    price: "₦5,000,000/year",
    bedrooms: 4,
    bathrooms: 5,
    imageUrl: "https://picsum.photos/seed/house4_compound/400/300", // Updated image
    verified: true,
    amenities: ["Parking Space", "Water Heater", "Security"],
  },
];

export default function ListingsPage() {
   const [ads, setAds] = useState<Advertisement[]>([]);
   const [isLoadingAds, setIsLoadingAds] = useState(true);

    useEffect(() => {
        setIsLoadingAds(true);
        fetchListingsPageAds()
            .then(data => setAds(data))
            .catch(err => console.error("Failed to load listings page ads:", err))
            .finally(() => setIsLoadingAds(false));
    }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>

        {/* Ad Banner Section */}
       <div className="mb-8">
            {isLoadingAds ? (
                <div className="flex justify-center items-center h-24 bg-muted rounded-lg">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : ads.length > 0 ? (
                <div className="bg-muted p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    {/* Display the first active ad */}
                    <Link href={ads[0].linkUrl} target="_blank" rel="noopener noreferrer" title={ads[0].title}>
                        <Image
                            src={ads[0].imageUrl}
                            alt={ads[0].title}
                            width={1200} // Adjust width as needed for banner
                            height={150} // Adjust height for banner aspect ratio
                            className="w-full h-auto object-contain rounded" // object-contain prevents distortion
                            unoptimized
                        />
                    </Link>
                     {/* Optional: Small text indicating it's an ad */}
                     {/* <p className="text-xs text-muted-foreground text-right mt-1">Advertisement</p> */}
                </div>
            ) : (
                 <div className="h-24 bg-muted rounded-lg flex items-center justify-center">
                    {/* Placeholder or empty state if no ads */}
                    {/* <p className="text-muted-foreground text-sm">Ad Space</p> */}
                </div>
            )}
       </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <FilterSidebar />

        {/* Listings Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="p-0 relative">
                 <Image
                    src={listing.imageUrl}
                    alt={listing.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                    unoptimized // Added for picsum consistency
                  />
                  {listing.verified && (
                    <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-300">
                      Verified Landlord
                    </Badge>
                  )}
                   {!listing.verified && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Verification Pending
                    </Badge>
                  )}
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <CardTitle className="text-lg mb-1">{listing.title}</CardTitle>
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
                    <Wallet className="w-5 h-5"/> {listing.price}
                 </div>
                 <div className="flex flex-wrap gap-1">
                    {listing.amenities.map(amenity => (
                        <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                    ))}
                 </div>
              </CardContent>
              <CardFooter className="p-4 border-t">
                 <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href={`/listings/${listing.id}`}>
                       View Details & Contact Landlord <MessageSquare className="ml-2 h-4 w-4"/>
                    </Link>
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
