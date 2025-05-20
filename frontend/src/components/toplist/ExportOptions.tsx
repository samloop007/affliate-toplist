import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ToplistSettings } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ExportOptionsProps {
  settings: ToplistSettings;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({ settings }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  // Create iframe embed code
  const iframeCode = `<iframe 
  src="https://partner.traveltool.x/toplist?${new URLSearchParams({
    type: settings.listType,
    city_code_dep: settings.departureCity,
    ...(settings.destinationThemeId ? { destination_theme_id: settings.destinationThemeId } : {}),
    ...(settings.destinationId ? { destination_id: settings.destinationId } : {}),
    limit: settings.limit.toString(),
    layout: settings.layout,
    primaryColor: encodeURIComponent(settings.primaryColor),
    textColor: encodeURIComponent(settings.textColor),
    backgroundColor: encodeURIComponent(settings.backgroundColor),
    ...(settings.showLogo ? {} : { no_logo: '1' }),
    ...(settings.showPartnerLogo ? {} : { no_partner_logo: '1' }),
    ...(settings.showHeader ? {} : { no_header: '1' }),
    ...(settings.slim ? { slim: '1' } : {})
  })}"
  width="100%" 
  height="600" 
  frameborder="0"
  scrolling="no"
  title="${settings.title}"
></iframe>`;

  // Create JavaScript embed code
  const jsCode = `<div id="travel-toplist-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://partner.traveltool.x/embed.js';
    script.async = true;
    script.onload = function() {
      createTravelToplist({
        container: 'travel-toplist-container',
        type: '${settings.listType}',
        departureCity: '${settings.departureCity}',
        ${settings.destinationThemeId ? `destinationThemeId: '${settings.destinationThemeId}',` : ''}
        ${settings.destinationId ? `destinationId: '${settings.destinationId}',` : ''}
        limit: ${settings.limit},
        layout: '${settings.layout}',
        primaryColor: '${settings.primaryColor}',
        textColor: '${settings.textColor}',
        backgroundColor: '${settings.backgroundColor}',
        showLogo: ${settings.showLogo},
        showPartnerLogo: ${settings.showPartnerLogo},
        showHeader: ${settings.showHeader},
        slim: ${settings.slim}
      });
    };
    document.head.appendChild(script);
  })();
</script>`;

  // Create JSON URL
  const jsonUrl = `https://partner.traveltool.x/api/toplist?${new URLSearchParams({
    type: settings.listType,
    city_code_dep: settings.departureCity,
    ...(settings.destinationThemeId ? { destination_theme_id: settings.destinationThemeId } : {}),
    ...(settings.destinationId ? { destination_id: settings.destinationId } : {}),
    limit: settings.limit.toString(),
    output: 'json'
  })}`;

  // Create email template (simplified version)
  const emailTemplate = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.5; }
    .travel-container { max-width: 600px; margin: 0 auto; }
    .travel-header { background-color: ${settings.primaryColor}; color: white; padding: 15px; }
    .travel-title { font-size: 20px; font-weight: bold; margin: 0; }
    .travel-item { border: 1px solid #eee; margin-bottom: 15px; padding: 10px; }
    .travel-destination { font-weight: bold; font-size: 18px; margin-bottom: 5px; }
    .travel-details { font-size: 14px; color: #666; margin-bottom: 10px; }
    .travel-price { font-weight: bold; color: ${settings.primaryColor}; font-size: 18px; }
    .travel-button { background-color: ${settings.primaryColor}; color: white; padding: 8px 15px; 
                    text-decoration: none; display: inline-block; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="travel-container">
    <div class="travel-header">
      <h1 class="travel-title">${settings.title}</h1>
    </div>
    
    <!-- Travel Items will be dynamically inserted here -->
    
    <div style="text-align: center; margin-top: 20px;">
      <a href="https://partner.traveltool.x/toplist" style="color: ${settings.primaryColor};">See all travel deals</a>
    </div>
  </div>
</body>
</html>
`;

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast({
        title: "Copied to clipboard",
        description: `${type} code has been copied to your clipboard.`
      });
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again or copy manually"
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Options</CardTitle>
        <CardDescription>
          Use these options to integrate the toplist on your website or in emails
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="iframe" className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="iframe">iFrame</TabsTrigger>
            <TabsTrigger value="js">JavaScript</TabsTrigger>
            <TabsTrigger value="json">JSON API</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="iframe" className="space-y-4">
            <div className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre>{iframeCode}</pre>
            </div>
            <Button onClick={() => copyToClipboard(iframeCode, "iFrame")}>
              Copy iFrame Code
            </Button>
          </TabsContent>
          
          <TabsContent value="js" className="space-y-4">
            <div className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto">
              <pre>{jsCode}</pre>
            </div>
            <Button onClick={() => copyToClipboard(jsCode, "JavaScript")}>
              Copy JavaScript Code
            </Button>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">JSON API URL:</label>
              <div className="flex">
                <Input readOnly value={jsonUrl} className="flex-1" />
                <Button className="ml-2" onClick={() => copyToClipboard(jsonUrl, "JSON API URL")}>
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                This URL provides real-time travel data in JSON format. The data refreshes every 5 minutes.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="email" className="space-y-4">
            <div className="text-sm bg-gray-50 p-4 rounded-md overflow-x-auto h-64">
              <pre>{emailTemplate}</pre>
            </div>
            <Button onClick={() => copyToClipboard(emailTemplate, "Email template")}>
              Copy Email Template
            </Button>
            <p className="text-sm text-gray-500">
              This is a basic email template. You'll need to insert the travel deals data dynamically when sending.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="bg-gray-50 text-sm text-gray-500">
        All exports will automatically reflect your current toplist settings.
      </CardFooter>
    </Card>
  );
};

export default ExportOptions;
