import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  return (
    <MainLayout title="Travel Affiliate Toplist Forge">
      <div className="max-w-5xl mx-auto">
        <section className="mb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Travel Toplists for Your Website
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Easily generate and customize travel deal toplists for your website or email newsletters.
              Integrate with a simple embed code and start earning commissions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-travel-blue/10">
                <CardTitle className="text-travel-blue">Domain Setup</CardTitle>
                <CardDescription>Create and manage your toplist subdomains</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Set up custom subdomains for your travel toplists using Cloudflare SaaS integration.
                  Configure once and deploy multiple toplists under your brand.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/domains">Set Up Domains</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-travel-purple/10">
                <CardTitle className="text-travel-purple">Affiliate Tool</CardTitle>
                <CardDescription>Customize and generate your travel toplists</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">
                  Design your toplist, select travel destinations, customize appearance,
                  and get embed codes to integrate on your website or emails.
                </p>
                <Button className="w-full bg-travel-purple hover:bg-travel-purple/90" asChild>
                  <Link to="/admin/panel">Create Toplists</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-travel-blue/10 text-travel-blue font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-lg font-medium mb-2">Create Your Domain</h3>
              <p className="text-gray-600">
                Set up a custom subdomain that will host your travel toplists. Use your own domain or one of ours.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-travel-purple/10 text-travel-purple font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-lg font-medium mb-2">Customize Toplists</h3>
              <p className="text-gray-600">
                Choose destinations, departure cities, color schemes, and layouts for your travel deal toplists.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-travel-gray/10 text-travel-gray font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-lg font-medium mb-2">Embed & Earn</h3>
              <p className="text-gray-600">
                Copy the embed code to your website or use our API to display deals and earn commissions on bookings.
              </p>
            </div>
          </div>
        </section>
        
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Create your first toplist in minutes and start monetizing your travel audience. 
            Our toplists automatically refresh with the latest prices every 5 minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/domains">Create Domain</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/admin">Build Toplist</Link>
            </Button>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
