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
import { FileCheck, UserSquare } from 'lucide-react'; // Removed Upload, kept FileCheck and UserSquare
import { useState } from 'react';
// TODO: Import actual server action for registration
// import { registerLandlord } from '@/actions/authActions';

// Define maximum file size (e.g., 5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;
// Define acceptable file types
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

// Custom file validation function
const validateFile = (files: FileList | undefined | null, acceptedTypes: string[], maxSize: number) => {
  if (!files || files.length === 0) return "File is required.";
  const file = files[0];
  if (file.size > maxSize) return `File size should be less than ${maxSize / 1024 / 1024}MB.`;
  if (!acceptedTypes.includes(file.type)) return `Only ${acceptedTypes.map(t => t.split('/')[1]).join(', ')} formats are supported.`;
  return true; // Validation passed
};


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
  validIdCard: z.custom<FileList>()
    .refine(files => validateFile(files, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE) === true, {
       message: (files) => validateFile(files, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE) as string // Show the specific error message
    })
    .describe("Valid Government Issued ID Card (e.g., NIN Slip, Driver's License)"),
  proofOfOwnership: z.custom<FileList>()
   .refine(files => validateFile(files, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE) === true, {
      message: (files) => validateFile(files, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE) as string // Show the specific error message
   })
   .describe("Proof of Property Ownership (e.g., C of O, Deed of Assignment)")
});


