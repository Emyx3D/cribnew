
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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
import { Loader2, UploadCloud, Trash2, Info, BedDouble, Bath, MapPin, Wallet, ShieldAlert, ArrowLeft, Video, Gamepad2 } from 'lucide-react'; // Added Gamepad2 for PS5
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { GoogleMapsProvider } from '@/components/common/GoogleMapsProvider'; // Import the provider
import { LocationAutocompleteInput } from '@/components/common/LocationAutocompleteInput'; // Import the autocomplete component

// --- Constants ---
const MIN_IMAGES = 3;
const MAX_IMAGES = 5;
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
const ALL_AMENITIES = [
    "Water Supply", "Electricity", "Security", "Parking Space",
    "Furnished", "Air Conditioning", "Tiled Floors", "Prepaid Meter",
    "Generator", "Water Heater", "Gated Estate", "Garden", "Balcony", "Swimming Pool",
    "Wifi", "PS5", // Added Wifi and PS5
];

const validateFile = (file: File | undefined | null, acceptedTypes: string[], maxSize: number, fieldName: string) => {
  if (!file) return `${fieldName} is required.`;
  if (file.size > maxSize) return `${fieldName} size should be less than ${maxSize / 1024 / 1024}MB.`;
  if (!acceptedTypes.includes(file.type)) return `Invalid file type for ${fieldName}. Only ${acceptedTypes.map(t => t.split('/')[1]).join(', ')} allowed.`;
  return true;
};


// --- Zod Schema Definition ---
const listingFormSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters.'),
    location: z.string().min(5, 'Location must be at least 5 characters.'), // Keep location as string
    propertyType: z.string().min(1, 'Please select a property type.'),
    bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
    bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom.'),
    price: z.string().min(1, 'Price is required.').regex(/^\d+$/, "Price must be a number."),
    priceFrequency: z.enum(['year', 'month', 'week', 'daily']), // Added 'daily'
    description: z.string().min(20, 'Description must be at least 20 characters.').max(1000, 'Description too long.'),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.instanceof(File))
        .min(MIN_IMAGES, `At least ${MIN_IMAGES} images are required.`)
        .max(MAX_IMAGES, `You can upload a maximum of ${MAX_IMAGES} images.`)
        .refine(files => files.every(file => file.size <= MAX_IMAGE_FILE_SIZE), `Each image size should be less than ${MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB.`)
        .refine(files => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), `Only .jpg, .jpeg, .png and .webp formats are supported for images.`),
    video: z.instanceof(File).optional()
          .refine(file => !file || validateFile(file, ACCEPTED_VIDEO_TYPES, MAX_VIDEO_FILE_SIZE, 'Video') === true, {
              message: (file) => validateFile(file, ACCEPTED_VIDEO_TYPES, MAX_VIDEO_FILE_SIZE, 'Video') as string,
          }),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

// --- Mock API Function ---
async function createListing(data: ListingFormValues, imageFiles: File[], videoFile?: File): Promise<{ success: boolean; error?: string; listingId?: string }> {
    console.log("Creating listing with data:", data);
    console.log("Image files:", imageFiles);
    console.log("Video file:", videoFile);
    await new Promise(resolve => setTimeout(resolve, 1500));
    // TODO: Implement actual API call with FormData
    return { success: true, listingId: `prop_${Math.random().toString(16).slice(2)}` };
}
// --- End Mock API Function ---

// Main component wrapped with the provider
export default function NewListingPageWrapper() {
    return (
        <GoogleMapsProvider>
            <NewListingPage />
        </GoogleMapsProvider>
    );
}


function NewListingPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [videoFileName, setVideoFileName] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [imageCleanupNeeded, setImageCleanupNeeded] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        try {
            const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            const role = sessionStorage.getItem('userRole');
            const verificationStatus = sessionStorage.getItem('landlordVerificationStatus') === 'verified';

            if (!loggedIn || role !== 'landlord') {
                router.push('/login');
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
            }
        } catch (error) {
            console.error("Error checking verification status:", error);
            setIsVerified(false); // Assume not verified if error
            router.push('/login');
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
            priceFrequency: 'year', // Default to year
            description: '',
            amenities: [],
            images: [],
            video: undefined,
        },
         mode: 'onBlur',
    });

    const videoFieldValue = form.watch("video");

    useEffect(() => {
        let currentPreview = videoPreview; // Capture current preview URL
        let url: string | null = null; // Define url here

        if (videoFieldValue instanceof File) {
            url = URL.createObjectURL(videoFieldValue);
            setVideoPreview(url);
            setVideoFileName(videoFieldValue.name);
        } else {
            setVideoPreview(null);
            setVideoFileName(null);
        }

        // Cleanup function
        return () => {
            // Always try to revoke the URL created in this effect instance if it exists
            if (url) {
                console.log("Cleaning up video preview URL on change/unmount:", url);
                URL.revokeObjectURL(url);
            }
            // Also, revoke the previously captured URL if the field was cleared
            else if (currentPreview && !(videoFieldValue instanceof File)) {
                console.log("Cleaning up video preview URL on change/unmount (field cleared):", currentPreview);
                URL.revokeObjectURL(currentPreview);
            }
        };
    }, [videoFieldValue]); // Keep dependency array lean


    const { fields: imageFields, append: appendImage, remove: removeImageField } = useFieldArray({
        control: form.control,
        name: "images",
    });

    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         if (!isVerified) return;
        const files = Array.from(event.target.files || []);
        const currentImageCount = imageFields.length;
        const availableSlots = MAX_IMAGES - currentImageCount;

        if (availableSlots <= 0) {
             toast({
                variant: 'destructive',
                title: "Image Limit Reached",
                description: `Maximum of ${MAX_IMAGES} images allowed.`,
            });
             event.target.value = ''; // Clear the input
            return;
        }

        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            toast({
                variant: 'destructive',
                title: "Image Limit Exceeded",
                description: `You can only add ${availableSlots} more image(s). ${files.length - filesToAdd.length} file(s) were not added.`,
            });
        }

        const validatedFiles: File[] = [];
        const newPreviews: string[] = [];
        filesToAdd.forEach(file => {
            if (validateFile(file, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE, 'Image') !== true) {
                toast({ variant: 'destructive', title: "Invalid Image", description: validateFile(file, ACCEPTED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE, 'Image') as string });
                return;
            }
             validatedFiles.push(file);
             newPreviews.push(URL.createObjectURL(file));
        });

        if (validatedFiles.length > 0) {
            appendImage(validatedFiles);
            setImagePreviews(prev => [...prev, ...newPreviews]);
            setImageCleanupNeeded(true);
            form.trigger("images"); // Trigger validation after appending
        }
        event.target.value = ''; // Clear the input after processing
    };

     const handleVideoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         if (!isVerified) return;
         const file = event.target.files?.[0];

         if (file) {
            const validationResult = validateFile(file, ACCEPTED_VIDEO_TYPES, MAX_VIDEO_FILE_SIZE, 'Video');
            if (validationResult === true) {
                 form.setValue('video', file, { shouldValidate: true });
             } else {
                 toast({ variant: 'destructive', title: "Invalid Video", description: validationResult });
                 form.setValue('video', undefined, { shouldValidate: true });
                 if (videoInputRef.current) {
                     videoInputRef.current.value = '';
                 }
             }
         } else {
              form.setValue('video', undefined, { shouldValidate: true });
         }
     };

     const removeVideo = () => {
         if (!isVerified) return;
         form.setValue('video', undefined, { shouldValidate: true });
          if (videoInputRef.current) {
             videoInputRef.current.value = '';
         }
     };

    const removeImage = (index: number) => {
         if (!isVerified) return;
        URL.revokeObjectURL(imagePreviews[index]);
        removeImageField(index);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
        form.trigger("images");
    };

    useEffect(() => {
        if (imageCleanupNeeded) {
            return () => {
                console.log("Cleaning up image previews...");
                imagePreviews.forEach(url => URL.revokeObjectURL(url));
            };
        }
    }, [imagePreviews, imageCleanupNeeded]);

    const onSubmit: SubmitHandler<ListingFormValues> = async (data) => {
        if (!isVerified) {
             toast({ variant: 'destructive', title: "Verification Required", description: "Cannot submit listing." });
             return;
        }
        setIsLoading(true);
        const imageFiles = form.getValues("images");
        const videoFile = form.getValues("video");

        const result = await createListing(data, imageFiles, videoFile);

        if (result.success && result.listingId) {
            toast({
                title: "Listing Created!",
                description: "Your property has been listed successfully.",
            });
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setImagePreviews([]);
            setVideoPreview(null);
            setVideoFileName(null);
            setImageCleanupNeeded(false);
            form.reset();
            router.push(`/listings/${result.listingId}`); // Redirect to the new listing page
        } else {
            toast({
                variant: "destructive",
                title: "Failed to Create Listing",
                description: result.error || "An unexpected error occurred.",
            });
            setIsLoading(false);
        }
    };

    if (isVerified === null) { // Show loader while checking verification status
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!isVerified) {
        return (
             <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
                 <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6 self-start">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Back
                 </Button>
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
            <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
             </Button>
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
                                {/* --- Location Autocomplete Input --- */}
                                <LocationAutocompleteInput
                                    control={form.control}
                                    name="location"
                                    label="Location"
                                    placeholder="e.g., Lekki Phase 1, Lagos"
                                    disabled={isLoading}
                                />
                                {/* --- Property Details --- */}
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
                                                    <SelectItem value="airbnb">Airbnb / Short Let</SelectItem>
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
                                                                <SelectTrigger className="w-[130px]">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="year">Per Year</SelectItem>
                                                                <SelectItem value="month">Per Month</SelectItem>
                                                                <SelectItem value="week">Per Week</SelectItem>
                                                                <SelectItem value="daily">Per Day</SelectItem> {/* Added daily */}
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
                                                        {amenity === "PS5" ? <Gamepad2 className="w-4 h-4 inline mr-1" /> : null}
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
                                    <Info className="w-4 h-4"/> Upload {MIN_IMAGES}-{MAX_IMAGES} high-quality images (Max {MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB each). First image is cover.
                                </p>
                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                 <div className="relative">
                                                    <Input
                                                        id="imageUpload"
                                                        type="file"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                                                        multiple
                                                        onChange={handleImageFileChange}
                                                         disabled={isLoading || imageFields.length >= MAX_IMAGES}
                                                    />
                                                    <label
                                                        htmlFor="imageUpload"
                                                        className={cn(`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-muted relative`, form.formState.errors.images ? 'border-destructive' : 'border-input', isLoading || imageFields.length >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : '')}
                                                    >
                                                        <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">
                                                            {imageFields.length >= MAX_IMAGES ? `Maximum ${MAX_IMAGES} images reached` : `Click or drag images here (${imageFields.length}/${MAX_IMAGES})`}
                                                        </p>
                                                    </label>
                                                  </div>
                                            </FormControl>
                                            <FormMessage />
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

                            {/* --- Video Upload (Optional) --- */}
                             <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="text-lg font-semibold mb-1">Property Video (Optional)</h3>
                                 <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                    <Info className="w-4 h-4"/> Upload one short video tour (Max {MAX_VIDEO_FILE_SIZE / 1024 / 1024}MB, MP4/WebM/MOV).
                                </p>
                                <FormField
                                    control={form.control}
                                    name="video"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative">
                                                     <Input
                                                         id="videoUpload"
                                                         type="file"
                                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                         accept={ACCEPTED_VIDEO_TYPES.join(",")}
                                                         onChange={handleVideoFileChange}
                                                         ref={videoInputRef}
                                                         disabled={isLoading}
                                                     />
                                                      <label
                                                         htmlFor="videoUpload"
                                                         className={cn(`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-muted relative`, form.formState.errors.video ? 'border-destructive' : 'border-input')}
                                                     >
                                                          {videoPreview ? (
                                                             <div className="text-center px-4 relative group">
                                                                 <Video className="mx-auto h-8 w-8 mb-1 text-primary"/>
                                                                 <p className="text-sm text-foreground truncate">{videoFileName}</p>
                                                                  <Button
                                                                     type="button"
                                                                     variant="destructive"
                                                                     size="icon"
                                                                     className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                     onClick={removeVideo}
                                                                     disabled={isLoading}
                                                                     title="Remove video"
                                                                 >
                                                                     <Trash2 className="h-4 w-4" />
                                                                 </Button>
                                                             </div>
                                                         ) : (
                                                              <div className="text-center text-muted-foreground">
                                                                  <UploadCloud className="mx-auto h-8 w-8 mb-2" />
                                                                  <p>Click or drag video file (Optional)</p>
                                                              </div>
                                                         )}
                                                      </label>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 {/* Video Preview Player */}
                                {videoPreview && (
                                    <div className="mt-4">
                                        <video controls className="w-full max-w-sm mx-auto rounded-md border" src={videoPreview}>
                                            Your browser does not support the video tag.
                                        </video>
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
