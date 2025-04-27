
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import * as z from 'zod';
import { useRouter, useParams } from 'next/navigation'; // Import useParams
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
import { Loader2, UploadCloud, Trash2, Info, BedDouble, Bath, MapPin, Wallet, ShieldAlert, ArrowLeft, Video, Building, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
    "Generator", "Water Heater", "Gated Estate", "Garden", "Balcony", "Swimming Pool"
];

// Custom file validation function
const validateFile = (file: File | undefined | null, acceptedTypes: string[], maxSize: number, fieldName: string) => {
    if (!file) return `${fieldName} is required.`;
    if (file.size > maxSize) return `${fieldName} size should be less than ${maxSize / 1024 / 1024}MB.`;
    if (!acceptedTypes.includes(file.type)) return `Invalid file type for ${fieldName}. Only ${acceptedTypes.map(t => t.split('/')[1]).join(', ')} allowed.`;
    return true;
};

// --- Zod Schema Definition ---
// Adjust schema for edit: Images and Video are optional for update,
// unless user explicitly uploads new ones. We'll handle image/video updates separately.
const editListingFormSchema = z.object({
    id: z.string(), // Include ID for update reference
    title: z.string().min(5, 'Title must be at least 5 characters.'),
    location: z.string().min(5, 'Location must be at least 5 characters.'),
    propertyType: z.string().min(1, 'Please select a property type.'),
    bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
    bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom.'),
    price: z.string().min(1, 'Price is required.').regex(/^\d+$/, "Price must be a number."),
    priceFrequency: z.enum(['year', 'month', 'week']),
    description: z.string().min(20, 'Description must be at least 20 characters.').max(1000, 'Description too long.'),
    amenities: z.array(z.string()).optional(),
    // Images: Allow undefined initially, require array if new images are uploaded.
    // We will manage the actual File objects and existing image URLs separately.
    images: z.array(z.instanceof(File)).optional(),
    // Video: Allow undefined initially.
    video: z.instanceof(File).optional()
        .refine(file => !file || validateFile(file, ACCEPTED_VIDEO_TYPES, MAX_VIDEO_FILE_SIZE, 'Video') === true, {
            message: (file) => validateFile(file, ACCEPTED_VIDEO_TYPES, MAX_VIDEO_FILE_SIZE, 'Video') as string,
        }),
});

type EditListingFormValues = z.infer<typeof editListingFormSchema>;

// --- Mock API Functions ---
// TODO: Replace with actual API calls

// Fetch existing listing data
async function fetchListingForEdit(id: string): Promise<EditListingFormValues | null> {
    console.log(`Fetching listing data for edit: ${id}`);
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulate fetching from mock data or database
    const existingListings = [ // Use the data similar to the manage listings page
        {
            id: 'landlord_prop1',
            title: "My Spacious 3 Bedroom Apartment",
            location: "Lekki Phase 1, Lagos",
            price: "3500000", // Price as string number
            priceFrequency: 'year',
            bedrooms: 3,
            bathrooms: 4,
            imageUrl: "https://picsum.photos/seed/my_house1_exterior/400/300",
             // Simulate existing gallery URLs (important for edit)
            existingImageUrls: [
                 "https://picsum.photos/seed/my_house1_exterior/800/600",
                 "https://picsum.photos/seed/my_house1_kitchen/800/600",
                 "https://picsum.photos/seed/my_house1_bedroom/800/600",
            ],
            existingVideoUrl: null, // Example
            description: "This is the spacious 3 bedroom apartment listed by the test landlord. Excellent condition.",
            amenities: ["Water Supply", "Electricity", "Security", "Parking Space", "Modern Kitchen"],
            propertyType: "apartment", // Add property type
        },
         {
            id: 'landlord_prop2',
            title: "My Cozy 2 Bedroom Flat",
            location: "Yaba, Lagos",
            price: "1800000",
            priceFrequency: 'year',
            bedrooms: 2,
            bathrooms: 2,
            imageUrl: "https://picsum.photos/seed/my_house2_kitchen/400/300",
            existingImageUrls: [
                 "https://picsum.photos/seed/my_house2_kitchen/800/600",
                 "https://picsum.photos/seed/my_house2_living/800/600",
             ],
            existingVideoUrl: null,
             description: "Cozy and affordable flat in Yaba.",
            amenities: ["Water Supply", "Prepaid Meter"],
            propertyType: "apartment",
        },
        // Add more listings if needed for testing
    ];

    const listing = existingListings.find(l => l.id === id);
    if (!listing) return null;

    // Map fetched data to form values structure
    return {
        id: listing.id,
        title: listing.title,
        location: listing.location,
        propertyType: listing.propertyType,
        bedrooms: listing.bedrooms,
        bathrooms: listing.bathrooms,
        price: listing.price,
        priceFrequency: listing.priceFrequency as 'year' | 'month' | 'week',
        description: listing.description,
        amenities: listing.amenities,
        // We don't populate 'images' or 'video' file inputs here; handle previews separately
        images: undefined, // Start with undefined for file input
        video: undefined,  // Start with undefined for file input
        // Add existing URLs separately if needed by the component state
         ...(listing.existingImageUrls && { existingImageUrls: listing.existingImageUrls }),
         ...(listing.existingVideoUrl && { existingVideoUrl: listing.existingVideoUrl }),
    };
}


