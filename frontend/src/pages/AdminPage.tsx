import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ToplistSettingsForm from '@/components/admin/ToplistSettingsForm';
import ToplistPreview from '@/components/toplist/ToplistPreview';
import ExportOptions from '@/components/toplist/ExportOptions';
import { ToplistSettings } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const [settings, setSettings] = useState<ToplistSettings>({
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
    listType: 'charter'
  });

  const { toast } = useToast();
  
  const handleSettingsUpdate = (newSettings: ToplistSettings) => {
    setSettings(newSettings);
    toast({
      title: "Settings saved",
      description: "Your toplist settings have been updated."
    });
  };

  return (
    <MainLayout title="Affiliate Tool">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Toplist Configuration</h1>
        
        <Tabs defaultValue="preview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="space-y-8">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-4">Toplist Preview</h2>
              <ToplistPreview settings={settings} />
              
              <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm mb-3">
                  This is a preview of how your toplist will appear. The data is automatically refreshed every 5 minutes.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <ToplistSettingsForm 
              initialSettings={settings}
              onSubmit={handleSettingsUpdate}
            />
          </TabsContent>
          
          <TabsContent value="export">
            <ExportOptions settings={settings} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminPage;
