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
import { Trash2, KeyRound, UserPlus, Loader2, Pencil } from "lucide-react";
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Schema for adding/editing staff
const staffFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').optional(), // Optional on edit
  confirmPassword: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
});

// Schema specifically for changing password
const changePasswordSchema = z.object({
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"],
});

type StaffFormValues = z.infer<typeof staffFormSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;


// TODO: Define types for Staff data (replace with actual types)
type StaffAccount = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support'; // Example roles
  lastLogin?: Date; // Optional
};

// --- Mock API Functions ---
// TODO: Replace with actual API calls

async function fetchStaffAccounts(): Promise<StaffAccount[]> {
  console.log("Fetching staff accounts...");
  await new Promise(resolve => setTimeout(resolve, 800));
  return [
    { id: 'staff1', name: 'Admin Primary', email: 'Admin@cribdirect.com', role: 'admin', lastLogin: new Date(Date.now() - 3600000) },
    { id: 'staff2', name: 'Support Sally', email: 'sally@support.com', role: 'support', lastLogin: new Date(Date.now() - 86400000) },
  ];
}

async function addStaffAccount(data: StaffFormValues): Promise<{ success: boolean; error?: string; newStaff?: StaffAccount }> {
   console.log("Adding staff account:", data);
   await new Promise(resolve => setTimeout(resolve, 600));
   // Simulate email conflict
   if (data.email === 'existing@test.com') {
      return { success: false, error: "Email already in use." };
   }
   const newStaff: StaffAccount = {
     id: `staff${Math.random().toString(36).substring(7)}`,
     name: data.name,
     email: data.email,
     role: 'support', // Default to support, or add role selection
     lastLogin: undefined,
   };
   return { success: true, newStaff };
}

async function removeStaffAccount(id: string): Promise<{ success: boolean; error?: string }> {
   console.log("Removing staff account:", id);
   await new Promise(resolve => setTimeout(resolve, 400));
   // Simulate removing the primary admin fails
   if (id === 'staff1') {
      return { success: false, error: "Cannot remove the primary admin account." };
   }
   return { success: true };
}

async function changeStaffPassword(id: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
   console.log(`Changing password for staff ${id}`);
   await new Promise(resolve => setTimeout(resolve, 500));
   // Simulate failure case
   if (id === 'fail_pw_change') {
      return { success: false, error: "Failed to update password on server." };
   }
   return { success: true };
}
// --- End Mock API Functions ---


