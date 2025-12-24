import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, ArrowRightLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirportInput } from './AirportInput';
import { Airport, FlightSearchParams } from '@/types/flight';
import { cn } from '@/lib/utils';

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams) => void;
  loading?: boolean;
}

export function FlightSearchForm({ onSearch, loading }: FlightSearchFormProps) {
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState<Airport | null>(null);
  const [destination, setDestination] = useState<Airport | null>(null);
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST'>('ECONOMY');
  const [passengersOpen, setPassengersOpen] = useState(false);

  const handleSwapAirports = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) return;

    onSearch({
      origin: origin.iataCode,
      destination: destination.iataCode,
      departureDate: format(departureDate, 'yyyy-MM-dd'),
      returnDate: returnDate ? format(returnDate, 'yyyy-MM-dd') : undefined,
      adults,
      children,
      infants,
      cabinClass,
      tripType,
    });
  };

  const totalPassengers = adults + children + infants;
  const isValid = origin && destination && departureDate && (tripType === 'one-way' || returnDate);

  return (
    <div className="w-full bg-card rounded-xl shadow-lg p-6 space-y-4">
      <Tabs value={tripType} onValueChange={(v) => setTripType(v as any)}>
        <TabsList className="bg-muted">
          <TabsTrigger value="round-trip">Round Trip</TabsTrigger>
          <TabsTrigger value="one-way">One Way</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Origin & Destination */}
        <div className="lg:col-span-5 flex items-center gap-2">
          <AirportInput
            value={origin}
            onChange={setOrigin}
            placeholder="Where from?"
            icon="departure"
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapAirports}
            className="shrink-0"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <AirportInput
            value={destination}
            onChange={setDestination}
            placeholder="Where to?"
            icon="arrival"
            className="flex-1"
          />
        </div>

        {/* Dates */}
        <div className="lg:col-span-4 flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 h-12 justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "MMM d, yyyy") : "Departure"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>

          {tripType === 'round-trip' && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "flex-1 h-12 justify-start text-left font-normal",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "MMM d, yyyy") : "Return"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  initialFocus
                  disabled={(date) => date < (departureDate || new Date())}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Passengers & Class */}
        <div className="lg:col-span-3 flex gap-2">
          <Popover open={passengersOpen} onOpenChange={setPassengersOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 h-12 justify-start">
                <Users className="mr-2 h-4 w-4" />
                {totalPassengers} {totalPassengers === 1 ? 'Traveler' : 'Travelers'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Adults</p>
                    <p className="text-sm text-muted-foreground">12+ years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      disabled={adults >= 9}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Children</p>
                    <p className="text-sm text-muted-foreground">2-11 years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setChildren(Math.min(9, children + 1))}
                      disabled={children >= 9}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Infants</p>
                    <p className="text-sm text-muted-foreground">Under 2 years</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfants(Math.max(0, infants - 1))}
                      disabled={infants <= 0}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{infants}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setInfants(Math.min(adults, infants + 1))}
                      disabled={infants >= adults}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Select value={cabinClass} onValueChange={(v: any) => setCabinClass(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ECONOMY">Economy</SelectItem>
                      <SelectItem value="PREMIUM_ECONOMY">Premium Economy</SelectItem>
                      <SelectItem value="BUSINESS">Business</SelectItem>
                      <SelectItem value="FIRST">First Class</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleSearch}
            disabled={!isValid || loading}
            className="h-12 px-8"
          >
            <Search className="h-4 w-4 mr-2" />
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
    </div>
  );
}
