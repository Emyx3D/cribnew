'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Eye, Trash2, Loader2, MessageSquareWarning } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// TODO: Define types for FlaggedListing data
type FlaggedListing = {
  id: string; // Flag ID
  listingId: string; // ID of the actual property listing
  listingTitle: string;
  landlordName: string; // Name of the landlord who posted
  reporterEmail: string; // Email of the user who reported (or "System" if automatic)
  reason: string; // Reason provided by reporter or system flag reason
  reportedAt: Date;
  status: 'pending_review' | 'resolved_kept' | 'resolved_removed';
};

// TODO: Replace with actual API call to fetch flagged listings
async function fetchFlaggedListings(): Promise<FlaggedListing[]> {
  console.log("Fetching flagged listings...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  // Return mock data
  return [
    { id: 'flag1', listingId: 'prop123', listingTitle: 'Luxury Penthouse with Pool', landlordName: 'Mr. Big Shot', reporterEmail: 'jealous@competitor.com', reason: 'Price seems too low, likely fake.', reportedAt: new Date(Date.now() - 86400000), status: 'pending_review' },
    { id: 'flag2', listingId: 'prop456', listingTitle: 'Cozy Studio Near Market', landlordName: 'Mrs. Reasonable', reporterEmail: 'helpful@tenant.org', reason: 'Incorrect location shown on map.', reportedAt: new Date(Date.now() - 172800000), status: 'pending_review' },
     { id: 'flag3', listingId: 'prop789', listingTitle: 'Beachfront Villa (URGENT RENT)', landlordName: 'Shady McScamface', reporterEmail: 'system@detection.ai', reason: 'Multiple suspicious keywords detected.', reportedAt: new Date(), status: 'pending_review' },
  ];
}

// TODO: Replace with actual API call to resolve a flag (keep or remove listing)
async function resolveFlaggedListing(flagId: string, action: 'keep' | 'remove'): Promise<{ success: boolean; error?: string }> {
  console.log(`Resolving flag ${flagId} with action: ${action}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
   // Simulate success/failure
   if (flagId === 'fail_case_id') {
     return { success: false, error: "Simulated server error." };
   }
  return { success: true };
}


export function FlaggedListingsTable() {
  const [flaggedListings, setFlaggedListings] = useState<FlaggedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFlaggedListings()
      .then(data => {
         setFlaggedListings(data.filter(f => f.status === 'pending_review')); // Only show pending initially
         setIsLoading(false);
      })
      .catch(error => {
         console.error("Error fetching flagged listings:", error);
         toast({ variant: 'destructive', title: "Error", description: "Could not fetch flagged listings." });
         setIsLoading(false);
      });
  }, [toast]);

  const handleResolve = async (flagId: string, action: 'keep' | 'remove') => {
    setUpdatingId(flagId);
    const result = await resolveFlaggedListing(flagId, action);
    if (result.success) {
      setFlaggedListings(prev => prev.filter(f => f.id !== flagId)); // Remove from pending list
      toast({ title: "Success", description: `Listing flag resolved (${action === 'keep' ? 'kept' : 'removed'}).` });
      // TODO: If action is 'remove', trigger actual listing removal via API call
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to resolve flag." });
    }
    setUpdatingId(null);
  };


  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

   if (flaggedListings.length === 0) {
     return <p className="text-center text-muted-foreground py-10">No pending flagged listings to review.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Listing</TableHead>
          <TableHead>Landlord</TableHead>
           <TableHead>Reporter</TableHead>
          <TableHead>Reason</TableHead>
          <TableHead>Reported At</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {flaggedListings.map((flag) => (
          <TableRow key={flag.id}>
            <TableCell className="font-medium">
               {/* TODO: Make this link to the actual listing details page */}
               <Link href={`/listings/${flag.listingId}`} target="_blank" className="hover:underline text-primary flex items-center gap-1">
                    {flag.listingTitle} <Eye className="h-4 w-4" />
               </Link>
            </TableCell>
            <TableCell>{flag.landlordName}</TableCell>
            <TableCell>{flag.reporterEmail}</TableCell>
            <TableCell>
                <span title={flag.reason} className="flex items-center gap-1 cursor-help">
                    <MessageSquareWarning className="h-4 w-4 text-amber-600"/>
                    {flag.reason.length > 40 ? `${flag.reason.substring(0, 40)}...` : flag.reason}
                 </span>
            </TableCell>
             <TableCell>{flag.reportedAt.toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
               <div className="flex gap-2 justify-end">
                 {updatingId === flag.id ? (
                    <Loader2 className="h-4 w-4 animate-spin self-center"/>
                 ) : (
                    <>
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-green-600 hover:bg-green-100 hover:text-green-700"
                         onClick={() => handleResolve(flag.id, 'keep')}
                         disabled={!!updatingId}
                       >
                         <CheckCircle className="h-4 w-4" />
                         <span className="ml-1">Keep Listing</span>
                       </Button>
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-red-600 hover:bg-red-100 hover:text-red-700"
                         onClick={() => handleResolve(flag.id, 'remove')}
                         disabled={!!updatingId}
                       >
                         <Trash2 className="h-4 w-4" />
                         <span className="ml-1">Remove Listing</span>
                       </Button>
                    </>
                 )}

               </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
