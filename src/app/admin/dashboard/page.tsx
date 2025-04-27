'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LandlordVerificationTable } from "./_components/LandlordVerificationTable";
import { ManageUsersTable } from "./_components/ManageUsersTable";
import { FlaggedListingsTable } from "./_components/FlaggedListingsTable";
import { AnalyticsOverview } from "./_components/AnalyticsOverview";

// TODO: Add authentication check here - ensure only admins can access this page

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <Tabs defaultValue="verification" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="verification">Landlord Verification</TabsTrigger>
          <TabsTrigger value="users">Manage Users</TabsTrigger>
          <TabsTrigger value="listings">Flagged Listings</TabsTrigger>
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
