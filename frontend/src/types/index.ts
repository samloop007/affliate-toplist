export interface Domain {
  id: string;
  name: string;
  partnerId: string;
  createdAt: string;
  customHostname?: string;
}

export interface Partner {
  id: string;
  name: string;
  domains: Domain[];
}

export interface TravelDestination {
  id: string;
  name: string;
  country: string;
  city?: string;
}

export interface TravelTheme {
  id: string;
  name: string;
}

export type ListType = 'charter' | 'last_minute' | 'air';

export interface ToplistSettings {
  title: string;
  departureCity: string;
  destinationThemeId?: string;
  destinationId?: string;
  limit: number;
  layout: 'single' | 'double';
  primaryColor: string;
  textColor: string;
  backgroundColor: string;
  showLogo: boolean;
  showPartnerLogo: boolean;
  showHeader: boolean;
  slim: boolean;
  listType: ListType;
}

export interface TravelOffer {
  id: string;
  title: string;
  destination: string;
  destinationId: string;
  departureCity: string;
  price: number;
  currency: string;
  departure: string;
  return: string;
  nights: number;
  imageUrl: string;
  url: string;
  provider: string;
  providerLogo?: string;
}

export interface ToplistItem {
  id: string;
  price: number;
  departure: string;
  destination: string;
  date: string;
  url: string;
  airline?: string;
}

export interface PartnerConfig {
  id: string;
  domain: string;
  departure: string;
  destinationIds: string[];
  layout: '1-column' | '2-column';
  colors: {
    text: string;
    background: string;
  };
  toplistType: 'charter' | 'last_minute' | 'air';
  limit: number;
}

export interface ToplistResponse {
  items: ToplistItem[];
  lastUpdated: string;
}

export interface Destination {
  id: string;
  name: string;
  theme_id: string;
}
