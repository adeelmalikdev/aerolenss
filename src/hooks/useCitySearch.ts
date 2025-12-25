import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CitySearchResult } from '@/types/hotel';

export function useCitySearch(query: string) {
  const [cities, setCities] = useState<CitySearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCities = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setCities([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the existing airport search but filter for cities
      const { data, error: fnError } = await supabase.functions.invoke('search-airports', {
        body: { keyword: searchQuery },
      });

      if (fnError) throw fnError;

      // Filter to get unique cities
      const cityMap = new Map<string, CitySearchResult>();
      (data.data || []).forEach((item: any) => {
        if (item.iataCode && !cityMap.has(item.iataCode)) {
          cityMap.set(item.iataCode, {
            iataCode: item.iataCode,
            name: item.address?.cityName || item.name,
            countryName: item.address?.countryName || item.countryName,
            address: item.address,
          });
        }
      });

      setCities(Array.from(cityMap.values()).slice(0, 10));
    } catch (err: any) {
      console.error('City search error:', err);
      setError(err.message || 'Failed to search cities');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchCities(query);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, searchCities]);

  return { cities, loading, error };
}
