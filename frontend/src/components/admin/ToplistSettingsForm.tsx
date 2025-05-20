import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ToplistSettings, ListType } from '@/types';
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
import { Slider } from '@/components/ui/slider';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  departureCity: z.string().min(3, { message: "Departure city is required" }),
  destinationThemeId: z.string().optional(),
  destinationId: z.string().optional(),
  limit: z.number().min(1).max(20),
  layout: z.enum(['single', 'double']),
  primaryColor: z.string(),
  textColor: z.string(),
  backgroundColor: z.string(),
  showLogo: z.boolean(),
  showPartnerLogo: z.boolean(),
  showHeader: z.boolean(),
  slim: z.boolean(),
  listType: z.enum(['charter', 'last_minute', 'air']),
});

interface ToplistSettingsFormProps {
  initialSettings?: Partial<ToplistSettings>;
  onSubmit: (values: ToplistSettings) => void;
}

const ToplistSettingsForm: React.FC<ToplistSettingsFormProps> = ({ 
  initialSettings,
  onSubmit 
}) => {
  const defaultValues: ToplistSettings = {
    title: 'Travel Deals',
    departureCity: 'STO',
    destinationThemeId: '1',
    destinationId: '',
    limit: 5,
    layout: 'single',
    primaryColor: '#0EA5E9',
    textColor: '#000000',
    backgroundColor: '#ffffff',
    showLogo: true,
    showPartnerLogo: true,
    showHeader: true,
    slim: false,
    listType: 'charter',
    ...initialSettings
  };
  
  const form = useForm<ToplistSettings>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const watchListType = form.watch('listType');
  
  const handleSubmit = (values: ToplistSettings) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Toplist Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Data Settings</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="listType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select list type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="charter">Charter</SelectItem>
                          <SelectItem value="last_minute">Last Minute</SelectItem>
                          <SelectItem value="air">Flight Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="departureCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure City</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select departure city" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="STO">Stockholm</SelectItem>
                          <SelectItem value="GOT">Gothenburg</SelectItem>
                          <SelectItem value="CPH">Copenhagen</SelectItem>
                          <SelectItem value="OSL">Oslo</SelectItem>
                          <SelectItem value="HEL">Helsinki</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {watchListType !== 'air' && (
                  <FormField
                    control={form.control}
                    name="destinationThemeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination Theme</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value || ''}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select destination theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">Sun & Beach</SelectItem>
                            <SelectItem value="2">City</SelectItem>
                            <SelectItem value="3">Adventure</SelectItem>
                            <SelectItem value="4">Culture</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                
                <FormField
                  control={form.control}
                  name="limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of deals: {field.value}</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={20}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Layout Settings */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">Layout Settings</h3>
                
                <FormField
                  control={form.control}
                  name="layout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select layout" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single">Single Column</SelectItem>
                          <SelectItem value="double">Double Column</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input {...field} type="color" className="w-12 h-12 p-1" />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="textColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Text Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input {...field} type="color" className="w-12 h-12 p-1" />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="backgroundColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Background Color</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input {...field} type="color" className="w-12 h-12 p-1" />
                        </FormControl>
                        <Input
                          value={field.value}
                          onChange={field.onChange}
                          className="flex-1"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="showLogo"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel>Show Logo</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="showPartnerLogo"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel>Show Partner Logo</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="showHeader"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel>Show Header</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slim"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between space-y-0 rounded-lg border p-3">
                        <FormLabel>Slim Design</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              Save Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ToplistSettingsForm;
