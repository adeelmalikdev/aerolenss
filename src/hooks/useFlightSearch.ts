import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FlightOffer, FlightSearchParams } from '@/types/flight';

export function useFlightSearch() {
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [dictionaries, setDictionaries] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);
    setFlights([]);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-flights', {
        body: {
          origin: params.origin,
          destination: params.destination,
          departureDate: params.departureDate,
          returnDate: params.tripType === 'round-trip' ? params.returnDate : undefined,
          adults: params.adults,
          children: params.children,
          infants: params.infants,
          cabinClass: params.cabinClass,
        },
      });

      if (fnError) throw fnError;

      if (data.error) {
        throw new Error(data.error);
      }

      setFlights(data.data || []);
      setDictionaries(data.dictionaries || null);
    } catch (err: any) {
      console.error('Flight search error:', err);
      setError(err.message || 'Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  return { flights, dictionaries, loading, error, searchFlights };
}
