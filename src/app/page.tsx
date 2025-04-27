
'use client'; // Make this a client component to fetch ads

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, UserCheck, Search, Loader2 } from 'lucide-react'; // Added Loader2
import Image from 'next/image';
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

// Mock function to fetch active ads for the landing page
// TODO: Replace with actual API call
async function fetchLandingPageAds(): Promise<Advertisement[]> {
    console.log("Fetching landing page ads...");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    try {
        const storedAds = localStorage.getItem('cribdirectAds');
        if (storedAds) {
            const allAds: Advertisement[] = JSON.parse(storedAds, (key, value) => {
                if (key === 'createdAt') return new Date(value);
                return value;
            });
            const activeLandingAds = allAds.filter(ad => ad.status === 'active' && ad.targetPages.includes('landing'));
            console.log("Loaded active landing page ads from localStorage");
            return activeLandingAds;
        }
    } catch (e) {
        console.error("Could not parse ads from localStorage for landing page", e);
    }
     console.log("Using mock landing page ad data (fallback)");
     // Fallback mock data
     return [
         { id: 'ad1', title: 'Summer Promo Banner', imageUrl: 'https://picsum.photos/seed/promo1/900/150', linkUrl: 'https://example.com/promo', targetPages: ['landing'], status: 'active', createdAt: new Date() }
     ];
}


export default function Home() {
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [isLoadingAds, setIsLoadingAds] = useState(true);

    useEffect(() => {
        setIsLoadingAds(true);
        fetchLandingPageAds()
            .then(data => setAds(data))
            .catch(err => console.error("Failed to load landing page ads:", err))
            .finally(() => setIsLoadingAds(false));
    }, []);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-16 md:py-24 lg:py-32">
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Rent Homes Directly. <br className="hidden md:block" />
            <span className="text-primary">No Agents, No Fees.</span>
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            CribDirect connects you directly with verified landlords. Find your perfect home without the hassle and extra costs of middlemen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/listings">Browse Listings</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/landlord/register">List Your Property</Link>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 flex justify-center">
           <Image
            src="https://picsum.photos/seed/hero_house/600/400" // Updated placeholder image
            alt="Happy family in front of a house"
            width={600}
            height={400}
            className="rounded-lg shadow-xl object-cover"
            priority // Load image sooner
            unoptimized // Added for picsum consistency
           />
        </div>
      </section>

      {/* Ad Banner Section */}
      <section className="container mx-auto px-4 py-8">
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
      </section>


      {/* Features Section */}
      <section className="bg-secondary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose CribDirect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                 <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                   <CheckCircle className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="mt-4">Direct Connection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Communicate directly with landlords. Ask questions, schedule viewings, and finalize details without intermediaries.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                   <UserCheck className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="mt-4">Verified Landlords</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every landlord is verified through property ownership documents, ensuring trust and safety on the platform.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit">
                   <Search className="h-10 w-10 text-primary" />
                 </div>
                <CardTitle className="mt-4">Simple Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Easily browse listings with powerful filters for location, price, amenities, and more. Find your ideal home quickly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
         <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
           How It Works
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-primary mb-2">1</div>
              <h3 className="text-xl font-semibold mb-2">Sign Up / Log In</h3>
              <p className="text-muted-foreground">Quickly register as a tenant or landlord.</p>
            </div>
             <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-primary mb-2">2</div>
              <h3 className="text-xl font-semibold mb-2">Landlords Verify</h3>
              <p className="text-muted-foreground">Landlords upload documents for verification.</p>
            </div>
             <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-primary mb-2">3</div>
              <h3 className="text-xl font-semibold mb-2">Browse or List</h3>
              <p className="text-muted-foreground">Tenants browse listings, landlords post properties.</p>
            </div>
             <div className="flex flex-col items-center text-center">
              <div className="text-4xl font-bold text-primary mb-2">4</div>
              <h3 className="text-xl font-semibold mb-2">Connect Directly</h3>
              <p className="text-muted-foreground">Tenants contact landlords via in-app messaging.</p>
            </div>
         </div>
      </section>

      {/* Call to Action Section */}
       <section className="bg-primary text-primary-foreground py-16 md:py-20">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-8">Join CribDirect today and experience a simpler way to rent or list your property.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Button size="lg" variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
               <Link href="/register">Sign Up as Tenant</Link>
             </Button>
             <Button size="lg" variant="secondary" asChild className="bg-white text-primary hover:bg-white/90">
                <Link href="/landlord/register">Register as Landlord</Link>
             </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
