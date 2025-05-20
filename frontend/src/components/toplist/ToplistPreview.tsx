
import React from 'react';
import { TravelOffer, ToplistSettings } from '@/types';
import { useToplistData } from '@/hooks/useToplistData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ToplistPreviewProps {
  settings: ToplistSettings;
}

const ToplistPreview: React.FC<ToplistPreviewProps> = ({ settings }) => {
  const { offers, isLoading, error, lastRefresh, refreshData } = useToplistData(settings);
  
  // Format price with thousand separator and currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format date to display nicely
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('sv-SE', options);
  };

  const headerBgColor = settings.primaryColor || '#0EA5E9';
  const textColor = settings.textColor || '#000000';
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader style={{ backgroundColor: headerBgColor }} className="text-white">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{settings.title}</CardTitle>
          <div className="text-sm opacity-80">
            Last updated: {lastRefresh.toLocaleTimeString()}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshData}
              className="ml-2 text-white hover:text-white hover:bg-white/20"
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0" style={{ backgroundColor: settings.backgroundColor || '#ffffff' }}>
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: settings.limit }).map((_, index) => (
              <div key={index} className="flex gap-4">
                <Skeleton className="h-24 w-32 rounded" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">
            Failed to load offers: {error}
          </div>
        ) : (
          <div className={`grid ${settings.layout === 'double' ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 p-4`}>
            {offers.map((offer) => (
              <div 
                key={offer.id}
                className="flex flex-col md:flex-row gap-3 border rounded-lg overflow-hidden hover:shadow-md transition-shadow p-2"
                style={{ color: textColor }}
              >
                <div className="w-full md:w-1/3">
                  <img
                    src={offer.imageUrl || 'placeholder.svg'}
                    alt={offer.destination}
                    className="w-full h-32 md:h-full object-cover rounded"
                  />
                </div>
                <div className="flex-1 p-2 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{offer.destination}</h3>
                    <p className="text-sm opacity-75">{offer.title}</p>
                    <p className="text-sm mt-1">
                      {formatDate(offer.departure)} - {formatDate(offer.return)} · {offer.nights} nights
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold" style={{ color: headerBgColor }}>
                      {formatPrice(offer.price)}
                    </span>
                    <Button 
                      size="sm"
                      style={{ backgroundColor: headerBgColor }}
                      className="text-white"
                      asChild
                    >
                      <a href={offer.url} target="_blank" rel="noopener noreferrer">
                        Book Now
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToplistPreview;
