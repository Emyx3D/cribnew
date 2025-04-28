
'use client'; // Make this a client component to fetch ads and properties

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, MapPin, Wallet, MessageSquare, Loader2, CheckCircle, Search, XCircle, SlidersHorizontal } from 'lucide-react'; // Added SlidersHorizontal
import Image from 'next/image';
import Link from "next/link";
import { FilterSidebar, FilterValues } from './_components/FilterSidebar'; // Import FilterValues type
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils"; // Import cn for conditional styling
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet for mobile filters

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
    landlordId: string; // Added landlordId to link listings
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
    landlordId: "landlord_adekunle",
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
    landlordId: "landlord_funke",
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
    landlordId: "landlord_bovi",
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
    landlordId: "landlord_dangote",
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
    landlordId: "landlord_dangote", // Example reuse of landlord
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
    landlordId: "landlord_funke", // Example reuse of landlord
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
    landlordId: "landlord_adekunle", // Example reuse
  },
   {
    id: 'landlord_prop1', // Existing landlord prop
    title: "My Spacious 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦3,500,000/year",
    bedrooms: 3,
    bathrooms: 4,
    imageUrl: "https://picsum.photos/seed/my_house1_exterior/400/300", // Updated image
    verified: true,
    amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
    propertyType: "apartment",
    landlordId: "landlord_test", // Specific test landlord
    },
     {
        id: 'landlord_prop2', // Existing landlord prop
        title: "My Cozy 2 Bedroom Flat",
        location: "Yaba, Lagos",
        price: "₦1,800,000/year",
        bedrooms: 2,
        bathrooms: 2,
        imageUrl: "https://picsum.photos/seed/my_house2_kitchen/400/300", // Updated image
         verified: true,
         amenities: ["Water Supply", "Prepaid Meter"],
         propertyType: "apartment",
         landlordId: "landlord_test", // Specific test landlord
    },
     // Add listings from FlaggedListingsTable for linking
    {
        id: 'prop123',
        title: 'Luxury Penthouse with Pool',
        location: "Banana Island, Lagos",
        price: "₦25,000,000/year",
        bedrooms: 4,
        bathrooms: 5,
        imageUrl: 'https://picsum.photos/seed/prop123_pool/400/300',
        verified: true, // Landlord might be verified even if listing is flagged
        amenities: ['Swimming Pool', 'Security', 'Parking Space', 'Gym'],
        propertyType: "penthouse",
        landlordId: "landlord_bigshot", // Specific landlord
    },
    {
        id: 'prop456',
        title: 'Cozy Studio Near Market',
        location: "Oshodi, Lagos",
        price: "₦500,000/year",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: 'https://picsum.photos/seed/prop456_studio/400/300',
        verified: true,
        amenities: ['Water Supply', 'Tiled Floors'],
        propertyType: "studio",
        landlordId: "landlord_reasonable", // Specific landlord
    },
    {
        id: 'prop789',
        title: 'Beachfront Villa (URGENT RENT)',
        location: "Eleko Beach, Lagos",
        price: "₦8,000,000/year",
        bedrooms: 5,
        bathrooms: 6,
        imageUrl: 'https://picsum.photos/seed/prop789_beach/400/300',
        verified: false, // Assume landlord verification might be pending or failed
        amenities: ['Beach Access', 'Balcony', 'Parking Space'],
        propertyType: "duplex", // Assuming Villa maps to Duplex
        landlordId: "landlord_scamface", // Specific landlord
    },
      // Add 5 more diverse listings
    {
        id: 8,
        title: "Newly Built Terrace House",
        location: "Ajah, Lagos",
        price: "₦2,800,000/year",
        bedrooms: 3,
        bathrooms: 3,
        imageUrl: "https://picsum.photos/seed/house8_terrace/400/300",
        verified: true,
        amenities: ["Gated Estate", "Security", "Water Supply", "Prepaid Meter"],
        propertyType: "terrace",
        landlordId: "landlord_adekunle",
    },
    {
        id: 9,
        title: "Furnished Short Let - Lekki",
        location: "Lekki Phase 1, Lagos",
        price: "₦50,000/week",
        bedrooms: 2,
        bathrooms: 2,
        imageUrl: "https://picsum.photos/seed/house9_shortlet/400/300",
        verified: true,
        amenities: ["Furnished", "Air Conditioning", "Wifi", "Generator", "Security"],
        propertyType: "airbnb",
        landlordId: "landlord_test",
    },
    {
        id: 10,
        title: "Detached Bungalow with BQ",
        location: "Festac Town, Lagos",
        price: "₦2,200,000/year",
        bedrooms: 3,
        bathrooms: 3,
        imageUrl: "https://picsum.photos/seed/house10_bungalow/400/300",
        verified: true,
        amenities: ["Garden", "Parking Space", "Water Supply"],
        propertyType: "bungalow",
        landlordId: "landlord_funke",
    },
    {
        id: 11,
        title: "Student Hostel Room (Self-Contained)",
        location: "Akoka, Yaba, Lagos",
        price: "₦350,000/year",
        bedrooms: 1,
        bathrooms: 1,
        imageUrl: "https://picsum.photos/seed/house11_hostel/400/300",
        verified: false, // Unverified example
        amenities: ["Water Supply", "Prepaid Meter"],
        propertyType: "self-contain",
        landlordId: "landlord_bovi",
    },
    {
        id: 12,
        title: "Executive 5-Bedroom Duplex",
        location: "Asokoro, Abuja", // Example outside Lagos
        price: "₦12,000,000/year",
        bedrooms: 5,
        bathrooms: 6,
        imageUrl: "https://picsum.photos/seed/house12_abuja/400/300",
        verified: true,
        amenities: ["Gated Estate", "Security", "Swimming Pool", "Gym", "Generator", "Parking Space"],
        propertyType: "duplex",
        landlordId: "landlord_dangote",
    }
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
   const [filtersApplied, setFiltersApplied] = useState(false); // Track if filters are active
   const [activeFilters, setActiveFilters] = useState<FilterValues | null>(null); // Store active filters
   const [resetFilterKey, setResetFilterKey] = useState(0); // State to trigger filter reset
   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);


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
        setActiveFilters(filters); // Store the applied filters
        setMobileFiltersOpen(false); // Close mobile filter sheet after applying

        // Determine if any filter is actually set
        const isAnyFilterSet =
            filters.location ||
            (filters.propertyType && filters.propertyType !== 'all') || // Check specifically against 'all'
            (filters.bedrooms && filters.bedrooms !== 'all') ||       // Check specifically against 'all'
            filters.minPrice !== null ||
            filters.maxPrice !== null ||
            filters.amenities.length > 0;

        setFiltersApplied(isAnyFilterSet); // Update filter applied state

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
            if (filters.propertyType && filters.propertyType !== 'all') { // Check if not 'all'
                filtered = filtered.filter(listing => listing.propertyType === filters.propertyType);
            }

            // Bedrooms Filter
            if (filters.bedrooms && filters.bedrooms !== 'all') { // Check if not 'all'
                const numBedrooms = parseInt(filters.bedrooms.replace('+', ''), 10); // Handle '6+'
                if (!isNaN(numBedrooms)) {
                    if (filters.bedrooms.includes('+')) {
                        filtered = filtered.filter(listing => listing.bedrooms >= numBedrooms);
                    } else {
                        filtered = filtered.filter(listing => listing.bedrooms === numBedrooms);
                    }
                }
            }

            // Price Filter
            if (filters.minPrice !== null || filters.maxPrice !== null) {
                filtered = filtered.filter(listing => {
                    const { value, frequency } = parsePrice(listing.price);
                    const normalizedPrice = normalizePriceToYearly(value, frequency); // Normalize to yearly for comparison

                    const minMatch = filters.minPrice === null || isNaN(filters.minPrice) || normalizedPrice >= filters.minPrice;
                    const maxMatch = filters.maxPrice === null || isNaN(filters.maxPrice) || normalizedPrice <= filters.maxPrice;
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

    // Function to clear filters
    const clearFilters = () => {
        setDisplayedListings(allListings); // Reset to all listings
        setFiltersApplied(false); // Set filters applied state to false
        setActiveFilters(null); // Clear stored active filters
        setResetFilterKey(prev => prev + 1); // Increment key to trigger reset in FilterSidebar
        setMobileFiltersOpen(false); // Close mobile filter sheet if open
        console.log("Filters Cleared");
    }

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

      {/* Main content area with sidebar and listings */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Hidden on small screens, shown as button */}
         <div className="hidden lg:block">
           <FilterSidebar onApplyFilters={applyFilters} resetKey={resetFilterKey} />
         </div>

         {/* Mobile Filter Button & Sheet */}
         <div className="lg:hidden mb-4">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-xs p-0"> {/* Adjusted padding */}
                     {/* Pass the clearFilters function to the mobile sidebar */}
                    <FilterSidebar onApplyFilters={applyFilters} resetKey={resetFilterKey} />
                     {filtersApplied && (
                        <div className="p-4 border-t">
                             <Button variant="outline" className="w-full" onClick={clearFilters}>
                                Clear Filters
                             </Button>
                         </div>
                     )}
                </SheetContent>
            </Sheet>
         </div>


        {/* Listings Grid */}
        <div className="flex-1">
            {/* Clear Filters Button (shown only on larger screens when filters are applied) */}
            {filtersApplied && (
                 <div className="hidden lg:flex mb-4 justify-between items-center">
                    <span className="text-sm text-muted-foreground">Showing filtered results</span>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                         <XCircle className="mr-2 h-4 w-4" /> Clear Filters
                    </Button>
                 </div>
             )}

           {isLoadingListings ? (
              <div className="flex justify-center items-center py-20">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
           ) : displayedListings.length === 0 ? (
              <div className="text-center py-20 border border-dashed rounded-lg">
                  <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4"/>
                  <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or clear them to see all listings.</p>
                  {filtersApplied && (
                       <Button variant="outline" onClick={clearFilters} className="mt-2">
                           <XCircle className="mr-2 h-4 w-4" /> Clear Filters
                       </Button>
                   )}
              </div>
           ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
