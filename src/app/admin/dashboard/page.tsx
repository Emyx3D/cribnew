'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandlordVerificationTable } from "./_components/LandlordVerificationTable";
import { ManageUsersTable } from "./_components/ManageUsersTable";
import { FlaggedListingsTable } from "./_components/FlaggedListingsTable";
import { AnalyticsOverview } from "./_components/AnalyticsOverview";
import { ManageStaffTable } from "./_components/ManageStaffTable";
import { ManageAdvertsTable } from "./_components/ManageAdvertsTable"; // Import the new Adverts component
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"; // Import Button
import { ArrowLeft } from "lucide-react"; // Import ArrowLeft


export default function AdminDashboardPage() {
  const router = useRouter();

  // Authentication check: Ensure only admins can access this page
   useEffect(() => {
     try {
       const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
       const userRole = sessionStorage.getItem('userRole');

       if (!isLoggedIn || userRole !== 'admin') {
         console.warn('Unauthorized access attempt to admin dashboard.');
         router.push('/login'); // Redirect non-admins to login
       }
     } catch (error) {
       console.error("Error accessing sessionStorage for auth check:", error);
       router.push('/login'); // Redirect if storage access fails
     }
   }, [router]);


  return (
    <div className="container mx-auto px-4 py-12">
       {/* Back Button */}
       <Button variant="outline" size="sm" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
       </Button>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="verification" className="w-full">
        {/* Adjusted grid columns to accommodate the new tab */}
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-6">
          <TabsTrigger value="verification">Landlord Verification</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="listings">Flagged Listings</TabsTrigger>
          <TabsTrigger value="staff">Manage Staff</TabsTrigger>
          <TabsTrigger value="adverts">Adverts</TabsTrigger> {/* New Tab Trigger */}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Pending Landlord Verifications</CardTitle>
              <CardDescription>
                Review submitted documents and approve or reject landlord applications.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LandlordVerificationTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>
                View user accounts (tenants and landlords). Suspend or deactivate accounts if necessary.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManageUsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Property Listings</CardTitle>
              <CardDescription>
                Review listings reported by users for potential issues (e.g., fake listings, incorrect details).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlaggedListingsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff">
          <Card>
            <CardHeader>
              <CardTitle>Manage Staff Accounts</CardTitle>
              <CardDescription>
                Add, remove, or manage staff members who can access the admin dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManageStaffTable />
            </CardContent>
          </Card>
        </TabsContent>

         {/* New Tab Content for Adverts */}
        <TabsContent value="adverts">
          <Card>
            <CardHeader>
              <CardTitle>Manage Advertisements</CardTitle>
              <CardDescription>
                Create, edit, and manage ad banners displayed on the landing and listing pages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ManageAdvertsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Platform Analytics</CardTitle>
              <CardDescription>
                Overview of key metrics like user registrations, property views, and contact rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsOverview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
