import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BedDouble, Bath, MapPin, Wallet, CheckCircle, MessageSquare, User, Phone, CalendarDays } from 'lucide-react';
import Image from "next/image";

// Mock function to get listing data by ID - Replace with actual data fetching
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
        imageUrl: "https://picsum.photos/800/600?random=10",
        verified: true,
        amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
        landlord: { name: "Mr. Adekunle Gold", verified: true, phone: "+2348012345678" },
      },
      {
        id: 2,
        title: "Cozy 2 Bedroom Flat",
        location: "Yaba, Lagos",
        price: "₦1,800,000/year",
        bedrooms: 2,
        bathrooms: 2,
         description: "A lovely and affordable 2-bedroom flat perfect for young professionals or small families. Located in the heart of Yaba with easy access to transportation. Prepaid electricity meter installed.",
        imageUrl: "https://picsum.photos/800/600?random=11",
        verified: true,
        amenities: ["Water Supply", "Prepaid Meter", "Tiled Floors"],
         landlord: { name: "Mrs. Funke Akindele", verified: true, phone: "+2348098765432" },
      },
        {
        id: 3,
        title: "Modern Studio Apartment",
        location: "Ikeja GRA, Lagos",
        price: "₦1,200,000/year",
        bedrooms: 1,
        bathrooms: 1,
         description: "Compact and modern studio apartment in the secure and quiet Ikeja GRA. Ideal for singles. Comes furnished with basic amenities and has a backup generator.",
        imageUrl: "https://picsum.photos/800/600?random=12",
        verified: false, // Example of unverified landlord
        amenities: ["Furnished", "Generator", "Air Conditioning"],
         landlord: { name: "Mr. Bovi Ugboma", verified: false, phone: "+2347011223344" }, // Phone might be hidden until verified
      },
       {
        id: 4,
        title: "Family Duplex with Garden",
        location: "Magodo Phase 2, Lagos",
        price: "₦5,000,000/year",
        bedrooms: 4,
        bathrooms: 5,
        description: "Large family-sized duplex in a gated estate in Magodo Phase 2. Features a private garden, ample parking, water heater in all bathrooms, and good security.",
        imageUrl: "https://picsum.photos/800/600?random=13",
        verified: true,
        amenities: ["Parking Space", "Water Heater", "Security", "Garden", "Gated Estate"],
         landlord: { name: "Alhaji Dangote Properties", verified: true, phone: "+2348100000001" },
      },
    ];
  const listing = listings.find(l => l.id.toString() === id);

  if (!listing) {
    // Handle not found case - maybe redirect or show a 404 component
    return null;
  }
  return listing;
}


export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await getListingData(params.id);

  if (!listing) {
    return <div className="container mx-auto py-12 text-center">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
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
                {listing.landlord.verified && ( // Only show phone if verified (optional logic)
                 <div className="flex items-center gap-3">
                     <Phone className="w-5 h-5 text-muted-foreground"/>
                     {/* TODO: Implement mechanism to reveal phone number on click/request if needed for privacy */}
                     <span className="text-muted-foreground">{listing.landlord.phone}</span>
                 </div>
                )}

                 <Separator/>

                 {/* TODO: Implement actual messaging system */}
                <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <MessageSquare className="w-4 h-4 mr-2"/> Send Message to Landlord
                </Button>
                <Button variant="outline" className="w-full">
                   <CalendarDays className="w-4 h-4 mr-2"/> Request Property Inspection
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
