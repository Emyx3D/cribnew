'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Eye, MessageSquare, Loader2 } from "lucide-react";
// TODO: Import chart components if needed, e.g., from shadcn/ui/chart

// TODO: Define types for Analytics data
type AnalyticsData = {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  activeListings: number;
  pendingVerifications: number;
  totalListingViews: number; // Example: Over last 30 days
  totalContactsInitiated: number; // Example: Over last 30 days
};

// TODO: Replace with actual API call to fetch analytics
async function fetchAnalytics(): Promise<AnalyticsData> {
  console.log("Fetching analytics...");
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
  // Return mock data
  return {
    totalUsers: 1578,
    totalLandlords: 235,
    totalTenants: 1343,
    activeListings: 450,
    pendingVerifications: 3, // Matches the landlord table example
    totalListingViews: 25678,
    totalContactsInitiated: 1890,
  };
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        setAnalytics(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return <p className="text-center text-red-600 py-10">{error}</p>;
  }

  if (!analytics) {
     return <p className="text-center text-muted-foreground py-10">No analytics data available.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {analytics.totalLandlords} Landlords, {analytics.totalTenants} Tenants
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.activeListings.toLocaleString()}</div>
           <p className="text-xs text-muted-foreground">
             {analytics.pendingVerifications} landlords pending verification
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Listing Views (30d)</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalListingViews.toLocaleString()}</div>
          {/* <p className="text-xs text-muted-foreground">+15% from last month</p> */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contacts Initiated (30d)</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analytics.totalContactsInitiated.toLocaleString()}</div>
           {/* <p className="text-xs text-muted-foreground">+8% from last month</p> */}
        </CardContent>
      </Card>

       {/* Placeholder for Charts */}
       {/* <Card className="col-span-1 md:col-span-2 lg:col-span-4">
         <CardHeader>
            <CardTitle className="text-lg font-medium">User Growth / Listing Activity</CardTitle>
         </CardHeader>
         <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            Chart Placeholder - Integrate Shadcn Charts here
         </CardContent>
       </Card> */}
    </div>
  );
}
