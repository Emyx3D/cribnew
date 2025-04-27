import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Bath, MapPin, Wallet, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from "next/link";
import { FilterSidebar } from './_components/FilterSidebar';

// Mock data for listings - replace with actual data fetching
const listings = [
  {
    id: 1,
    title: "Spacious 3 Bedroom Apartment",
    location: "Lekki Phase 1, Lagos",
    price: "₦3,500,000/year",
    bedrooms: 3,
    bathrooms: 4,
    imageUrl: "https://picsum.photos/400/300?random=10",
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
    imageUrl: "https://picsum.photos/400/300?random=11",
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
    imageUrl: "https://picsum.photos/400/300?random=12",
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
    imageUrl: "https://picsum.photos/400/300?random=13",
    verified: true,
    amenities: ["Parking Space", "Water Heater", "Security"],
  },
];

export default function ListingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Properties</h1>
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
