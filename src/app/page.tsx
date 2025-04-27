import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, UserCheck, Search } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
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
            src="https://picsum.photos/600/400?random=1" // Placeholder image
            alt="Happy family in front of a house"
            width={600}
            height={400}
            className="rounded-lg shadow-xl object-cover"
            priority // Load image sooner
           />
        </div>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Next Home?</h2>
          <p className="text-lg mb-8">Join CribDirect today and experience a simpler way to rent.</p>
          <Button size="lg" variant="secondary" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/register">Get Started Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
