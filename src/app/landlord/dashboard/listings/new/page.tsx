'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'; // Added SubmitHandler
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
    const [imageCleanupNeeded, setImageCleanupNeeded] = useState(false); // Flag for cleanup

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
        setImageCleanupNeeded(true); // Indicate that cleanup might be needed
        form.trigger("images"); // Manually trigger validation for the images field

         // Clear the input value to allow selecting the same file again if removed
         event.target.value = '';
    };

    const removeImage = (index: number) => {
         if (!isVerified) return; // Prevent action if not verified
        URL.revokeObjectURL(imagePreviews[index]); // Clean up blob URL immediately
        remove(index); // Remove from form array
        setImagePreviews(prev => prev.filter((_, i) => i !== index)); // Remove from previews
        form.trigger("images");
    };

    // Cleanup object URLs on component unmount
    useEffect(() => {
        // Only run cleanup if previews were generated
        if (imageCleanupNeeded) {
            return () => {
                console.log("Cleaning up image previews...");
                imagePreviews.forEach(url => URL.revokeObjectURL(url));
            };
        }
    }, [imagePreviews, imageCleanupNeeded]); // Depend on the previews array and the flag

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
            // Clear previews *before* resetting the form and navigating
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            setImagePreviews([]);
            setImageCleanupNeeded(false); // Reset cleanup flag
            form.reset();
            router.push(`/listings/${result.listingId}`);
            // Or: router.push('/landlord/dashboard/listings');
        } else {
            toast({
                variant: "destructive",
                title: "Failed to Create Listing",
                description: result.error || "An unexpected error occurred.",
            });
            setIsLoading(false); // Ensure loading is stopped on failure
        }
        // Don't set isLoading to false here if successful, redirect handles it
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