export function ManageStaffTable() {
  const [staffList, setStaffList] = useState<StaffAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // For dialog forms
  const [dialogOpen, setDialogOpen] = useState(false); // For Add Staff dialog
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false); // For Change Password dialog
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
          newPassword: '',
          confirmNewPassword: '',
      },
  });

  useEffect(() => {
    fetchStaffAccounts()
      .then(data => {
         setStaffList(data);
         setIsLoading(false);
      })
      .catch(error => {
         console.error("Error fetching staff accounts:", error);
         toast({ variant: 'destructive', title: "Error", description: "Could not fetch staff accounts." });
         setIsLoading(false);
      });
  }, [toast]);

  const handleAddStaff: SubmitHandler<StaffFormValues> = async (data) => {
    setIsSubmitting(true);
    if (!data.password) { // Ensure password is required for adding new staff
        form.setError("password", { type: "manual", message: "Password is required." });
        setIsSubmitting(false);
        return;
    }
    const result = await addStaffAccount(data);
    if (result.success && result.newStaff) {
      setStaffList(prev => [...prev, result.newStaff!]);
      toast({ title: "Success", description: "Staff account added successfully." });
      setDialogOpen(false);
      form.reset();
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to add staff account." });
    }
    setIsSubmitting(false);
  };

  const handleRemoveStaff = async (id: string) => {
     // Add a confirmation dialog here in a real app
     const staffToRemove = staffList.find(s => s.id === id);
     if (!confirm(`Are you sure you want to remove staff member "${staffToRemove?.name}"?`)) {
         return;
     }

     setIsLoading(true); // Use main loading indicator for table updates
     const result = await removeStaffAccount(id);
     if (result.success) {
         setStaffList(prev => prev.filter(s => s.id !== id));
         toast({ title: "Success", description: "Staff account removed successfully." });
     } else {
         toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to remove staff account." });
     }
     setIsLoading(false);
  };

   const openPasswordDialog = (staffId: string) => {
        setSelectedStaffId(staffId);
        passwordForm.reset();
        setPasswordDialogOpen(true);
    };

  const handleChangePassword: SubmitHandler<ChangePasswordFormValues> = async (data) => {
     if (!selectedStaffId) return;
     setIsSubmitting(true);
     const result = await changeStaffPassword(selectedStaffId, data.newPassword);
     if (result.success) {
         toast({ title: "Success", description: "Password changed successfully." });
         setPasswordDialogOpen(false);
     } else {
         toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to change password." });
     }
     setIsSubmitting(false);
     setSelectedStaffId(null);
  };

  if (isLoading && staffList.length === 0) { // Show loader only on initial load
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>
              <UserPlus className="mr-2 h-4 w-4" /> Add New Staff
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
              <DialogDescription>
                Enter the details for the new staff account.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddStaff)} className="space-y-4 py-4">
                 <FormField
                   control={form.control}
                   name="name"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Full Name</FormLabel>
                       <FormControl>
                         <Input placeholder="Staff Member Name" {...field} disabled={isSubmitting} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                  <FormField
                   control={form.control}
                   name="email"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email Address</FormLabel>
                       <FormControl>
                         <Input type="email" placeholder="staff@example.com" {...field} disabled={isSubmitting}/>
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
                         <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting}/>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   control={form.control}
                   name="confirmPassword"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Confirm Password</FormLabel>
                       <FormControl>
                         <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting}/>
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 {/* TODO: Add Role Selection if needed */}
                <DialogFooter>
                    <DialogClose asChild>
                       <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Add Staff
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

       {staffList.length === 0 && !isLoading ? (
         <p className="text-center text-muted-foreground py-10">No staff accounts found.</p>
       ) : (
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Name</TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Role</TableHead>
               <TableHead>Last Login</TableHead>
               <TableHead className="text-right">Actions</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {staffList.map((staff) => (
               <TableRow key={staff.id}>
                 <TableCell className="font-medium">{staff.name}</TableCell>
                 <TableCell>{staff.email}</TableCell>
                 <TableCell className="capitalize">{staff.role}</TableCell>
                 <TableCell>{staff.lastLogin ? staff.lastLogin.toLocaleString() : 'Never'}</TableCell>
                 <TableCell className="text-right">
                   <div className="flex gap-2 justify-end">
                      {/* TODO: Add Edit Staff functionality similar to Add */}
                      {/* <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700" disabled={isLoading}>
                           <Pencil className="h-4 w-4" />
                      </Button> */}
                      <Button
                         variant="ghost"
                         size="icon"
                         className="text-yellow-600 hover:text-yellow-700"
                         onClick={() => openPasswordDialog(staff.id)}
                         disabled={isLoading}
                         title="Change Password"
                       >
                         <KeyRound className="h-4 w-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="text-red-600 hover:text-red-700"
                         onClick={() => handleRemoveStaff(staff.id)}
                         disabled={isLoading || staff.email === 'Admin@cribdirect.com'} // Disable removing primary admin
                         title="Remove Staff"
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

        {/* Change Password Dialog */}
        <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Staff Password</DialogTitle>
                    <DialogDescription>
                        Enter a new password for the selected staff member.
                    </DialogDescription>
                </DialogHeader>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4 py-4">
                        <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={passwordForm.control}
                            name="confirmNewPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <DialogFooter>
                            <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setSelectedStaffId(null)}>Cancel</Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Change Password
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    </div>
  );
}
