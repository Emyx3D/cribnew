
'use client'; // Make this a client component to fetch ads and properties

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, MapPin, Wallet, MessageSquare, Loader2, CheckCircle } from 'lucide-react'; // Added Loader2, CheckCircle
import Image from 'next/image';
import Link from "next/link";
import { FilterSidebar, FilterValues } from './_components/FilterSidebar'; // Import FilterValues type
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

// Define Listing type
type Listing = {
    id: number | string; // Allow string IDs
    title: string;
    location: string;
    price: string; // String format like "₦3,500,000/year"
    bedrooms: number;
    bathrooms: number;
    imageUrl: string; // Cover image URL
    verified: boolean; // Landlord verified status
    amenities: string[];
    propertyType: string; // e.g., "apartment", "duplex"
};


// Mock function to fetch active ads for the listings page
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
    return [
        { id: 'ad2', title: 'New Listings Alert', imageUrl: 'https://picsum.photos/seed/listingsAd/900/150', linkUrl: 'https://example.com/new', targetPages: ['listings'], status: 'active', createdAt: new Date() }
    ];
}

// Mock data for ALL listings - replace with actual data fetching
const allListings: Listing[] = [
  {
    id: 1,
    title: "Spacious 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦3,500,000/year",
    bedrooms: 3,
    bathrooms: 4,
    imageUrl: "https://picsum.photos/seed/house1_livingroom/400/300",
    verified: true,
    amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
    propertyType: "apartment",
  },
  {
    id: 2,
    title: "Cozy 2 Bedroom Flat",
    location: "Yaba, Lagos",
    price: "₦1,800,000/year",
    bedrooms: 2,
    bathrooms: 2,
    imageUrl: "https://picsum.photos/seed/house2_bedroom/400/300",
    verified: true,
    amenities: ["Water Supply", "Prepaid Meter", "Tiled Floors"],
    propertyType: "apartment",
  },
  {
    id: 3,
    title: "Modern Studio Apartment",
    location: "Ikeja GRA, Lagos",
    price: "₦1,200,000/year",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/seed/house3_studio/400/300",
    verified: false,
    amenities: ["Furnished", "Generator", "Air Conditioning"],
    propertyType: "studio",
  },
   {
    id: 4,
    title: "Family Duplex with Garden",
    location: "Magodo Phase 2, Lagos",
    price: "₦5,000,000/year",
    bedrooms: 4,
    bathrooms: 5,
    imageUrl: "https://picsum.photos/seed/house4_compound/400/300",
    verified: true,
    amenities: ["Parking Space", "Water Heater", "Security", "Garden", "Gated Estate"],
    propertyType: "duplex",
  },
  // Add more listings for testing filters
   {
    id: 5,
    title: "Luxury Penthouse",
    location: "Ikoyi, Lagos",
    price: "₦15,000,000/year",
    bedrooms: 4,
    bathrooms: 5,
    imageUrl: "https://picsum.photos/seed/house5_penthouse/400/300",
    verified: true,
    amenities: ["Swimming Pool", "Gym", "Security", "Parking Space", "Water Heater"],
    propertyType: "penthouse",
  },
  {
    id: 6,
    title: "Affordable Self-Contain",
    location: "Surulere, Lagos",
    price: "₦450,000/year",
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/seed/house6_selfcon/400/300",
    verified: true,
    amenities: ["Water Supply", "Tiled Floors"],
    propertyType: "self-contain",
  },
   {
    id: 7,
    title: "Short Let Apartment",
    location: "Victoria Island, Lagos",
    price: "₦30,000/week", // Weekly price example
    bedrooms: 1,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/seed/house7_airbnb/400/300",
    verified: true,
    amenities: ["Furnished", "Air Conditioning", "Electricity", "Wifi"],
    propertyType: "airbnb",
  },
];

// Function to parse price string (e.g., "₦3,500,000/year") into numeric value and frequency
const parsePrice = (priceString: string): { value: number; frequency: 'year' | 'month' | 'week' | 'unknown' } => {
    const numericPart = priceString.replace(/[^0-9]/g, '');
    const value = parseInt(numericPart, 10);

    if (isNaN(value)) {
        return { value: 0, frequency: 'unknown' };
    }

    const lowerCaseString = priceString.toLowerCase();
    if (lowerCaseString.includes('/year') || lowerCaseString.includes('/yr')) {
        return { value, frequency: 'year' };
    } else if (lowerCaseString.includes('/month') || lowerCaseString.includes('/mo')) {
        return { value, frequency: 'month' };
    } else if (lowerCaseString.includes('/week') || lowerCaseString.includes('/wk')) {
        return { value, frequency: 'week' };
    }

    return { value, frequency: 'year' }; // Default to yearly if frequency not specified
};

// Function to normalize price to a yearly equivalent for comparison (rough estimate)
const normalizePriceToYearly = (value: number, frequency: 'year' | 'month' | 'week' | 'unknown'): number => {
    switch (frequency) {
        case 'year': return value;
        case 'month': return value * 12;
        case 'week': return value * 52;
        default: return value; // Assume yearly if unknown
    }
};


