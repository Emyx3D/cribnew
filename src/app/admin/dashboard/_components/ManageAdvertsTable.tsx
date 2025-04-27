
'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Pencil, PlusCircle, Link as LinkIcon, Image as ImageIcon } from "lucide-react"; // Added LinkIcon, ImageIcon
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image'; // For image preview in table
import Link from 'next/link'; // For linking in table

// Schema for adding/editing adverts
const advertFormSchema = z.object({
  id: z.string().optional(), // Optional for adding, required for editing
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  imageUrl: z.string().url('Please enter a valid URL for the image.'),
  linkUrl: z.string().url('Please enter a valid URL for the ad link.'),
  targetPages: z.array(z.enum(['landing', 'listings'])).min(1, 'Please select at least one target page.'),
  // status is handled by the toggle switch, not in the form directly for add/edit
});

type AdvertFormValues = z.infer<typeof advertFormSchema>;

// --- Type Definition ---
type Advertisement = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  targetPages: ('landing' | 'listings')[];
  status: 'active' | 'inactive';
  createdAt: Date;
};

// --- Mock API Functions ---
// TODO: Replace with actual API calls

async function fetchAds(): Promise<Advertisement[]> {
  console.log("Fetching advertisements...");
  await new Promise(resolve => setTimeout(resolve, 800));
  // Simulate fetching from storage or return mock data
  try {
      const storedAds = localStorage.getItem('cribdirectAds');
      if (storedAds) {
          const parsedAds = JSON.parse(storedAds, (key, value) => {
              if (key === 'createdAt') return new Date(value);
              return value;
          });
          console.log("Loaded ads from localStorage");
          return parsedAds;
      }
  } catch (e) {
      console.error("Could not parse ads from localStorage", e);
  }

  console.log("Using initial mock ad data");
  return [
    { id: 'ad1', title: 'Summer Promo Banner', imageUrl: 'https://picsum.photos/seed/promo1/900/150', linkUrl: 'https://example.com/promo', targetPages: ['landing'], status: 'active', createdAt: new Date(Date.now() - 86400000 * 2) },
    { id: 'ad2', title: 'New Listings Alert', imageUrl: 'https://picsum.photos/seed/listingsAd/900/150', linkUrl: 'https://example.com/new', targetPages: ['listings'], status: 'active', createdAt: new Date(Date.now() - 86400000) },
    { id: 'ad3', title: 'Holiday Special (Both)', imageUrl: 'https://picsum.photos/seed/holiday/900/150', linkUrl: 'https://example.com/holiday', targetPages: ['landing', 'listings'], status: 'inactive', createdAt: new Date() },
  ];
}

// Helper to save ads to local storage
const saveAdsToStorage = (ads: Advertisement[]) => {
    try {
        localStorage.setItem('cribdirectAds', JSON.stringify(ads));
        console.log("Saved ads to localStorage");
    } catch (e) {
        console.error("Failed to save ads to localStorage", e);
    }
};

async function addAdvert(data: Omit<AdvertFormValues, 'id'>): Promise<{ success: boolean; error?: string; newAd?: Advertisement }> {
   console.log("Adding advert:", data);
   await new Promise(resolve => setTimeout(resolve, 600));
   const newAd: Advertisement = {
     id: `ad_${Math.random().toString(36).substring(7)}`,
     title: data.title,
     imageUrl: data.imageUrl,
     linkUrl: data.linkUrl,
     targetPages: data.targetPages,
     status: 'active', // Default to active
     createdAt: new Date(),
   };
   // Update storage
    const currentAds = await fetchAds();
    const updatedAds = [...currentAds, newAd];
    saveAdsToStorage(updatedAds);
   return { success: true, newAd };
}

async function updateAdvert(data: AdvertFormValues): Promise<{ success: boolean; error?: string; updatedAd?: Advertisement }> {
   console.log("Updating advert:", data);
    if (!data.id) return { success: false, error: "Advert ID missing for update." };
   await new Promise(resolve => setTimeout(resolve, 600));
   const updatedAd: Advertisement = {
     id: data.id,
     title: data.title,
     imageUrl: data.imageUrl,
     linkUrl: data.linkUrl,
     targetPages: data.targetPages,
     status: 'active', // Status is updated separately
     createdAt: new Date(), // Keep original creation date ideally, but simplify for mock
   };

   // Fetch existing status before updating other fields
   const currentAds = await fetchAds();
   const existingAd = currentAds.find(ad => ad.id === data.id);
   if (existingAd) {
       updatedAd.status = existingAd.status; // Preserve existing status
       updatedAd.createdAt = existingAd.createdAt; // Preserve created date
   }

   const updatedAds = currentAds.map(ad => ad.id === data.id ? updatedAd : ad);
   saveAdsToStorage(updatedAds);

   return { success: true, updatedAd };
}


