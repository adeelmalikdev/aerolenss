import { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarIcon, Users, Search, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CityInput } from './CityInput';
import { CitySearchResult } from '@/types/hotel';
import { HotelSearchParams } from '@/types/hotel';

interface HotelSearchFormProps {
  onSearch: (params: HotelSearchParams) => void;
  loading?: boolean;
}

export function HotelSearchForm({ onSearch, loading }: HotelSearchFormProps) {
  const [city, setCity] = useState<CitySearchResult | null>(null);
  const [checkInDate, setCheckInDate] = useState<Date>(addDays(new Date(), 7));
  const [checkOutDate, setCheckOutDate] = useState<Date>(addDays(new Date(), 8));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);

  const handleSearch = () => {
    if (!city) return;

    onSearch({
      cityCode: city.iataCode,
      checkInDate: format(checkInDate, 'yyyy-MM-dd'),
      checkOutDate: format(checkOutDate, 'yyyy-MM-dd'),
      adults,
      rooms,
    });
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Find Your Perfect Stay</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <CityInput
          label="Destination"
          placeholder="Where are you going?"
          value={city}
          onChange={setCity}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Check-in
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkInDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkInDate}
                onSelect={(date) => {
                  if (date) {
                    setCheckInDate(date);
                    if (date >= checkOutDate) {
                      setCheckOutDate(addDays(date, 1));
                    }
                  }
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Check-out
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !checkOutDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkOutDate}
                onSelect={(date) => date && setCheckOutDate(date)}
                disabled={(date) => date <= checkInDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Guests
            </label>
            <Select value={String(adults)} onValueChange={(v) => setAdults(Number(v))}>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Rooms
            </label>
            <Select value={String(rooms)} onValueChange={(v) => setRooms(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n} {n === 1 ? 'Room' : 'Rooms'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button 
        className="w-full md:w-auto" 
        size="lg" 
        onClick={handleSearch}
        disabled={!city || loading}
      >
        {loading ? (
          <>Searching...</>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search Hotels
          </>
        )}
      </Button>
    </div>
  );
}
