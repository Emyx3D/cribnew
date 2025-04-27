'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image'; // For previewing images

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, UploadCloud, Trash2, Info, BedDouble, Bath, MapPin, Wallet, ShieldAlert } from 'lucide-react'; // Added ShieldAlert
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Added Alert

// --- Constants ---
const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ALL_AMENITIES = [
    "Water Supply", "Electricity", "Security", "Parking Space",
    "Furnished", "Air Conditioning", "Tiled Floors", "Prepaid Meter",
    "Generator", "Water Heater", "Gated Estate", "Garden", "Balcony", "Swimming Pool"
]; // Example amenities list

// --- Zod Schema Definition ---
const listingFormSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters.'),
    location: z.string().min(5, 'Location must be at least 5 characters.'),
    propertyType: z.string().min(1, 'Please select a property type.'),
    bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'), // coerce converts string from Select to number
    bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom.'),
    price: z.string().min(1, 'Price is required.').regex(/^\d+$/, "Price must be a number."), // Validate as numeric string
    priceFrequency: z.enum(['year', 'month']), // Add frequency
    description: z.string().min(20, 'Description must be at least 20 characters.').max(1000, 'Description too long.'),
    amenities: z.array(z.string()).optional(), // Array of selected amenity strings
    images: z.array(z.instanceof(File))
        .min(1, 'At least one image is required.')
        .max(MAX_IMAGES, `You can upload a maximum of ${MAX_IMAGES} images.`)
        .refine(files => files.every(file => file.size <= MAX_FILE_SIZE), `Each file size should be less than ${MAX_FILE_SIZE / 1024 / 1024}MB.`)
        .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), `Only .jpg, .jpeg, .png and .webp formats are supported.`)
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

// --- Mock API Function ---
// TODO: Replace with actual API call to create listing
async function createListing(data: ListingFormValues, imageFiles: File[]): Promise<{ success: boolean; error?: string; listingId?: string }> {
    console.log("Creating listing with data:", data);
    console.log("Image files:", imageFiles);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Here you would typically use FormData to send data and files
    /*
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('location', data.location);
    formData.append('propertyType', data.propertyType);
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('price', data.price);
    formData.append('priceFrequency', data.priceFrequency);
    formData.append('description', data.description);
    data.amenities?.forEach(amenity => formData.append('amenities[]', amenity));
    imageFiles.forEach((file, index) => formData.append(`images[${index}]`, file));

    // const response = await fetch('/api/listings', { method: 'POST', body: formData });
    // const result = await response.json();
    // return result;
    */

    // Simulate success
    return { success: true, listingId: `prop_${Math.random().toString(16).slice(2)}` };
}
// --- End Mock API Function ---


