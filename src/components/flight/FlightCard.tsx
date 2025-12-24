import { Plane, Clock, ArrowRight } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FlightOffer, FlightItinerary } from '@/types/flight';
import { cn } from '@/lib/utils';

interface FlightCardProps {
  flight: FlightOffer;
  dictionaries?: any;
  onSelect?: () => void;
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  const hours = match[1] || '0';
  const minutes = match[2] || '0';
  return `${hours}h ${minutes}m`;
}

function ItineraryRow({ itinerary, dictionaries, label }: { itinerary: FlightItinerary; dictionaries?: any; label: string }) {
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const stops = itinerary.segments.length - 1;

  const departureTime = format(parseISO(firstSegment.departure.at), 'HH:mm');
  const arrivalTime = format(parseISO(lastSegment.arrival.at), 'HH:mm');
  const departureDate = format(parseISO(firstSegment.departure.at), 'MMM d');
  const arrivalDate = format(parseISO(lastSegment.arrival.at), 'MMM d');
  const differentDays = departureDate !== arrivalDate;

  const carrierName = dictionaries?.carriers?.[firstSegment.carrierCode] || firstSegment.carrierCode;

  const stopCities = stops > 0
    ? itinerary.segments.slice(0, -1).map(s => s.arrival.iataCode).join(', ')
    : null;

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-20 flex-shrink-0">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-1">
          <Plane className="h-5 w-5 text-primary" />
        </div>
        <p className="text-xs text-muted-foreground truncate">{carrierName}</p>
      </div>

      <div className="flex-1 flex items-center gap-4">
        {/* Departure */}
        <div className="text-center min-w-[80px]">
          <p className="text-xl font-bold">{departureTime}</p>
          <p className="text-sm text-muted-foreground">{firstSegment.departure.iataCode}</p>
        </div>

        {/* Duration & Stops */}
        <div className="flex-1 flex flex-col items-center px-4">
          <p className="text-sm text-muted-foreground mb-1">{parseDuration(itinerary.duration)}</p>
          <div className="w-full flex items-center">
            <div className="h-px flex-1 bg-border" />
            {stops === 0 ? (
              <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground" />
            ) : (
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: stops }).map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-orange-500" />
                ))}
              </div>
            )}
            <div className="h-px flex-1 bg-border" />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stops === 0 ? (
              <span className="text-green-600 font-medium">Direct</span>
            ) : (
              <span className="text-orange-600">
                {stops} stop{stops > 1 ? 's' : ''}{stopCities && ` (${stopCities})`}
              </span>
            )}
          </p>
        </div>

        {/* Arrival */}
        <div className="text-center min-w-[80px]">
          <p className="text-xl font-bold">
            {arrivalTime}
            {differentDays && <sup className="text-xs text-orange-500 ml-0.5">+1</sup>}
          </p>
          <p className="text-sm text-muted-foreground">{lastSegment.arrival.iataCode}</p>
        </div>
      </div>
    </div>
  );
}

export function FlightCard({ flight, dictionaries, onSelect }: FlightCardProps) {
  const isRoundTrip = flight.itineraries.length > 1;
  const cabin = flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 divide-y divide-border">
          <ItineraryRow
            itinerary={flight.itineraries[0]}
            dictionaries={dictionaries}
            label="Outbound"
          />
          {isRoundTrip && (
            <ItineraryRow
              itinerary={flight.itineraries[1]}
              dictionaries={dictionaries}
              label="Return"
            />
          )}
        </div>

        <div className="lg:border-l lg:border-border lg:pl-4 lg:ml-4 flex flex-col items-center lg:items-end gap-2 min-w-[140px]">
          <Badge variant="secondary" className="text-xs">
            {cabin.toLowerCase().replace('_', ' ')}
          </Badge>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              ${parseFloat(flight.price.grandTotal).toFixed(0)}
            </p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <Button onClick={onSelect} className="w-full">
            Select
          </Button>
        </div>
      </div>
    </div>
  );
}