export default function LandlordRegisterPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [idFileName, setIdFileName] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      validIdCard: undefined,
      proofOfOwnership: undefined,
    },
     mode: "onChange", // Validate on change to give immediate feedback
  });

  // Get refs for file inputs using register
  const idFileRef = form.register("validIdCard");
  const proofFileRef = form.register("proofOfOwnership");

  async function onSubmit(values: z.infer<typeof formSchema>) {
     setIsLoading(true);
    console.log('Form Values:', values);
    const validIdFile = values.validIdCard[0];
    const proofFile = values.proofOfOwnership[0];
    console.log('Valid ID File:', validIdFile);
    console.log('Proof of Ownership File:', proofFile);

    // TODO: Implement actual landlord registration and document upload logic
    // This will involve sending the form data AND the files to your backend API
    // using a server action or API route.
    // Example using a hypothetical server action:
    /*
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('password', values.password);
      formData.append('validIdCard', validIdFile);
      formData.append('proofOfOwnership', proofFile);

      // const result = await registerLandlord(formData); // Replace with your actual server action

      // if (result.success) {
          toast({
            title: "Registration Submitted!",
            description: "Your landlord account request and documents have been submitted for verification. We'll notify you via email once approved.",
            variant: "default",
          });
          form.reset(); // Reset form
          setIdFileName(null); // Clear ID file name display
          setProofFileName(null); // Clear proof file name display
      // } else {
      //   toast({
      //     title: "Registration Failed",
      //     description: result.error || "An error occurred. Please try again.",
      //     variant: "destructive",
      //   });
      // }

    } catch (error) {
       console.error("Registration error:", error);
       toast({
         title: "Registration Failed",
         description: "An unexpected error occurred. Please try again later.",
         variant: "destructive",
       });
    } finally {
       setIsLoading(false);
    }
    */

    // Simulate API call delay and success for now
     await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
            title: "Registration Submitted!",
            description: "Your landlord account request and documents have been submitted for verification. We'll notify you via email once approved.", // Updated message
            variant: "default",
      });
     form.reset(); // Reset form
     setIdFileName(null); // Clear ID file name display
     setProofFileName(null); // Clear proof file name display
     setIsLoading(false);

     // TODO: Optionally redirect to a "pending verification" page or dashboard
     // router.push('/landlord/pending');
  }

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Become a Landlord on CribDirect</CardTitle>
          <CardDescription>Register and upload your documents for verification to start listing.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Fields */}
               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Landlord's Full Name" {...field} disabled={isLoading}/>
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
                         <Input type="email" placeholder="landlord@example.com" {...field} disabled={isLoading}/>
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
                         <Input type="tel" placeholder="08012345678" {...field} disabled={isLoading}/>
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
                      <Input type="password" placeholder="••••••••" {...field} disabled={isLoading}/>
                    </FormControl>
                     <FormDescription>
                        Must be at least 8 characters long.
                      </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Valid ID Card Upload */}
               <FormField
                control={form.control}
                name="validIdCard"
                render={() => ( // Removed field destructuring as we use register ref
                  <FormItem>
                    <FormLabel>Valid ID Card</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input
                          id="validIdCard"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // Hide default input, make area clickable
                           accept={ACCEPTED_FILE_TYPES.join(",")} // Specify acceptable file types
                          // Use onChange from the ref provided by register
                          onChange={(e) => {
                             idFileRef.onChange(e); // Call the original onChange from register
                             form.setValue('validIdCard', e.target.files as FileList, { shouldValidate: true }); // Manually update form value and trigger validation
                             setIdFileName(e.target.files?.[0]?.name ?? null); // Update displayed file name
                          }}
                          onBlur={idFileRef.onBlur} // Use onBlur from register
                          name={idFileRef.name} // Use name from register
                          ref={idFileRef.ref} // Use the ref from register
                          disabled={isLoading}
                        />
                        <div className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md border-input bg-background hover:bg-muted cursor-pointer relative ${form.formState.errors.validIdCard ? 'border-destructive' : ''}`}>
                           {idFileName ? (
                             <p className="text-sm text-foreground px-4 text-center">{idFileName}</p>
                           ) : (
                             <div className="text-center text-muted-foreground">
                                <UserSquare className="mx-auto h-8 w-8 mb-2" />
                                <p>Click or drag ID file</p>
                                <p className="text-xs">(PDF, JPG, PNG - Max 5MB)</p>
                             </div>
                           )}
                        </div>
                       </div>
                    </FormControl>
                    <FormDescription>
                      Upload NIN Slip, Driver's License, Voter's Card, or International Passport.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

               {/* Proof of Ownership Upload */}
              <FormField
                control={form.control}
                name="proofOfOwnership"
                render={() => ( // Removed field destructuring as we use register ref
                  <FormItem>
                    <FormLabel>Proof of Property Ownership</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input
                          id="proofOfOwnership"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // Hide default input, make area clickable
                          accept={ACCEPTED_FILE_TYPES.join(",")} // Specify acceptable file types
                          // Use onChange from the ref provided by register
                          onChange={(e) => {
                             proofFileRef.onChange(e); // Call the original onChange from register
                             form.setValue('proofOfOwnership', e.target.files as FileList, { shouldValidate: true }); // Manually update form value and trigger validation
                             setProofFileName(e.target.files?.[0]?.name ?? null); // Update displayed file name
                          }}
                          onBlur={proofFileRef.onBlur} // Use onBlur from register
                          name={proofFileRef.name} // Use name from register
                          ref={proofFileRef.ref} // Use the ref from register
                          disabled={isLoading}
                        />
                       <div className={`flex items-center justify-center w-full h-24 border-2 border-dashed rounded-md border-input bg-background hover:bg-muted cursor-pointer relative ${form.formState.errors.proofOfOwnership ? 'border-destructive' : ''}`}>
                           {proofFileName ? (
                             <p className="text-sm text-foreground px-4 text-center">{proofFileName}</p>
                           ) : (
                             <div className="text-center text-muted-foreground">
                               <FileCheck className="mx-auto h-8 w-8 mb-2" /> {/* Changed icon */}
                               <p>Click or drag ownership proof</p>
                               <p className="text-xs">(PDF, JPG, PNG - Max 5MB)</p>
                             </div>
                           )}
                        </div>
                       </div>
                    </FormControl>
                    <FormDescription>
                      Upload C of O, Deed of Assignment, Tenancy Agreement (if subletting), or similar proof.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Register as Landlord"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have a landlord account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login here
            </Link>
          </p>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Looking to rent?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up as a Tenant
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
