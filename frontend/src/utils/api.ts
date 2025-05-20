
import { TravelDestination, TravelOffer, ListType } from "@/types";

// Use cache to avoid excessive API calls
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function fetchWithCache<T>(url: string): Promise<T> {
  const now = Date.now();
  // Add random cache buster to ensure fresh data
  const cacheBuster = `cachebuster=${Math.random().toString(36).substring(7)}`;
  const urlWithCacheBuster = url.includes('?') ? `${url}&${cacheBuster}` : `${url}?${cacheBuster}`;
  
  // Check if we have a valid cached response
  if (cache[url] && now - cache[url].timestamp < CACHE_TTL) {
    return cache[url].data as T;
  }
  
  try {
    const response = await fetch(urlWithCacheBuster);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Cache the result
    cache[url] = { data, timestamp: now };
    
    return data as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

export async function fetchDestinationByName(name: string): Promise<TravelDestination[]> {
  const url = `https://www.reseguiden.se/api/main/super/destinations-ranked?name=${encodeURIComponent(name)}`;
  return fetchWithCache<TravelDestination[]>(url);
}

export async function fetchToplistData(
  listType: ListType,
  params: Record<string, string>
): Promise<TravelOffer[]> {
  const queryParams = new URLSearchParams({
    ...params,
    output: 'json'
  }).toString();
  
  const url = `https://www.reseguiden.se/widget/toplist/${listType}?${queryParams}`;
  return fetchWithCache<TravelOffer[]>(url);
}

export async function getRefreshedToplistData(
  listType: ListType,
  params: Record<string, string>
): Promise<TravelOffer[]> {
  // Force cache invalidation by adding timestamp
  const timestamp = Date.now();
  const queryParams = new URLSearchParams({
    ...params,
    output: 'json',
    _t: timestamp.toString()
  }).toString();
  
  const url = `https://www.reseguiden.se/widget/toplist/${listType}?${queryParams}`;
  
  // Clear any existing cache for this URL
  const baseUrl = url.split('?')[0] + '?' + new URLSearchParams({
    ...params,
    output: 'json'
  }).toString();
  
  delete cache[baseUrl];
  
  return fetchWithCache<TravelOffer[]>(url);
}