export default function ListingsPage() {
   const [ads, setAds] = useState<Advertisement[]>([]);
   const [isLoadingAds, setIsLoadingAds] = useState(true);
   const [displayedListings, setDisplayedListings] = useState<Listing[]>(allListings); // Start with all listings
   const [isLoadingListings, setIsLoadingListings] = useState(false); // Add loading state for listings


    useEffect(() => {
        // Fetch Ads
        setIsLoadingAds(true);
        fetchListingsPageAds()
            .then(data => setAds(data))
            .catch(err => console.error("Failed to load listings page ads:", err))
            .finally(() => setIsLoadingAds(false));
    }, []);


    // Function to handle filter application
    const applyFilters = (filters: FilterValues) => {
        console.log("Filtering with:", filters);
        setIsLoadingListings(true); // Start loading indicator

        // Simulate filtering delay
        setTimeout(() => {
            let filtered = allListings;

            // Location Filter (case-insensitive partial match)
            if (filters.location) {
                filtered = filtered.filter(listing =>
                    listing.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }

            // Property Type Filter
            if (filters.propertyType) {
                filtered = filtered.filter(listing => listing.propertyType === filters.propertyType);
            }

            // Bedrooms Filter
            if (filters.bedrooms) {
                const numBedrooms = parseInt(filters.bedrooms, 10);
                if (filters.bedrooms.includes('+')) {
                     filtered = filtered.filter(listing => listing.bedrooms >= numBedrooms);
                } else if (!isNaN(numBedrooms)) {
                    filtered = filtered.filter(listing => listing.bedrooms === numBedrooms);
                }
            }

            // Price Filter
            if (filters.minPrice !== null || filters.maxPrice !== null) {
                filtered = filtered.filter(listing => {
                    const { value, frequency } = parsePrice(listing.price);
                    const normalizedPrice = normalizePriceToYearly(value, frequency); // Normalize to yearly for comparison

                    const minMatch = filters.minPrice === null || normalizedPrice >= filters.minPrice;
                    const maxMatch = filters.maxPrice === null || normalizedPrice <= filters.maxPrice;
                    return minMatch && maxMatch;
                });
            }

             // Amenities Filter (must contain ALL selected amenities)
             if (filters.amenities.length > 0) {
                 filtered = filtered.filter(listing =>
                     filters.amenities.every(selectedAmenity =>
                         listing.amenities.includes(selectedAmenity)
                     )
                 );
             }

            console.log("Filtered Results:", filtered.length);
            setDisplayedListings(filtered);
            setIsLoadingListings(false); // Stop loading indicator
        }, 500); // Simulate network/computation delay
    };

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
                            width={1200}
                            height={150}
                            className="w-full h-auto object-contain rounded"
                            unoptimized
                        />
                    </Link>
                </div>
            ) : (
                 <div className="h-24 bg-muted rounded-lg flex items-center justify-center"></div>
            )}
       </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <FilterSidebar onApplyFilters={applyFilters} />

        {/* Listings Grid */}
        <div className="flex-1">
           {isLoadingListings ? (
              <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
           ) : displayedListings.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-lg">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                  <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
                  <p className="text-muted-foreground">Try adjusting your filters.</p>
              </div>
           ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedListings.map((listing) => (
                  <Card key={listing.id} className="overflow-hidden flex flex-col shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0 relative">
                       <Image
                          src={listing.imageUrl}
                          alt={listing.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                          unoptimized
                        />
                        {listing.verified && (
                          <Badge variant="secondary" className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-300 text-xs px-1.5 py-0.5">
                            <CheckCircle className="w-3 h-3 mr-1"/> Verified Landlord
                          </Badge>
                        )}
                         {!listing.verified && (
                          <Badge variant="destructive" className="absolute top-2 right-2 text-xs px-1.5 py-0.5">
                            Verification Pending
                          </Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-4 flex-grow">
                      <CardTitle className="text-lg mb-1 line-clamp-2">{listing.title}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                        <MapPin className="w-4 h-4" /> {listing.location}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm mb-3">
                         <span className="flex items-center gap-1">
                           <BedDouble className="w-4 h-4 text-primary" /> {listing.bedrooms} Bed{listing.bedrooms !== 1 ? 's' : ''}
                         </span>
                         <span className="flex items-center gap-1">
                           <Bath className="w-4 h-4 text-primary" /> {listing.bathrooms} Bath{listing.bathrooms !== 1 ? 's' : ''}
                         </span>
                      </div>
                       <div className="text-lg font-semibold text-primary flex items-center gap-1 mb-3">
                          <Wallet className="w-5 h-5"/> {listing.price}
                       </div>
                       <div className="flex flex-wrap gap-1">
                          {listing.amenities.slice(0, 3).map(amenity => ( // Show first 3 amenities
                              <Badge key={amenity} variant="outline" className="text-xs">{amenity}</Badge>
                          ))}
                           {listing.amenities.length > 3 && (
                               <Badge variant="outline" className="text-xs">+{listing.amenities.length - 3} more</Badge>
                           )}
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
           )}
        </div>

      </div>
    </div>
  );
}

