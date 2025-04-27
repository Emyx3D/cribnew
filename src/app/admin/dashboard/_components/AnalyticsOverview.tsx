'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Home, Eye, MessageSquare, Loader2 } from "lucide-react";

// Define types for Analytics data
type AnalyticsData = {
  totalUsers: number;
  totalLandlords: number;
  totalTenants: number;
  activeListings: number;
  pendingVerifications: number;
  totalListingViews: number; // Example: Over last 30 days
  totalContactsInitiated: number; // Example: Over last 30 days
};

// Simulate fetching real-time analytics - Replace with actual API endpoint
async function fetchAnalytics(): Promise<AnalyticsData> {
  console.log("Fetching analytics...");
  // Replace this with your actual API endpoint
  //const response = await fetch('/api/analytics');
  //const data = await response.json();

  // Simulate API delay (remove in production)
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock data for demonstration
  return {
    totalUsers: Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000, // Users between 1000 and 2000
    totalLandlords: Math.floor(Math.random() * (300 - 100 + 1)) + 100, // Landlords between 100 and 300
    totalTenants: Math.floor(Math.random() * (1700 - 900 + 1)) + 900,  // Tenants between 900 and 1700
    activeListings: Math.floor(Math.random() * (600 - 300 + 1)) + 300,  // Listings between 300 and 600
    pendingVerifications: Math.floor(Math.random() * 5), // 0 to 4 verifications
    totalListingViews: Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000, // Views between 10k and 30k
    totalContactsInitiated: Math.floor(Math.random() * (2000 - 500 + 1)) + 500, // Contacts between 500 and 2k
  };
}

export function AnalyticsOverview() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch analytics on component mount and set interval to update in real-time
  useEffect(() => {
    const getAnalytics = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAnalytics();
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setIsLoading(false);
      }
    };

    // Get analytics initially
    getAnalytics();

    // Set interval to update analytics every 30 seconds (adjust as needed)
    const intervalId = setInterval(getAnalytics, 30000); // 30 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
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
