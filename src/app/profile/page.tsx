'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Helper to get initials
const getInitials = (name?: string | null) => {
    if (!name) return 'U'; // Default to 'U' for User
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

type UserRole = 'admin' | 'landlord' | 'tenant' | null;

export default function ProfilePage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // State for user profile data
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhone, setUserPhone] = useState(''); // Assuming phone is part of profile
    const [userRole, setUserRole] = useState<UserRole>(null);

    // Load user data from session storage on mount
    useEffect(() => {
        try {
            const loggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
            if (!loggedIn) {
                router.push('/login'); // Redirect if not logged in
                return;
            }

            setUserName(sessionStorage.getItem('userName') || '');
            setUserEmail(sessionStorage.getItem('userEmail') || ''); // Assuming email is stored
            setUserPhone(sessionStorage.getItem('userPhone') || ''); // Assuming phone is stored
            setUserRole(sessionStorage.getItem('userRole') as UserRole);
        } catch (error) {
            console.error("Error loading profile data from sessionStorage:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not load profile data." });
            router.push('/login'); // Redirect on error
        }
    }, [router, toast]);

    const handleSaveChanges = async () => {
        setIsLoading(true);
        // TODO: Implement actual API call to update profile data
        console.log("Saving profile:", { userName, userEmail, userPhone });
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay

        try {
            // Update sessionStorage (in a real app, API would handle this)
            sessionStorage.setItem('userName', userName);
            sessionStorage.setItem('userEmail', userEmail);
            sessionStorage.setItem('userPhone', userPhone);

            toast({ title: "Success", description: "Profile updated successfully." });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving profile data:", error);
            toast({ variant: 'destructive', title: "Error", description: "Could not save profile changes." });
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleIcon = () => {
        switch (userRole) {
            case 'admin': return <ShieldCheck className="w-4 h-4 text-red-600" />;
            case 'landlord': return <LayoutDashboard className="w-4 h-4 text-blue-600" />;
            case 'tenant': return <User className="w-4 h-4 text-green-600" />;
            default: return null;
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <Card className="shadow-lg">
                <CardHeader className="items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                        {/* <AvatarImage src="/path/to/avatar.png" alt={userName} /> */}
                        <AvatarFallback className="text-4xl">{getInitials(userName)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-2xl">{userName}</CardTitle>
                    <CardDescription className="flex items-center justify-center gap-1">
                        {getRoleIcon()}
                        <span className="capitalize">{userRole || 'User'}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    disabled={!isEditing || isLoading}
                                    className={!isEditing ? "border-none p-0 h-auto shadow-none" : ""}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                             <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    disabled // Usually email is not editable or requires verification
                                    className="border-none p-0 h-auto shadow-none text-muted-foreground"
                                />
                             </div>
                             {/* <p className="text-xs text-muted-foreground">Email cannot be changed.</p> */}
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                             <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={userPhone}
                                    onChange={(e) => setUserPhone(e.target.value)}
                                    disabled={!isEditing || isLoading}
                                     className={!isEditing ? "border-none p-0 h-auto shadow-none" : ""}
                                />
                             </div>
                        </div>
                        {/* TODO: Add Password Change section */}
                    </div>

                    <div className="flex justify-end gap-2">
                        {isEditing ? (
                            <>
                                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveChanges} disabled={isLoading}>
                                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Save Changes
                                </Button>
                            </>
                        ) : (
                            <Button onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}