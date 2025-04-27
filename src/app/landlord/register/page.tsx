'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload } from 'lucide-react';
import { useState } from 'react';

// Basic schema, add specific file validation if needed (e.g., size, type)
// Note: Handling file uploads typically requires more complex client/server logic
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  propertyDocument: z.any() // Use 'any' for file input with react-hook-form, refine validation as needed
    .refine((files) => files?.length == 1, 'Property ownership document is required.')
    // Example: Add file type validation
    // .refine((files) => files?.[0]?.type.startsWith('application/pdf') || files?.[0]?.type.startsWith('image/'), 'Only PDF or image files are allowed.')
    // Example: Add file size validation (e.g., max 5MB)
    // .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, `File size should be less than 5MB.`),
});

export default function LandlordRegisterPage() {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      propertyDocument: undefined,
    },
  });

   const fileRef = form.register("propertyDocument");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement actual landlord registration and document upload logic
    // This will involve sending the form data AND the file to your backend API
    console.log('Form Values:', values);
    console.log('Uploaded File:', values.propertyDocument[0]);

    // Simulate API call success
    toast({
      title: "Registration Submitted!",
      description: "Your landlord account request and document have been submitted for verification. We'll notify you once approved.",
      variant: "default",
    });
     form.reset(); // Reset form
     setFileName(null); // Clear file name display
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Become a Landlord on CribDirect</CardTitle>
          <CardDescription>Register and upload your property document for verification to start listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Landlord's Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormField
                   control={form.control}
                   name="email"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email Address</FormLabel>
                       <FormControl>
                         <Input type="email" placeholder="landlord@example.com" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                   <FormField
                   control={form.control}
                   name="phone"
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Phone Number</FormLabel>
                       <FormControl>
                         <Input type="tel" placeholder="08012345678" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
               </div>

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                     <FormDescription>
                        Must be at least 8 characters long.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyDocument"
                render={({ field: { onChange, onBlur, name, ref } }) => ( // Use field render prop correctly
                  <FormItem>
                    <FormLabel>Property Ownership Document</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input
                          id="propertyDocument"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" // Hide default input, make area clickable
                           accept=".pdf, image/*" // Specify acceptable file types
                          onChange={(e) => {
                             onChange(e.target.files); // Pass FileList to react-hook-form
                             setFileName(e.target.files?.[0]?.name ?? null); // Update displayed file name
                          }}
                          onBlur={onBlur}
                          name={name}
                          ref={ref} // Use the ref provided by react-hook-form
                        />
                        <div className="flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md border-input bg-background hover:bg-muted cursor-pointer">
                           {fileName ? (
                             <p className="text-sm text-foreground">{fileName}</p>
                           ) : (
                             <div className="text-center text-muted-foreground">
                                <Upload className="mx-auto h-8 w-8 mb-2" />
                                <p>Click or drag file to upload</p>
                                <p className="text-xs">(PDF, JPG, PNG - Max 5MB)</p>
                             </div>
                           )}
                        </div>
                       </div>
                    </FormControl>
                    <FormDescription>
                      Upload C of O, Deed of Assignment, or similar proof of ownership. This is required for verification.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                Register as Landlord
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a landlord account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
