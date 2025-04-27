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
import { CheckCircle, XCircle, Eye, Download, Loader2 } from "lucide-react";
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
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // For rejection reason

// TODO: Define types for Landlord data (replace with actual types from backend/DB)
type LandlordVerificationRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  idDocumentUrl: string; // URL to view/download ID
  ownershipDocumentUrl: string; // URL to view/download proof
  rejectionReason?: string;
};

// TODO: Replace with actual API call to fetch pending landlords
async function fetchPendingLandlords(): Promise<LandlordVerificationRequest[]> {
  console.log("Fetching pending landlords...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  // Return mock data
  return [
    { id: 'landlord1', name: 'Alice Wonderland', email: 'alice@example.com', phone: '08011111111', submittedAt: new Date(Date.now() - 86400000), status: 'pending', idDocumentUrl: '/mock-docs/id.pdf', ownershipDocumentUrl: '/mock-docs/cofo.pdf' },
    { id: 'landlord2', name: 'Bob The Builder', email: 'bob@example.com', phone: '08022222222', submittedAt: new Date(Date.now() - 172800000), status: 'pending', idDocumentUrl: '/mock-docs/id.jpg', ownershipDocumentUrl: '/mock-docs/deed.png' },
    { id: 'landlord3', name: 'Charlie Chaplin', email: 'charlie@example.com', phone: '08033333333', submittedAt: new Date(), status: 'pending', idDocumentUrl: '/mock-docs/id.webp', ownershipDocumentUrl: '/mock-docs/agreement.pdf' },
  ];
}

// TODO: Replace with actual API call to approve/reject landlord
async function updateLandlordStatus(id: string, status: 'approved' | 'rejected', reason?: string): Promise<{ success: boolean; error?: string }> {
  console.log(`Updating landlord ${id} to ${status}` + (reason ? ` with reason: ${reason}` : ''));
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // Simulate success/failure
  if (id === 'fail_case_id') {
     return { success: false, error: "Simulated server error." };
  }
  return { success: true };
}


export function LandlordVerificationTable() {
  const [landlords, setLandlords] = useState<LandlordVerificationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false); // State for rejection dialog
  const [currentLandlordId, setCurrentLandlordId] = useState<string | null>(null); // Track landlord for dialog
  const { toast } = useToast();

  useEffect(() => {
    fetchPendingLandlords()
      .then(data => {
         setLandlords(data);
         setIsLoading(false);
      })
      .catch(error => {
         console.error("Error fetching pending landlords:", error);
         toast({ variant: 'destructive', title: "Error", description: "Could not fetch pending landlord requests." });
         setIsLoading(false);
      });
  }, [toast]);


  const handleApprove = async (id: string) => {
    setUpdatingId(id);
    const result = await updateLandlordStatus(id, 'approved');
    if (result.success) {
      setLandlords(prev => prev.filter(l => l.id !== id)); // Remove from pending list
      toast({ title: "Success", description: "Landlord approved successfully." });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to approve landlord." });
    }
    setUpdatingId(null);
  };

  const handleReject = async () => {
     if (!currentLandlordId) return; // Should not happen if dialog is open correctly
     if (!rejectionReason.trim()) {
       toast({ variant: 'destructive', title: "Error", description: "Please provide a reason for rejection." });
       return;
     }

    setUpdatingId(currentLandlordId);
    setDialogOpen(false); // Close dialog immediately

    const result = await updateLandlordStatus(currentLandlordId, 'rejected', rejectionReason);
    if (result.success) {
      setLandlords(prev => prev.filter(l => l.id !== currentLandlordId)); // Remove from pending list
      toast({ title: "Success", description: "Landlord rejected successfully." });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to reject landlord." });
    }
     setUpdatingId(null);
     setRejectionReason(''); // Clear reason
     setCurrentLandlordId(null); // Clear current landlord ID
  };

  const openRejectDialog = (id: string) => {
    setCurrentLandlordId(id);
    setRejectionReason(''); // Clear previous reason
    setDialogOpen(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (landlords.length === 0) {
     return <p className="text-center text-muted-foreground py-10">No pending landlord verifications.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {landlords.map((landlord) => (
            <TableRow key={landlord.id}>
              <TableCell className="font-medium">{landlord.name}</TableCell>
              <TableCell>{landlord.email}</TableCell>
              <TableCell>{landlord.submittedAt.toLocaleDateString()}</TableCell>
              <TableCell>
                 <div className="flex gap-2">
                   {/* TODO: Implement actual document viewing/downloading */}
                   <Button variant="outline" size="sm" asChild>
                       <a href={landlord.idDocumentUrl} target="_blank" rel="noopener noreferrer">
                           <Eye className="mr-1 h-4 w-4" /> ID Card
                       </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a href={landlord.ownershipDocumentUrl} target="_blank" rel="noopener noreferrer">
                           <Download className="mr-1 h-4 w-4" /> Ownership Proof
                        </a>
                    </Button>
                 </div>
              </TableCell>
              <TableCell className="text-right">
                 <div className="flex gap-2 justify-end">
                     <Button
                       variant="ghost"
                       size="sm"
                       className="text-green-600 hover:bg-green-100 hover:text-green-700"
                       onClick={() => handleApprove(landlord.id)}
                       disabled={updatingId === landlord.id}
                     >
                        {updatingId === landlord.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle className="h-4 w-4" />}
                        <span className="ml-1">Approve</span>
                     </Button>
                    <Button
                       variant="ghost"
                       size="sm"
                       className="text-red-600 hover:bg-red-100 hover:text-red-700"
                       onClick={() => openRejectDialog(landlord.id)}
                       disabled={updatingId === landlord.id}
                    >
                       {updatingId === landlord.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <XCircle className="h-4 w-4" />}
                       <span className="ml-1">Reject</span>
                    </Button>
                 </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Rejection Reason Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Reject Landlord Verification</DialogTitle>
             <DialogDescription>
               Please provide a reason for rejecting this landlord's verification request. This reason may be shared with the landlord.
             </DialogDescription>
           </DialogHeader>
           <div className="grid gap-4 py-4">
             <Input
               id="rejectionReason"
               placeholder="e.g., Invalid ID document, Ownership proof unclear"
               value={rejectionReason}
               onChange={(e) => setRejectionReason(e.target.value)}
               className="col-span-3"
             />
           </div>
           <DialogFooter>
              <DialogClose asChild>
                 <Button type="button" variant="outline" onClick={() => setCurrentLandlordId(null)}>Cancel</Button>
              </DialogClose>
             <Button type="button" variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim() || !!updatingId}>
               {updatingId === currentLandlordId ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
               Confirm Rejection
             </Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>
    </>
  );
}