export default function NewListingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isVerified, setIsVerified] = useState<boolean | null>(null); // Add state for verification check

    // Check landlord verification status
    useEffect(() => {
        try {
            const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const role = sessionStorage.getItem('userRole');
            // Assume status is stored, defaulting to false if not found but logged in as landlord
            const verificationStatus = sessionStorage.getItem('landlordVerificationStatus') === 'verified';

            if (!loggedIn || role !== 'landlord') {
                router.push('/login'); // Redirect if not logged in as landlord
                return;
            }

            setIsVerified(verificationStatus);

            if (!verificationStatus) {
                 toast({
                    variant: 'destructive',
                    title: "Verification Required",
                    description: "You need to be verified to create a new listing.",
                    duration: 5000,
                 });
                 // Optionally redirect back to dashboard after a delay or immediately
                 // router.push('/landlord/dashboard');
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            router.push('/login'); // Redirect on error
        }
    }, [router, toast]);


    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            title: '',
            location: '',
            propertyType: '',
            bedrooms: 1,
            bathrooms: 1,
            price: '',
            priceFrequency: 'year',
            description: '',
            amenities: [],
            images: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "images",
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         if (!isVerified) return; // Prevent action if not verified
        const files = Array.from(event.target.files || []);
        const currentImageCount = fields.length;
        const availableSlots = MAX_IMAGES - currentImageCount;
        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            toast({
                variant: 'destructive',
                title: "Limit Exceeded",
                description: `You can only add ${availableSlots} more image(s). Maximum is ${MAX_IMAGES}.`,
            });
        }

        // Validate and append files
        const validatedFiles: File[] = [];
        const newPreviews: string[] = [];
        filesToAdd.forEach(file => {
            if (file.size > MAX_FILE_SIZE) {
                 toast({ variant: 'destructive', title: "File Too Large", description: `${file.name} exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.` });
                 return;
            }
             if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                  toast({ variant: 'destructive', title: "Invalid File Type", description: `${file.name} is not a supported image type.` });
                  return;
             }
             validatedFiles.push(file);
             newPreviews.push(URL.createObjectURL(file));
        });

        append(validatedFiles); // Append validated files to the form array
        setImagePreviews(prev => [...prev, ...newPreviews]); // Update previews
        form.trigger("images"); // Manually trigger validation for the images field

         // Clear the input value to allow selecting the same file again if removed
         event.target.value = '';
    };

    const removeImage = (index: number) => {
         if (!isVerified) return; // Prevent action if not verified
        URL.revokeObjectURL(imagePreviews[index]); // Clean up blob URL
        remove(index); // Remove from form array
        setImagePreviews(prev => prev.filter((_, i) => i !== index)); // Remove from previews
        form.trigger("images");
    };

    const onSubmit: SubmitHandler<ListingFormValues> = async (data) => {
        if (!isVerified) {
             toast({ variant: 'destructive', title: "Verification Required", description: "Cannot submit listing." });
             return;
        }
        setIsLoading(true);
        const imageFiles = form.getValues("images"); // Get the File objects

        // Call API function
        const result = await createListing(data, imageFiles);

        if (result.success && result.listingId) {
            toast({
                title: "Listing Created!",
                description: "Your property has been listed successfully.",
            });
            // Redirect to the new listing's page or landlord's listing management page
            router.push(`/listings/${result.listingId}`);
            // Or: router.push('/landlord/dashboard/listings');
            form.reset();
            setImagePreviews([]);
        } else {
            toast({
                variant: "destructive",
                title: "Failed to Create Listing",
                description: result.error || "An unexpected error occurred.",
            });
        }
        setIsLoading(false);
    };

     // Show loading or verification needed message before rendering form
    if (isVerified === null) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!isVerified) {
        return (
             <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
                <Alert variant="destructive" className="max-w-lg">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Account Not Verified</AlertTitle>
                  <AlertDescription>
                    Your landlord account needs to be verified by the admin team before you can create property listings. Please ensure you have submitted the required documents during registration. You will be notified once your account is approved.
                  </AlertDescription>
                   <Button variant="outline" size="sm" className="mt-4" onClick={() => router.push('/landlord/dashboard')}>
                        Go to Dashboard
                   </Button>
                </Alert>
             </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Create New Property Listing</CardTitle>
                    <CardDescription>Fill in the details below to list your property on CribDirect.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            {/* --- Basic Information --- */}
                            <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="text-lg font-semibold mb-2">Basic Information</h3>
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Modern 3 Bedroom Flat in Lekki" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-1"><MapPin className="w-4 h-4" />Location</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Lekki Phase 1, Lagos" {...field} disabled={isLoading} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <FormField
                                        control={form.control}
                                        name="propertyType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Property Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="apartment">Apartment / Flat</SelectItem>
                                                    <SelectItem value="duplex">Duplex</SelectItem>
                                                    <SelectItem value="studio">Studio Apartment</SelectItem>
                                                    <SelectItem value="bungalow">Bungalow</SelectItem>
                                                    <SelectItem value="terrace">Terrace House</SelectItem>
                                                     <SelectItem value="penthouse">Penthouse</SelectItem>
                                                    <SelectItem value="self-contain">Self-Contain</SelectItem>
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="bedrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1"><BedDouble className="w-4 h-4" />Bedrooms</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select number" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {[1, 2, 3, 4, 5, 6].map(num => <SelectItem key={num} value={String(num)}>{num}</SelectItem>)}
                                                    <SelectItem value="7">7+</SelectItem>
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                      <FormField
                                        control={form.control}
                                        name="bathrooms"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1"><Bath className="w-4 h-4" />Bathrooms</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)} disabled={isLoading}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select number" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                     {[1, 2, 3, 4, 5, 6].map(num => <SelectItem key={num} value={String(num)}>{num}</SelectItem>)}
                                                    <SelectItem value="7">7+</SelectItem>
                                                </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="flex items-center gap-1"><Wallet className="w-4 h-4" />Rental Price (₦)</FormLabel>
                                                <div className="flex gap-2">
                                                <FormControl>
                                                    <Input type="number" placeholder="e.g., 3500000" {...field} disabled={isLoading} />
                                                </FormControl>
                                                 <FormField
                                                    control={form.control}
                                                    name="priceFrequency"
                                                    render={({ field: freqField }) => (
                                                        <Select onValueChange={freqField.onChange} defaultValue={freqField.value} disabled={isLoading}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-[120px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="year">Per Year</SelectItem>
                                                                <SelectItem value="month">Per Month</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                     )}
                                                    />
                                                 </div>
                                                 <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                  <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Property Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Provide a detailed description of the property, its features, and nearby landmarks..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* --- Amenities --- */}
                             <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                                <FormField
                                    control={form.control}
                                    name="amenities"
                                    render={() => (
                                        <FormItem className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {ALL_AMENITIES.map((amenity) => (
                                            <FormField
                                            key={amenity}
                                            control={form.control}
                                            name="amenities"
                                            render={({ field }) => {
                                                return (
                                                <FormItem
                                                    key={amenity}
                                                    className="flex flex-row items-start space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(amenity)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), amenity])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                (value) => value !== amenity
                                                                )
                                                            )
                                                        }}
                                                         disabled={isLoading}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                    {amenity}
                                                    </FormLabel>
                                                </FormItem>
                                                )
                                            }}
                                            />
                                        ))}
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                             </div>


                            {/* --- Image Upload --- */}
                             <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="text-lg font-semibold mb-1">Property Images</h3>
                                 <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                    <Info className="w-4 h-4"/> Upload up to {MAX_IMAGES} high-quality images (Max {MAX_FILE_SIZE / 1024 / 1024}MB each). First image will be the main cover.
                                </p>
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => ( // Don't need field render prop here as we handle input separately
                                        <FormItem>
                                            <FormControl>
                                                 <div className="relative">
                                                    <Input
                                                        id="imageUpload"
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // Hidden input
                                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                                        multiple // Allow multiple file selection
                                                        onChange={handleFileChange}
                                                         disabled={isLoading || fields.length >= MAX_IMAGES} // Disable if max reached
                                                    />
                                                    <label
                                                        htmlFor="imageUpload" // Link label to hidden input
                                                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-muted relative ${form.formState.errors.images ? 'border-destructive' : 'border-input'} ${isLoading || fields.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">
                                                            {fields.length >= MAX_IMAGES ? `Maximum ${MAX_IMAGES} images reached` : `Click or drag images here (${fields.length}/${MAX_IMAGES})`}
                                                        </p>
                                                    </label>
                                                  </div>
                                            </FormControl>
                                            <FormMessage /> {/* Show errors related to the array itself (min/max length) */}
                                        </FormItem>
                                    )}
                                />

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {imagePreviews.map((src, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <Image
                                                    src={src}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                    className="object-cover rounded-md border"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeImage(index)}
                                                     disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                     <span className="sr-only">Remove image {index + 1}</span>
                                                </Button>
                                                 {index === 0 && (
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 rounded-b-md">
                                                        Cover Image
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* --- Submission Button --- */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90" disabled={isLoading || !isVerified}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {isLoading ? "Creating Listing..." : "Create Listing"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

// Cleanup object URLs on component unmount
NewListingPage.getInitialProps = async () => {
  // This is a placeholder. If you use server-side fetching, adapt accordingly.
  return {};
};

// @ts-ignore - Adding cleanup effect (consider a custom hook for reuse)
NewListingPage.useEffectCleanup = () => {
    // This function needs to be called within a React component's useEffect cleanup phase.
    // Currently, this structure won't directly work as placed here.
    // You'd typically manage previews state within the component and run cleanup there.
    // Example within the component:
    // useEffect(() => {
    //   return () => {
    //     imagePreviews.forEach(URL.revokeObjectURL);
    //   };
    // }, [imagePreviews]);
    console.warn("Image preview cleanup should be handled within the component's useEffect hook.");
};

```></content>
  </change>
  <change>
    <file>src/app/login/page.tsx</file>
    <description>Store landlord verification status in session storage on successful login.</description>
    <content><![CDATA['use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, { // Password can't be empty for login
    message: 'Password is required.',
  }),
});

// Define User Roles
type UserRole = 'admin' | 'landlord' | 'tenant' | null;
type VerificationStatus = 'verified' | 'pending' | 'rejected' | null; // Added verification status

// Hardcoded credentials for simulation
const adminCredentials = { email: 'Admin@cribdirect.com', password: 'Pass=1010', role: 'admin' as UserRole };
// Simulate landlord verification status
const landlordCredentials = { email: 'landlord@test.com', password: 'Pass=1010', role: 'landlord' as UserRole, status: 'verified' as VerificationStatus };
const tenantCredentials = { email: 'user@test.com', password: 'Pass=1010', role: 'tenant' as UserRole };


export default function LoginPage() {
   const { toast } = useToast();
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   // Clear session storage on component mount to ensure fresh login state
   useEffect(() => {
     try {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('landlordVerificationStatus'); // Clear verification status too
     } catch (error) {
        console.error("Error clearing sessionStorage:", error);
        // Non-critical error, maybe log it
     }
   }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log('Attempting login with:', values);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let loginSuccess = false;
    let userRole: UserRole = null;
    let landlordStatus: VerificationStatus = null; // Add variable for landlord status
    let redirectPath = '/';

    // Check against hardcoded credentials
    if (values.email === adminCredentials.email && values.password === adminCredentials.password) {
        loginSuccess = true;
        userRole = adminCredentials.role;
        redirectPath = '/admin/dashboard';
        console.log("Admin login simulated");
    } else if (values.email === landlordCredentials.email && values.password === landlordCredentials.password) {
      loginSuccess = true;
      userRole = landlordCredentials.role;
      landlordStatus = landlordCredentials.status; // Get landlord status
      redirectPath = '/landlord/dashboard'; // Redirect landlord to their dashboard
      console.log("Landlord login simulated with status:", landlordStatus);
    } else if (values.email === tenantCredentials.email && values.password === tenantCredentials.password) {
      loginSuccess = true;
      userRole = tenantCredentials.role;
      redirectPath = '/listings'; // Redirect tenant to listings page
      console.log("Tenant login simulated");
    }

    if (loginSuccess && userRole) {
      // Simulate successful login by setting session storage
      try {
         sessionStorage.setItem('isLoggedIn', 'true');
         sessionStorage.setItem('userRole', userRole);
         // Store verification status only if the user is a landlord
         if (userRole === 'landlord' && landlordStatus) {
             sessionStorage.setItem('landlordVerificationStatus', landlordStatus);
             console.log("Stored landlord verification status:", landlordStatus);
         } else {
            // Clear any previous landlord status if logging in as a different role
            sessionStorage.removeItem('landlordVerificationStatus');
         }
      } catch (error) {
         console.error("Failed to set sessionStorage:", error);
         toast({
            variant: 'destructive',
            title: "Login Error",
            description: "Could not save login session. Please check browser settings.",
         });
         setIsLoading(false);
         return;
      }

      toast({
        title: "Login Successful!",
        description: `Welcome back ${userRole}. Redirecting...`,
      });
      form.reset();

      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh(); // Force refresh to update header state based on session storage
      }, 1000);
       // Keep loading indicator until redirect starts
    } else {
      // Simulate failed login
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: "Invalid email or password.",
      });
      setIsLoading(false); // Stop loading indicator on failure
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to your CribDirect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                     <div className="text-right">
                       <Link href="/forgot-password" // TODO: Create this page later
                             className={cn(
                               "text-sm font-medium text-primary hover:underline",
                               isLoading && "pointer-events-none opacity-50" // Disable link while loading
                              )}>
                         Forgot password?
                       </Link>
                     </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
             Don't have an account?{' '}
             <Link href="/register" className={cn(
                "font-medium text-primary hover:underline",
                isLoading && "pointer-events-none opacity-50" // Disable link while loading
                )}>
               Sign up here
             </Link>
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
```></content>
  </change>
  <change>
    <file>src/components/ui/alert.tsx</file>
    <description>Update Alert component to use updated shadcn/ui conventions.</description>
    <content><![CDATA[import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```