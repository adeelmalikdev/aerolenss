import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { HotelOffer, HotelSearchParams } from '@/types/hotel';

export function useHotelSearch() {
  const [hotels, setHotels] = useState<HotelOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchHotels = async (params: HotelSearchParams) => {
    setLoading(true);
    setError(null);
    setHotels([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-hotels', {
        body: {
          cityCode: params.cityCode,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          adults: params.adults,
          rooms: params.rooms,
          currency: params.currency || 'USD',
        },
      });

      if (fnError) throw fnError;

      if (data.error) {
        throw new Error(data.error);
      }

      setHotels(data.data || []);
    } catch (err: any) {
      console.error('Hotel search error:', err);
      setError(err.message || 'Failed to search hotels');
    } finally {
      setLoading(false);
    }
  };

  return { hotels, loading, error, searchHotels };
}