async function updateAdStatus(id: string, newStatus: 'active' | 'inactive'): Promise<{ success: boolean; error?: string }> {
  console.log(`Updating ad ${id} status to ${newStatus}`);
  await new Promise(resolve => setTimeout(resolve, 300));
   const currentAds = await fetchAds();
   const updatedAds = currentAds.map(ad => ad.id === id ? { ...ad, status: newStatus } : ad);
   saveAdsToStorage(updatedAds);
  return { success: true };
}

async function removeAdvert(id: string): Promise<{ success: boolean; error?: string }> {
   console.log("Removing advert:", id);
   await new Promise(resolve => setTimeout(resolve, 400));
   const currentAds = await fetchAds();
   const updatedAds = currentAds.filter(ad => ad.id !== id);
   saveAdsToStorage(updatedAds);
   return { success: true };
}
// --- End Mock API Functions ---


export function ManageAdvertsTable() {
  const [adList, setAdList] = useState<Advertisement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdvert, setEditingAdvert] = useState<Advertisement | null>(null); // Track editing state
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<AdvertFormValues>({
    resolver: zodResolver(advertFormSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
      linkUrl: '',
      targetPages: [],
    },
  });

  useEffect(() => {
    fetchAds()
      .then(data => {
         setAdList(data);
         setIsLoading(false);
      })
      .catch(error => {
         console.error("Error fetching ads:", error);
         toast({ variant: 'destructive', title: "Error", description: "Could not fetch advertisements." });
         setIsLoading(false);
      });
  }, [toast]);

  const handleAddOrEditAdvert: SubmitHandler<AdvertFormValues> = async (data) => {
    setIsSubmitting(true);
    let result;
    if (editingAdvert) {
        // Update existing advert
        result = await updateAdvert({ ...data, id: editingAdvert.id });
         if (result.success && result.updatedAd) {
            setAdList(prev => prev.map(ad => ad.id === editingAdvert.id ? result.updatedAd! : ad));
            toast({ title: "Success", description: "Advertisement updated successfully." });
            setDialogOpen(false);
            setEditingAdvert(null);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to update advertisement." });
        }
    } else {
        // Add new advert
        result = await addAdvert(data);
         if (result.success && result.newAd) {
            setAdList(prev => [...prev, result.newAd!]);
            toast({ title: "Success", description: "Advertisement added successfully." });
            setDialogOpen(false);
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to add advertisement." });
        }
    }

    setIsSubmitting(false);
  };

  const handleRemoveAdvert = async (id: string) => {
     const adToRemove = adList.find(ad => ad.id === id);
     if (!confirm(`Are you sure you want to remove the advert "${adToRemove?.title}"?`)) {
         return;
     }

     setIsLoading(true); // Use main loading indicator for table updates
     const result = await removeAdvert(id);
     if (result.success) {
         setAdList(prev => prev.filter(ad => ad.id !== id));
         toast({ title: "Success", description: "Advertisement removed successfully." });
     } else {
         toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to remove advertisement." });
     }
     setIsLoading(false);
  };

   const openEditDialog = (advert: Advertisement) => {
        setEditingAdvert(advert);
        form.reset({
            title: advert.title,
            imageUrl: advert.imageUrl,
            linkUrl: advert.linkUrl,
            targetPages: advert.targetPages,
        });
        setDialogOpen(true);
    };

     const openAddDialog = () => {
        setEditingAdvert(null);
        form.reset({
            title: '',
            imageUrl: '',
            linkUrl: '',
            targetPages: [],
        });
        setDialogOpen(true);
    };

    const handleStatusToggle = async (id: string, currentStatus: 'active' | 'inactive') => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        setUpdatingStatusId(id);
        const result = await updateAdStatus(id, newStatus);

        if (result.success) {
            setAdList(prev => prev.map(ad => ad.id === id ? { ...ad, status: newStatus } : ad));
            toast({ title: "Success", description: `Advertisement ${newStatus}d successfully.` });
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to update ad status." });
        }
        setUpdatingStatusId(null);
    };


  if (isLoading && adList.length === 0) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Advert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]"> {/* Wider dialog for form */}
            <DialogHeader>
              <DialogTitle>{editingAdvert ? 'Edit Advertisement' : 'Add New Advertisement'}</DialogTitle>
              <DialogDescription>
                {editingAdvert ? 'Update the details for this advertisement.' : 'Enter the details for the new advertisement.'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddOrEditAdvert)} className="space-y-4 py-4">
                 <FormField
                   control={form.control}
                   name="title"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Advert Title</FormLabel>
                       <FormControl>
                         <Input placeholder="e.g., Limited Time Offer" {...field} disabled={isSubmitting} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  <FormField
                   control={form.control}
                   name="imageUrl"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Image URL</FormLabel>
                       <FormControl>
                         <Input type="url" placeholder="https://example.com/image.jpg" {...field} disabled={isSubmitting}/>
                       </FormControl>
                       <FormDescription>URL of the advertisement banner image.</FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  <FormField
                   control={form.control}
                   name="linkUrl"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Link URL</FormLabel>
                       <FormControl>
                         <Input type="url" placeholder="https://example.com/target-page" {...field} disabled={isSubmitting}/>
                       </FormControl>
                        <FormDescription>Where the user should be directed when clicking the ad.</FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                    control={form.control}
                    name="targetPages"
                    render={() => (
                        <FormItem>
                        <div className="mb-4">
                            <FormLabel className="text-base">Target Pages</FormLabel>
                            <FormDescription>
                            Select where this advertisement should appear.
                            </FormDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {(['landing', 'listings'] as const).map((page) => (
                                <FormField
                                key={page}
                                control={form.control}
                                name="targetPages"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={page}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                        <Checkbox
                                            checked={field.value?.includes(page)}
                                            onCheckedChange={(checked) => {
                                            return checked
                                                ? field.onChange([...field.value, page])
                                                : field.onChange(
                                                    field.value?.filter(
                                                    (value) => value !== page
                                                    )
                                                )
                                            }}
                                            disabled={isSubmitting}
                                        />
                                        </FormControl>
                                        <FormLabel className="font-normal capitalize">
                                            {page} Page
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setEditingAdvert(null)}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {editingAdvert ? 'Save Changes' : 'Add Advert'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

       {adList.length === 0 && !isLoading ? (
         <p className="text-center text-muted-foreground py-10">No advertisements found.</p>
       ) : (
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Preview</TableHead>
               <TableHead>Title</TableHead>
               <TableHead>Target Pages</TableHead>
               <TableHead>Link</TableHead>
               <TableHead>Status</TableHead>
               <TableHead className="text-right">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {adList.map((ad) => (
               <TableRow key={ad.id}>
                 <TableCell>
                   <Image
                      src={ad.imageUrl}
                      alt={ad.title}
                      width={100} // Small preview width
                      height={30} // Small preview height
                      className="object-contain rounded border"
                      unoptimized // Avoid optimization for external URLs if needed
                   />
                 </TableCell>
                 <TableCell className="font-medium">{ad.title}</TableCell>
                 <TableCell>
                    {ad.targetPages.map(page => (
                        <Badge key={page} variant="outline" className="capitalize mr-1">{page}</Badge>
                    ))}
                 </TableCell>
                 <TableCell>
                     <Link href={ad.linkUrl} target="_blank" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> {ad.linkUrl.length > 30 ? `${ad.linkUrl.substring(0, 30)}...` : ad.linkUrl}
                     </Link>
                 </TableCell>
                 <TableCell>
                    <div className="flex items-center space-x-2">
                         {updatingStatusId === ad.id ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                         ) : (
                             <Switch
                                id={`status-switch-${ad.id}`}
                                checked={ad.status === 'active'}
                                onCheckedChange={() => handleStatusToggle(ad.id, ad.status)}
                                disabled={updatingStatusId === ad.id || isLoading}
                                aria-label={`Toggle status for ${ad.title}`}
                            />
                         )}
                          <Label htmlFor={`status-switch-${ad.id}`} className="text-xs capitalize">
                            {ad.status}
                          </Label>
                    </div>
                 </TableCell>
                 <TableCell className="text-right">
                   <div className="flex gap-2 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-700"
                        onClick={() => openEditDialog(ad)}
                        disabled={isLoading}
                        title="Edit Advert"
                      >
                         <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleRemoveAdvert(ad.id)}
                        disabled={isLoading}
                        title="Remove Advert"
                      >
                         {isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                      </Button>
                   </div>
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       )}
    </div>
  );
}
