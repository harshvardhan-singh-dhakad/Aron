'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/lib/mockData'; // Using mockData for categories for now
import { useToast } from '@/hooks/use-toast';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const formSchema = z.object({
  category: z.string({ required_error: "Please select a category." }).min(1),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional(),
  location: z.string().min(3, "Location is required."),
  contactNumber: z.string().min(10, "A valid 10-digit phone number is required.").max(13),

  // Sub-category (used by multiple categories)
  subCategory: z.string().optional(),

  // Rental specific
  price: z.coerce.number().optional(),
  priceUnit: z.enum(['hour', 'day', 'trip']).optional(),
  driverIncluded: z.boolean().default(false).optional(),

  // Job specific
  salary: z.string().optional(),
  experience: z.string().optional(),

  // Buy/Sell specific
  itemCondition: z.enum(['new', 'used_like_new', 'used_good', 'used_fair']).optional(),

}).refine((data) => {
    if (data.category === 'rent') {
      return !!data.subCategory && data.price !== undefined && !!data.priceUnit;
    }
    if (data.category === 'buy-sell') {
        return data.price !== undefined && !!data.itemCondition;
    }
    return true;
}, {
    message: "Please fill all the required details for the selected category.",
    path: ["subCategory"],
});

export function PostAdForm() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      description: '',
      location: 'Mhow, Indore',
      contactNumber: '',
      driverIncluded: false,
    },
  });

  const selectedCategory = form.watch('category');
  const currentCategory = categories.find(c => c.id === selectedCategory);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "You must be logged in to post an ad.",
        });
        return;
    }

    if (!firestore) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Firestore is not initialized.',
      });
      return;
    }

    const listingData = {
        ...values,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        isVerifiedPost: false, // This would be based on actual user verification status
    };

    try {
        await addDoc(collection(firestore, 'listings'), listingData);
        
        toast({
            title: "Ad Submitted!",
            description: "Your ad has been successfully submitted.",
        });
        form.reset();
    } catch (error) {
        console.error("Error creating listing:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Could not post your ad. Please try again.",
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category to post in" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {selectedCategory && (
            <>
                <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ad Title</FormLabel>
                        <FormControl><Input placeholder="e.g., Swaraj 855 Tractor for rent" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Describe your item or service in detail" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="contactNumber" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone Number</FormLabel>
                        <FormControl><Input type="tel" placeholder="e.g. 9876543210" {...field} /></FormControl>
                         <FormDescription>This number will be shown to interested users.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl><Input placeholder="e.g., Mhow, Indore" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                 {currentCategory && currentCategory.subCategories && currentCategory.subCategories.length > 0 && (
                    <FormField control={form.control} name="subCategory" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sub-category / Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder={`Select a type for ${currentCategory.name}`} /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {currentCategory.subCategories.map(sub => (
                                        <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                )}
            </>
        )}

        {selectedCategory === 'rent' && (
          <div className="p-4 border rounded-lg space-y-6">
            <h3 className="font-semibold text-lg">Rental Details</h3>
            <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rent Price (in ₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="900" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="priceUnit" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Per</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Unit" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="hour">Hour</SelectItem>
                                <SelectItem value="day">Day</SelectItem>
                                <SelectItem value="trip">Trip</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="driverIncluded" render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 pt-2">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <FormLabel>Driver Included</FormLabel>
                </FormItem>
             )} />
          </div>
        )}

        {selectedCategory === 'jobs' && (
             <div className="p-4 border rounded-lg space-y-6">
                <h3 className="font-semibold text-lg">Job Details</h3>
                 <FormField control={form.control} name="salary" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Salary</FormLabel>
                        <FormControl><Input placeholder="e.g., ₹15,000/month" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience Required</FormLabel>
                        <FormControl><Input placeholder="e.g., 2+ years" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
             </div>
        )}

        {selectedCategory === 'services' && (
             <div className="p-4 border rounded-lg space-y-6">
                <h3 className="font-semibold text-lg">Service Details</h3>
                <FormField control={form.control} name="experience" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Your Experience</FormLabel>
                        <FormControl><Input placeholder="e.g., 10+ years" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
             </div>
        )}

        {selectedCategory === 'buy-sell' && (
             <div className="p-4 border rounded-lg space-y-6">
                <h3 className="font-semibold text-lg">Item Details</h3>
                 <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Selling Price (in ₹)</FormLabel>
                        <FormControl><Input type="number" placeholder="e.g., 5000" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="itemCondition" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Condition</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select item condition" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="new">New</SelectItem>
                                <SelectItem value="used_like_new">Used - Like New</SelectItem>
                                <SelectItem value="used_good">Used - Good</SelectItem>
                                <SelectItem value="used_fair">Used - Fair</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
             </div>
        )}


        <Button type="submit" size="lg" className="w-full font-bold" disabled={!selectedCategory || isUserLoading}>Post My Ad</Button>
      </form>
    </Form>
  );
}
