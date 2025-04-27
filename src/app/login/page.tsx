'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { useState } from 'react'; // Import useState

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
import { Loader2 } from 'lucide-react'; // Import Loader2

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, { // Password can't be empty for login
    message: 'Password is required.',
  }),
});

export default function LoginPage() {
   const { toast } = useToast();
   const router = useRouter(); // Initialize router
   const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true); // Start loading indicator
    console.log('Attempting login with:', values);

    // --- Start: Placeholder for Actual Login Logic ---
    // TODO: Replace this simulation with your actual authentication API call.
    // Example:
    // try {
    //   const response = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(values),
    //   });
    //   if (!response.ok) {
    //     throw new Error('Login failed');
    //   }
    //   const user = await response.json();
    //   // Handle successful login (e.g., store token, redirect)
    //   toast({ title: "Login Successful!", description: "Welcome back!" });
    //   router.push('/dashboard'); // Redirect to dashboard or appropriate page
    // } catch (error) {
    //   console.error('Login error:', error);
    //   toast({ variant: 'destructive', title: "Login Failed", description: "Invalid email or password." });
    // } finally {
    //   setIsLoading(false);
    // }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    // --- End: Placeholder for Actual Login Logic ---

    // Simulate successful login for now
    toast({
      title: "Login Successful! (Simulated)",
      description: "Welcome back to CribDirect. Redirecting...",
    });
    form.reset();

     // Simulate redirect after a short delay
     setTimeout(() => {
       // Replace '/' with the actual post-login destination, e.g., '/dashboard'
       router.push('/');
       setIsLoading(false); // Stop loading indicator after redirection logic starts
     }, 1000);

     // Keep loading indicator until redirection logic starts
     // setIsLoading(false); // Moved inside setTimeout
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