// Update existing listing data
async function updateListing(
    data: Omit<EditListingFormValues, 'images' | 'video'>,
    newImageFiles: File[], // Newly uploaded image files
    newVideoFile?: File, // Optional new video file
    imagesToRemove?: string[] // Array of existing image URLs to remove
): Promise<{ success: boolean; error?: string; listingId?: string }> {
    console.log("Updating listing with data:", data.id, data);
    console.log("New Image files:", newImageFiles);
    console.log("New Video file:", newVideoFile);
    console.log("Images to remove:", imagesToRemove);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // TODO: Implement actual API call with FormData
    /*
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('title', data.title);
    // ... append other text fields ...
    data.amenities?.forEach(amenity => formData.append('amenities[]', amenity));
    newImageFiles.forEach((file, index) => formData.append(`newImages[${index}]`, file));
    if (newVideoFile) formData.append('newVideo', newVideoFile);
    imagesToRemove?.forEach(url => formData.append('imagesToRemove[]', url));

    // const response = await fetch(`/api/listings/${data.id}`, { method: 'PUT', body: formData });
    // const result = await response.json();
    // return result;
    */

    // Simulate success
    return { success: true, listingId: data.id };
}
// --- End Mock API Functions ---

export default function EditListingPage() {
    const router = useRouter();
    const params = useParams(); // Get route parameters
    const listingId = params.id as string; // Extract listing ID
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true); // State for initial data fetch
    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // Previews for *new* images
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]); // URLs of images already saved
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]); // Track URLs to remove
    const [videoPreview, setVideoPreview] = useState<string | null>(null); // Preview for *new* video
    const [existingVideoUrl, setExistingVideoUrl] = useState<string | null>(null); // URL of video already saved
    const [videoFileName, setVideoFileName] = useState<string | null>(null);
    const [isVerified, setIsVerified] = useState<boolean | null>(true); // Assume verified initially for edit
    const [imageCleanupNeeded, setImageCleanupNeeded] = useState(false);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<EditListingFormValues>({
        resolver: zodResolver(editListingFormSchema),
        defaultValues: {
            // Default values will be populated by fetched data
        },
        mode: 'onBlur',
    });

     // Fetch listing data when component mounts
    useEffect(() => {
        if (!listingId) {
            toast({ variant: 'destructive', title: "Error", description: "Listing ID not found." });
            router.push('/landlord/dashboard/listings');
            return;
        }

        setIsFetchingData(true);
        fetchListingForEdit(listingId)
            .then(data => {
                if (data) {
                    form.reset(data); // Populate form with fetched data
                    // Set existing media URLs for display
                    setExistingImageUrls((data as any).existingImageUrls || []); // Cast to any temporarily if type doesn't include it
                    setExistingVideoUrl((data as any).existingVideoUrl || null);
                     // Ensure price is formatted correctly if needed (though it's a string)
                    form.setValue('price', String(data.price));
                    // Ensure bedrooms/bathrooms are numbers
                    form.setValue('bedrooms', Number(data.bedrooms));
                    form.setValue('bathrooms', Number(data.bathrooms));

                } else {
                    toast({ variant: 'destructive', title: "Not Found", description: "Listing could not be found for editing." });
                    router.push('/landlord/dashboard/listings');
                }
            })
            .catch(error => {
                console.error("Error fetching listing for edit:", error);
                toast({ variant: 'destructive', title: "Error", description: "Could not load listing data." });
                router.push('/landlord/dashboard/listings');
            })
            .finally(() => setIsFetchingData(false));

    }, [listingId, router, toast, form]);


    // Watch for changes in video field to update preview
    const videoFieldValue = form.watch("video");

     useEffect(() => {
        let url: string | null = null;
        if (videoFieldValue instanceof File) {
            url = URL.createObjectURL(videoFieldValue);
            setVideoPreview(url);
            setVideoFileName(videoFieldValue.name);
            setExistingVideoUrl(null); // Clear existing video URL if new one is chosen
            console.log("New video preview created:", url);
        } else {
            // If video is removed or not a file, clear preview and name
             if (videoPreview) {
                 console.log("Revoking old video preview URL:", videoPreview);
                 URL.revokeObjectURL(videoPreview);
             }
            setVideoPreview(null);
            setVideoFileName(null);
            // Keep existingVideoUrl if no new file is selected
        }

        // Cleanup function for when the component unmounts or videoFieldValue changes *away* from a File
        return () => {
             if (url) {
                 console.log("Cleaning up video preview URL on change/unmount:", url);
                 URL.revokeObjectURL(url);
             }
        };
    }, [videoFieldValue]);


    const { fields: imageFields, append: appendImage, remove: removeImageField } = useFieldArray({
        control: form.control,
        name: "images", // This manages the array of *new* File objects
    });

    // Handles adding *new* images
    const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isVerified) return;
        const files = Array.from(event.target.files || []);
        const currentImageCount = existingImageUrls.length + imagePreviews.length - imagesToRemove.length;
        const availableSlots = MAX_IMAGES - currentImageCount;
        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            toast({
                variant: 'destructive',
                title: "Image Limit Exceeded",
                description: `You can only add ${availableSlots} more image(s). Maximum is ${MAX_IMAGES}.`,
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

        appendImage(validatedFiles); // Append validated files to the form array
        setImagePreviews(prev => [...prev, ...newPreviews]); // Update previews for *new* images
        setImageCleanupNeeded(true);

        event.target.value = '';
    };

    // Removes a *newly added* image preview and its corresponding File object
    const removeNewImage = (index: number) => {
        if (!isVerified) return;
        console.log("Removing new image at index:", index, "Preview:", imagePreviews[index]);
        URL.revokeObjectURL(imagePreviews[index]);
        removeImageField(index);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

     // Marks an *existing* image for removal
    const markExistingImageForRemoval = (urlToRemove: string) => {
        if (!isVerified) return;
        // Prevent removing more images than allowed (must keep at least MIN_IMAGES)
        const currentTotalImages = existingImageUrls.length + imagePreviews.length;
        const imagesMarkedForRemoval = imagesToRemove.includes(urlToRemove) ? imagesToRemove.length - 1 : imagesToRemove.length + 1;
        if (currentTotalImages - imagesMarkedForRemoval < MIN_IMAGES) {
             toast({ variant: 'destructive', title: "Minimum Images Required", description: `You must keep at least ${MIN_IMAGES} images.` });
             return;
        }

        setImagesToRemove(prev =>
            prev.includes(urlToRemove)
                ? prev.filter(url => url !== urlToRemove) // Toggle: remove if already marked
                : [...prev, urlToRemove] // Toggle: add if not marked
        );
         console.log("Toggled removal for existing image:", urlToRemove);
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
                 if (videoInputRef.current) videoInputRef.current.value = '';
             }
         } else {
              form.setValue('video', undefined, { shouldValidate: true });
         }
     };

     // Removes *newly added* video
     const removeNewVideo = () => {
         if (!isVerified) return;
          console.log("Removing new video");
         form.setValue('video', undefined, { shouldValidate: true });
         if (videoInputRef.current) videoInputRef.current.value = '';
         // Preview cleanup happens in useEffect
     };

      // Removes *existing* video URL
     const removeExistingVideo = () => {
         if (!isVerified) return;
          console.log("Removing existing video");
         setExistingVideoUrl(null);
         // Here you might need to set a flag or value to signal backend to delete the existing video file
          toast({ title: "Info", description: "Existing video marked for removal. Save changes to confirm." });
     };

    // Cleanup image object URLs on component unmount
    useEffect(() => {
        if (imageCleanupNeeded) {
            return () => {
                console.log("Cleaning up NEW image previews on unmount...");
                imagePreviews.forEach(url => {
                    console.log("Revoking URL:", url);
                    URL.revokeObjectURL(url);
                });
            };
        }
    }, [imagePreviews, imageCleanupNeeded]);

    // Handle Form Submission
    const onSubmit: SubmitHandler<EditListingFormValues> = async (data) => {
        if (!isVerified) return;

        // Validation: Ensure enough images remain after removal and addition
        const finalImageCount = existingImageUrls.length - imagesToRemove.length + imagePreviews.length;
        if (finalImageCount < MIN_IMAGES) {
            toast({ variant: 'destructive', title: "Minimum Images Required", description: `Please ensure you have at least ${MIN_IMAGES} images selected.` });
            return;
        }
        if (finalImageCount > MAX_IMAGES) {
             toast({ variant: 'destructive', title: "Maximum Images Exceeded", description: `You can have a maximum of ${MAX_IMAGES} images.` });
             return;
        }


        setIsLoading(true);
        const newImageFiles = form.getValues("images") || []; // Get the new File objects
        const newVideoFile = form.getValues("video");

        // Prepare data for the API, excluding the File arrays
        const updateData: Omit<EditListingFormValues, 'images' | 'video'> = { ...data };

        // Call API function
        const result = await updateListing(
            updateData,
            newImageFiles,
            newVideoFile,
            imagesToRemove,
            // Add flag if existing video was removed
            existingVideoUrl === null && videoPreview === null // Signal removal if both existing and new are null
        );

        if (result.success && result.listingId) {
            toast({
                title: "Listing Updated!",
                description: "Your property details have been saved.",
            });
            // Cleanup previews before resetting/navigating
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
            if (videoPreview) URL.revokeObjectURL(videoPreview);
            setImagePreviews([]);
            setVideoPreview(null);
            setVideoFileName(null);
            setImagesToRemove([]);
            setImageCleanupNeeded(false);
            // form.reset(); // Optionally reset or refetch data after successful update
            // router.push(`/listings/${result.listingId}`); // Go to view page
            router.push('/landlord/dashboard/listings'); // Go back to manage listings page
        } else {
            toast({
                variant: "destructive",
                title: "Failed to Update Listing",
                description: result.error || "An unexpected error occurred.",
            });
            setIsLoading(false);
        }
    };

    if (isFetchingData) {
        return <div className="container mx-auto flex justify-center items-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
    }

    if (!isVerified) { // Should ideally check landlord verification status again
        return (
             <div className="container mx-auto px-4 py-12 flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
                 <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6 self-start">
                     <ArrowLeft className="mr-2 h-4 w-4" /> Back
                 </Button>
                <Alert variant="destructive" className="max-w-lg">
                  <ShieldAlert className="h-4 w-4" />
                  <AlertTitle>Account Not Verified</AlertTitle>
                  <AlertDescription>
                    Your account needs to be verified to manage listings.
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
                Back to Listings
             </Button>
            <Card className="max-w-4xl mx-auto shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center gap-2"><Building className="w-6 h-6"/> Edit Property Listing</CardTitle>
                    <CardDescription>Update the details for your property: {form.getValues('title')}</CardDescription>
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
                                            <FormControl><Input {...field} disabled={isLoading} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="location"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel><MapPin className="w-4 h-4 inline mr-1" />Location</FormLabel>
                                            <FormControl><Input {...field} disabled={isLoading} /></FormControl>
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
                                                <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
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
                                                <FormLabel><BedDouble className="w-4 h-4 inline mr-1" />Bedrooms</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isLoading}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select number" /></SelectTrigger></FormControl>
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
                                                <FormLabel><Bath className="w-4 h-4 inline mr-1" />Bathrooms</FormLabel>
                                                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={isLoading}>
                                                <FormControl><SelectTrigger><SelectValue placeholder="Select number" /></SelectTrigger></FormControl>
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
                                                <FormLabel><Wallet className="w-4 h-4 inline mr-1" />Rental Price (₦)</FormLabel>
                                                <div className="flex gap-2">
                                                <FormControl><Input type="number" {...field} disabled={isLoading} /></FormControl>
                                                 <FormField
                                                    control={form.control}
                                                    name="priceFrequency"
                                                    render={({ field: freqField }) => (
                                                        <Select onValueChange={freqField.onChange} value={freqField.value} disabled={isLoading}>
                                                            <FormControl><SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger></FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="year">Per Year</SelectItem>
                                                                <SelectItem value="month">Per Month</SelectItem>
                                                                <SelectItem value="week">Per Week</SelectItem>
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
                                            <FormControl><Textarea className="min-h-[120px]" {...field} disabled={isLoading} /></FormControl>
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
                                                <FormItem key={amenity} className="flex flex-row items-start space-x-3 space-y-0">
                                                    <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(amenity)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), amenity])
                                                            : field.onChange(field.value?.filter((value) => value !== amenity))
                                                        }}
                                                         disabled={isLoading}
                                                    />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">{amenity}</FormLabel>
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
                                    <Info className="w-4 h-4"/> Update images (Keep {MIN_IMAGES}-{MAX_IMAGES}, Max {MAX_IMAGE_FILE_SIZE / 1024 / 1024}MB each).
                                </p>

                                {/* Display Existing Images */}
                                {existingImageUrls.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {existingImageUrls.map((src, index) => (
                                            <div key={`existing-${index}`} className="relative group aspect-square">
                                                <Image
                                                    src={src}
                                                    alt={`Existing Image ${index + 1}`}
                                                    fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                    className={cn("object-cover rounded-md border", imagesToRemove.includes(src) && "opacity-50 border-red-500 border-2")}
                                                    unoptimized
                                                />
                                                <Button
                                                    type="button"
                                                    variant={imagesToRemove.includes(src) ? "secondary" : "destructive"}
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    onClick={() => markExistingImageForRemoval(src)}
                                                    disabled={isLoading}
                                                    title={imagesToRemove.includes(src) ? "Undo removal" : "Mark for removal"}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                                 {index === 0 && !imagesToRemove.includes(src) && ( // Show cover label only if it's the first and not marked for removal
                                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-0.5 rounded-b-md">
                                                        Cover
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Display New Image Previews */}
                                {imagePreviews.length > 0 && (
                                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t">
                                         <p className="col-span-full text-sm font-medium">New Images:</p>
                                         {imagePreviews.map((src, index) => (
                                             <div key={`new-${index}`} className="relative group aspect-square">
                                                 <Image
                                                     src={src}
                                                     alt={`New Preview ${index + 1}`}
                                                     fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                                     className="object-cover rounded-md border"
                                                 />
                                                 <Button
                                                     type="button"
                                                     variant="destructive"
                                                     size="icon"
                                                     className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                     onClick={() => removeNewImage(index)}
                                                     disabled={isLoading}
                                                     title="Remove new image"
                                                 >
                                                     <Trash2 className="h-4 w-4" />
                                                 </Button>
                                             </div>
                                         ))}
                                     </div>
                                 )}


                                {/* Input for adding NEW images */}
                                <FormField
                                    control={form.control}
                                    name="images" // This is just for the input trigger, not the main data source
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                 <div className="relative mt-4">
                                                     <Input
                                                         id="imageUpload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                         accept={ACCEPTED_IMAGE_TYPES.join(",")} multiple
                                                         onChange={handleImageFileChange}
                                                         disabled={isLoading || (existingImageUrls.length + imagePreviews.length - imagesToRemove.length) >= MAX_IMAGES}
                                                     />
                                                     <label htmlFor="imageUpload"
                                                         className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-muted relative border-input ${isLoading || (existingImageUrls.length + imagePreviews.length - imagesToRemove.length) >= MAX_IMAGES ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                     >
                                                         <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
                                                         <p className="text-sm text-muted-foreground">
                                                             {(existingImageUrls.length + imagePreviews.length - imagesToRemove.length) >= MAX_IMAGES ? `Maximum ${MAX_IMAGES} images reached` : `Click or drag to add more images (${existingImageUrls.length + imagePreviews.length - imagesToRemove.length}/${MAX_IMAGES})`}
                                                         </p>
                                                     </label>
                                                   </div>
                                            </FormControl>
                                            {/* Display overall image count validation error */}
                                            <FormMessage>{form.formState.errors.images?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>


                            {/* --- Video Upload (Optional) --- */}
                            <div className="space-y-4 p-4 border rounded-md">
                                <h3 className="text-lg font-semibold mb-1">Property Video (Optional)</h3>
                                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                                    <Info className="w-4 h-4"/> Update or add a video tour (Max {MAX_VIDEO_FILE_SIZE / 1024 / 1024}MB).
                                </p>

                                {/* Display Existing Video or New Video Preview */}
                                {existingVideoUrl && !videoPreview && (
                                     <div className="mt-4 relative group">
                                        <p className="text-sm mb-2">Current Video:</p>
                                        <video controls className="w-full max-w-sm mx-auto rounded-md border" src={existingVideoUrl} preload="metadata">
                                            Your browser does not support the video tag.
                                        </video>
                                         <Button
                                             type="button" variant="destructive" size="icon"
                                             className="absolute top-8 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                             onClick={removeExistingVideo} disabled={isLoading} title="Remove existing video">
                                             <Trash2 className="h-4 w-4" />
                                         </Button>
                                    </div>
                                )}
                                 {videoPreview && (
                                     <div className="mt-4">
                                         <p className="text-sm mb-2">New Video Preview:</p>
                                         <video controls className="w-full max-w-sm mx-auto rounded-md border" src={videoPreview}>
                                             Your browser does not support the video tag.
                                         </video>
                                     </div>
                                 )}

                                {/* Video Input */}
                                <FormField
                                    control={form.control}
                                    name="video"
                                    render={() => (
                                        <FormItem>
                                            <FormControl>
                                                <div className="relative mt-4">
                                                     <Input
                                                         id="videoUpload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                         accept={ACCEPTED_VIDEO_TYPES.join(",")} onChange={handleVideoFileChange} ref={videoInputRef} disabled={isLoading}
                                                     />
                                                      <label htmlFor="videoUpload"
                                                         className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer bg-background hover:bg-muted relative ${form.formState.errors.video ? 'border-destructive' : 'border-input'}`} >
                                                          {videoFileName && videoPreview ? ( // Show filename if new video is selected
                                                             <div className="text-center px-4 relative group">
                                                                 <Video className="mx-auto h-8 w-8 mb-1 text-primary"/>
                                                                 <p className="text-sm text-foreground truncate">{videoFileName}</p>
                                                                  <Button type="button" variant="destructive" size="icon"
                                                                     className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                     onClick={removeNewVideo} disabled={isLoading} title="Remove new video">
                                                                     <Trash2 className="h-4 w-4" />
                                                                 </Button>
                                                             </div>
                                                         ) : existingVideoUrl ? ( // Show placeholder if existing video exists
                                                             <div className="text-center text-muted-foreground">
                                                                <Video className="mx-auto h-8 w-8 mb-2 text-primary"/>
                                                                <p>Click or drag to replace video</p>
                                                            </div>
                                                         ) : ( // Show upload prompt if no video exists or new selected
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
                            </div>


                            {/* --- Submission Button --- */}
                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90" disabled={isLoading || !isVerified}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    {isLoading ? "Saving Changes..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper function (can be moved to utils if needed)
function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}
