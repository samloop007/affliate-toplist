import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  domainName: z.string().min(3, {
    message: "Domain name must be at least 3 characters",
  }),
  partnerName: z.string().min(3, {
    message: "Partner name must be at least 3 characters",
  }),
  customHostname: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DomainFormProps {
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  mode?: 'create' | 'edit';
}

const DomainForm: React.FC<DomainFormProps> = ({
  initialValues,
  onSubmit,
  mode = 'create',
}) => {
  const { toast } = useToast();
  console.log(initialValues, 'initialValues');
  const form = useForm<FormValues>({ 
    resolver: zodResolver(formSchema),
    defaultValues: {
      domainName: initialValues?.domainName || '',
      partnerName: initialValues?.partnerName || '',
      customHostname: initialValues?.customHostname || '',
    },
  });

  useEffect(() => {
    form.reset({
      domainName: initialValues ? (initialValues['name']) ? initialValues['name'] : initialValues['id'] : '',
      partnerName: initialValues ? (initialValues['partnerName']) ? initialValues['partnerName'] : initialValues['username'] : '',
      customHostname: initialValues ? (initialValues['customHostname']) ? initialValues['customHostname'] : initialValues['subdomain']  : '',
    });
  }, [initialValues]);

  const handleSubmit = async (values: FormValues) => {
    try {
      // In a real application, this would connect to Cloudflare SaaS
      // For now we'll just simulate the submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSubmit(values);
      toast({
        title: "Domain created",
        description: `${values.domainName} has been created successfully.`,
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Domain creation failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Create New Domain</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="domainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input {...field} placeholder="partnername" className="rounded-r-none" />
                      <span className="bg-gray-100 px-3 py-2 border border-l-0 border-input rounded-r-md text-gray-500">
                        .traveltool.x
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="partnerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Partner Company Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customHostname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Hostname (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="travel.theirdomainname.x" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full">
                {mode === 'edit' ? 'Save Changes' : 'Create Domain'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-500 rounded-b-lg">
        This will create a subdomain using Cloudflare SaaS
      </CardFooter>
    </Card>
  );
};

export default DomainForm;
