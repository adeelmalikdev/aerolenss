import { useMemo, useState } from 'react';
import { FlightCard } from './FlightCard';
import { FlightFilters } from './FlightFilters';
import { FlightSort } from './FlightSort';
import { FlightDetailsModal } from './FlightDetailsModal';
import { FlightResultsSkeleton } from './FlightResultsSkeleton';
import { PriceAlertButton } from './PriceAlerts';
import { FlightOffer, FlightFilters as FlightFiltersType, SortOption } from '@/types/flight';
import { parseISO } from 'date-fns';

interface FlightResultsProps {
  flights: FlightOffer[];
  dictionaries?: any;
  loading: boolean;
  error?: string | null;
  originCode?: string;
  originName?: string;
  destinationCode?: string;
  destinationName?: string;
}

function parseDurationMinutes(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  return hours * 60 + minutes;
}

export function FlightResults({ 
  flights, 
  dictionaries, 
  loading, 
  error,
  originCode,
  originName,
  destinationCode,
  destinationName,
}: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('best');
  const [selectedFlight, setSelectedFlight] = useState<FlightOffer | null>(null);
  const [filters, setFilters] = useState<FlightFiltersType>({
    stops: 'any',
    priceRange: [0, 100000],
    airlines: [],
    departureTimeRange: [0, 24],
    durationMax: 1440,
  });

  const filteredAndSortedFlights = useMemo(() => {
    let result = [...flights];

    result = result.filter((flight) => {
      const price = parseFloat(flight.price.grandTotal);
      const firstItinerary = flight.itineraries[0];
      const stops = firstItinerary.segments.length - 1;
      const departureHour = parseISO(firstItinerary.segments[0].departure.at).getHours();

      if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      if (filters.stops === 'direct' && stops > 0) return false;
      if (filters.stops === '1stop' && stops > 1) return false;
      if (filters.stops === '2plus' && stops < 2) return false;
      if (filters.airlines.length > 0 && !flight.validatingAirlineCodes.some(a => filters.airlines.includes(a))) return false;
      if (departureHour < filters.departureTimeRange[0] || departureHour > filters.departureTimeRange[1]) return false;

      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal);
        case 'duration':
          return parseDurationMinutes(a.itineraries[0].duration) - parseDurationMinutes(b.itineraries[0].duration);
        case 'departure':
          return new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime();
        case 'best':
        default:
          const priceA = parseFloat(a.price.grandTotal);
          const priceB = parseFloat(b.price.grandTotal);
          const durationA = parseDurationMinutes(a.itineraries[0].duration);
          const durationB = parseDurationMinutes(b.itineraries[0].duration);
          return (priceA + durationA * 0.5) - (priceB + durationB * 0.5);
      }
    });

    return result;
  }, [flights, filters, sortBy]);

  const lowestPrice = useMemo(() => {
    if (flights.length === 0) return undefined;
    return Math.min(...flights.map(f => parseFloat(f.price.grandTotal)));
  }, [flights]);

  if (loading) {
    return <FlightResultsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive text-lg">Something went wrong</p>
        <p className="text-muted-foreground mt-2">Please try again with different search criteria.</p>
      </div>
    );
  }

  if (flights.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FlightFilters
            flights={flights}
            filters={filters}
            onFiltersChange={setFilters}
            dictionaries={dictionaries}
          />
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredAndSortedFlights.length}</span>
                {' '}of {flights.length} flights
              </p>
              {originCode && destinationCode && (
                <PriceAlertButton
                  originCode={originCode}
                  originName={originName || originCode}
                  destinationCode={destinationCode}
                  destinationName={destinationName || destinationCode}
                  currentPrice={lowestPrice}
                />
              )}
            </div>
            <FlightSort value={sortBy} onChange={setSortBy} />
          </div>

          <div className="space-y-4">
            {filteredAndSortedFlights.map((flight) => (
              <FlightCard
                key={flight.id}
                flight={flight}
                dictionaries={dictionaries}
                onSelect={() => setSelectedFlight(flight)}
              />
            ))}
          </div>

          {filteredAndSortedFlights.length === 0 && flights.length > 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No flights match your filter criteria.</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>

      <FlightDetailsModal
        flight={selectedFlight}
        dictionaries={dictionaries}
        open={!!selectedFlight}
        onOpenChange={(open) => !open && setSelectedFlight(null)}
        originCode={originCode}
        destinationCode={destinationCode}
      />
    </>
  );
}
