'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, { // Password can't be empty for login
    message: 'Password is required.',
  }),
});

// Define User Roles
type UserRole = 'admin' | 'landlord' | 'tenant' | null;

// Hardcoded credentials for simulation
const adminCredentials = { email: 'Admin@cribdirect.com', password: 'Pass=1010', role: 'admin' as UserRole };
const landlordCredentials = { email: 'landlord@test.com', password: 'Pass=1010', role: 'landlord' as UserRole };
const tenantCredentials = { email: 'user@test.com', password: 'Pass=1010', role: 'tenant' as UserRole };


export default function LoginPage() {
   const { toast } = useToast();
   const router = useRouter();
   const [isLoading, setIsLoading] = useState(false);

   // Clear session storage on component mount to ensure fresh login state
   useEffect(() => {
     try {
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('isLoggedIn');
     } catch (error) {
        console.error("Error clearing sessionStorage:", error);
        // Non-critical error, maybe log it
     }
   }, []);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log('Attempting login with:', values);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let loginSuccess = false;
    let userRole: UserRole = null;
    let redirectPath = '/';

    // Check against hardcoded credentials
    if (values.email === adminCredentials.email && values.password === adminCredentials.password) {
        loginSuccess = true;
        userRole = adminCredentials.role;
        redirectPath = '/admin/dashboard';
        console.log("Admin login simulated");
    } else if (values.email === landlordCredentials.email && values.password === landlordCredentials.password) {
      loginSuccess = true;
      userRole = landlordCredentials.role;
      redirectPath = '/landlord/dashboard'; // Redirect landlord to their dashboard
      console.log("Landlord login simulated");
    } else if (values.email === tenantCredentials.email && values.password === tenantCredentials.password) {
      loginSuccess = true;
      userRole = tenantCredentials.role;
      redirectPath = '/listings'; // Redirect tenant to listings page
      console.log("Tenant login simulated");
    }

    if (loginSuccess && userRole) {
      // Simulate successful login by setting session storage
      try {
         sessionStorage.setItem('isLoggedIn', 'true');
         sessionStorage.setItem('userRole', userRole);
      } catch (error) {
         console.error("Failed to set sessionStorage:", error);
         toast({
            variant: 'destructive',
            title: "Login Error",
            description: "Could not save login session. Please check browser settings.",
         });
         setIsLoading(false);
         return;
      }

      toast({
        title: "Login Successful!",
        description: `Welcome back ${userRole}. Redirecting...`,
      });
      form.reset();

      // Redirect after a short delay
      setTimeout(() => {
        router.push(redirectPath);
        router.refresh(); // Force refresh to update header state based on session storage
      }, 1000);
       // Keep loading indicator until redirect starts
    } else {
      // Simulate failed login
      toast({
        variant: 'destructive',
        title: "Login Failed",
        description: "Invalid email or password.",
      });
      setIsLoading(false); // Stop loading indicator on failure
    }
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Log in to your CribDirect account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} disabled={isLoading} />
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
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                    </FormControl>
                     <div className="text-right">
                       <Link href="/forgot-password" // TODO: Create this page later
                             className={cn(
                               "text-sm font-medium text-primary hover:underline",
                               isLoading && "pointer-events-none opacity-50" // Disable link while loading
                              )}>
                         Forgot password?
                       </Link>
                     </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
             Don't have an account?{' '}
             <Link href="/register" className={cn(
                "font-medium text-primary hover:underline",
                isLoading && "pointer-events-none opacity-50" // Disable link while loading
                )}>
               Sign up here
             </Link>
           </p>
        </CardContent>
      </Card>
    </div>
  );
}
