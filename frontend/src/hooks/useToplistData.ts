import { useState, useEffect } from 'react';
import { TravelOffer, ToplistSettings, ListType } from '@/types';
import { fetchToplistData, getRefreshedToplistData } from '@/utils/api';
import { useToast } from '@/components/ui/use-toast';

export function useToplistData(
  settings: ToplistSettings,
  refreshInterval: number = 5 * 60 * 1000 // Default: 5 minutes
) {
  const [offers, setOffers] = useState<TravelOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const { toast } = useToast();

  // Build params object from settings
  const buildParams = () => {
    const params: Record<string, string> = {
      limit: settings.limit.toString()
    };

    // Add city code if present
    if (settings.departureCity) {
      params.city_code_dep = settings.departureCity;
    }

    // Add destination theme if present
    if (settings.destinationThemeId) {
      params.destination_theme_id = settings.destinationThemeId;
    }

    // Add specific destination if present
    if (settings.destinationId) {
      params.destination_id = settings.destinationId;
    }

    // Add layout params
    if (!settings.showLogo) params.no_logo = '1';
    if (!settings.showPartnerLogo) params.no_partner_logo = '1';
    if (!settings.showHeader) params.no_header = '1';
    if (settings.slim) params.slim = '1';
    if (settings.backgroundColor) params.background = settings.backgroundColor;

    return params;
  };

  // Function to fetch data
  const fetchData = async (refresh = false) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = buildParams();
      let data: TravelOffer[];
      
      if (refresh) {
        data = await getRefreshedToplistData(settings.listType, params);
      } else {
        data = await fetchToplistData(settings.listType, params);
      }
      
      setOffers(data);
      setLastRefresh(new Date());
      setIsLoading(false);
      
      if (refresh) {
        toast({
          title: "Toplist updated",
          description: "Latest prices have been fetched",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setIsLoading(false);
      console.error("Error fetching travel offers:", err);
      
      if (refresh) {
        toast({
          title: "Update failed",
          description: "Couldn't refresh the price data",
          variant: "destructive",
        });
      }
    }
  };

  // Force refresh data
  const refreshData = () => fetchData(true);

  useEffect(() => {
    fetchData();
    
    // Set up refresh interval
    const intervalId = setInterval(() => {
      fetchData(true);
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [
    settings.listType,
    settings.departureCity,
    settings.destinationThemeId,
    settings.destinationId,
    settings.limit,
    refreshInterval
  ]);

  return {
    offers,
    isLoading,
    error,
    lastRefresh,
    refreshData
  };
}
