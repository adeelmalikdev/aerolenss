import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Airport } from '@/types/flight';

export function useAirportSearch() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);

  const searchAirports = useCallback(async (keyword: string) => {
    if (!keyword || keyword.length < 2) {
      setAirports([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-airports', {
        body: { keyword },
      });

      if (error) throw error;

      if (data?.rateLimited) {
        toast.error('Search is temporarily rate-limited. Please wait a minute and try again.');
        setAirports([]);
        return;
      }

      const formattedAirports: Airport[] = (data.data || []).map((item: any) => ({
        iataCode: item.iataCode,
        name: item.name,
        cityName: item.address?.cityName,
        countryName: item.address?.countryName,
      }));

      setAirports(formattedAirports);
    } catch (error) {
      console.error('Airport search error:', error);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { airports, loading, searchAirports };
}
