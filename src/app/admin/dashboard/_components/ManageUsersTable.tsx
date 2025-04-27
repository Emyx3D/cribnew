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
import { UserX, UserCheck, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // For search/filter

// TODO: Define types for User data (replace with actual types from backend/DB)
type UserAccount = {
  id: string;
  name: string;
  email: string;
  role: 'tenant' | 'landlord';
  status: 'active' | 'suspended' | 'pending_verification'; // Added pending state for landlords
  joinedAt: Date;
};

// TODO: Replace with actual API call to fetch users
async function fetchUsers(): Promise<UserAccount[]> {
  console.log("Fetching users...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  // Return mock data
  return [
    { id: 'user1', name: 'Tenant Tom', email: 'tom@tenant.com', role: 'tenant', status: 'active', joinedAt: new Date(Date.now() - 86400000 * 5) },
    { id: 'landlord1_approved', name: 'Alice Wonderland', email: 'alice@example.com', role: 'landlord', status: 'active', joinedAt: new Date(Date.now() - 86400000 * 3) },
    { id: 'landlord2_pending', name: 'Bob The Builder', email: 'bob@example.com', role: 'landlord', status: 'pending_verification', joinedAt: new Date(Date.now() - 86400000 * 2) },
    { id: 'user2_suspended', name: 'Suspicious Stan', email: 'stan@spam.com', role: 'tenant', status: 'suspended', joinedAt: new Date(Date.now() - 86400000) },
    { id: 'landlord3_rejected', name: 'Charlie Chaplin', email: 'charlie@example.com', role: 'landlord', status: 'suspended', joinedAt: new Date() }, // Assuming rejected means suspended for simplicity
  ];
}

// TODO: Replace with actual API call to update user status
async function updateUserStatus(id: string, newStatus: 'active' | 'suspended'): Promise<{ success: boolean; error?: string }> {
  console.log(`Updating user ${id} status to ${newStatus}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  // Simulate success/failure
  if (id === 'fail_case_id') {
     return { success: false, error: "Simulated server error." };
  }
  return { success: true };
}

export function ManageUsersTable() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'tenant' | 'landlord'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'suspended' | 'pending_verification'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers()
      .then(data => {
         setUsers(data);
         setFilteredUsers(data); // Initialize filtered list
         setIsLoading(false);
      })
      .catch(error => {
         console.error("Error fetching users:", error);
         toast({ variant: 'destructive', title: "Error", description: "Could not fetch user accounts." });
         setIsLoading(false);
      });
  }, [toast]);

  // Filter logic
  useEffect(() => {
    let result = users;

    // Filter by search term (name or email)
    if (searchTerm) {
      result = result.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (filterRole !== 'all') {
       result = result.filter(user => user.role === filterRole);
    }

     // Filter by status
     if (filterStatus !== 'all') {
        result = result.filter(user => user.status === filterStatus);
     }


    setFilteredUsers(result);
  }, [searchTerm, filterRole, filterStatus, users]);


  const handleStatusToggle = async (id: string, currentStatus: 'active' | 'suspended' | 'pending_verification') => {
    if (currentStatus === 'pending_verification') {
       toast({ variant: 'default', title: "Info", description: "Landlord status managed in Verification tab." });
       return; // Don't allow toggling for pending users here
    }

    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    setUpdatingId(id);
    const result = await updateUserStatus(id, newStatus);

    if (result.success) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      toast({ title: "Success", description: `User ${newStatus === 'active' ? 'activated' : 'suspended'} successfully.` });
    } else {
      toast({ variant: 'destructive', title: "Error", description: result.error || "Failed to update user status." });
    }
    setUpdatingId(null);
  };

  const getStatusBadgeVariant = (status: UserAccount['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
       case 'active': return 'secondary'; // Use secondary for active, maybe green bg/border?
       case 'suspended': return 'destructive';
       case 'pending_verification': return 'outline'; // Use outline for pending
       default: return 'default';
     }
  }

  const getStatusText = (status: UserAccount['status']): string => {
      switch (status) {
          case 'active': return 'Active';
          case 'suspended': return 'Suspended';
          case 'pending_verification': return 'Pending Verification';
          default: return status;
      }
  }


  return (
    <div className="space-y-4">
       {/* Filter Controls */}
       <div className="flex flex-col md:flex-row gap-4">
          <Input
             placeholder="Search by name or email..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="max-w-sm"
          />
          {/* Add Select components for role and status filters if needed */}
          {/* Example (using basic selects for brevity): */}
          <select
             value={filterRole}
             onChange={(e) => setFilterRole(e.target.value as any)}
             className="border rounded px-2 py-1 h-10 bg-background text-sm" // Basic styling
          >
             <option value="all">All Roles</option>
             <option value="tenant">Tenant</option>
             <option value="landlord">Landlord</option>
          </select>
          <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="border rounded px-2 py-1 h-10 bg-background text-sm" // Basic styling
           >
             <option value="all">All Statuses</option>
             <option value="active">Active</option>
             <option value="suspended">Suspended</option>
             <option value="pending_verification">Pending Verification</option>
          </select>
       </div>

       {isLoading ? (
         <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>
       ) : filteredUsers.length === 0 ? (
           <p className="text-center text-muted-foreground py-10">No users found matching the criteria.</p>
       ) : (
         <Table>
           <TableHeader>
             <TableRow>
               <TableHead>Name</TableHead>
               <TableHead>Email</TableHead>
               <TableHead>Role</TableHead>
               <TableHead>Joined</TableHead>
               <TableHead>Status</TableHead>
               <TableHead className="text-right">Action (Activate/Suspend)</TableHead>
             </TableRow>
           </TableHeader>
           <TableBody>
             {filteredUsers.map((user) => (
               <TableRow key={user.id}>
                 <TableCell className="font-medium">{user.name}</TableCell>
                 <TableCell>{user.email}</TableCell>
                 <TableCell>
                    <Badge variant={user.role === 'landlord' ? 'default' : 'outline'}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                 </TableCell>
                 <TableCell>{user.joinedAt.toLocaleDateString()}</TableCell>
                 <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                        {getStatusText(user.status)}
                    </Badge>
                 </TableCell>
                 <TableCell className="text-right">
                   {user.status !== 'pending_verification' && (
                       <div className="flex items-center justify-end space-x-2">
                          {updatingId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                               <Label htmlFor={`status-switch-${user.id}`} className="text-sm">
                                {user.status === 'active' ? 'Active' : 'Suspended'}
                               </Label>
                               <Switch
                                id={`status-switch-${user.id}`}
                                checked={user.status === 'active'}
                                onCheckedChange={() => handleStatusToggle(user.id, user.status)}
                                disabled={updatingId === user.id}
                                aria-label={`Toggle status for ${user.name}`}
                               />
                             </>
                          )}
                       </div>
                   )}
                   {user.status === 'pending_verification' && (
                       <span className="text-xs text-muted-foreground italic">Managed in Verification</span>
                   )}
                 </TableCell>
               </TableRow>
             ))}
           </TableBody>
         </Table>
       )}
    </div>
  );
}
