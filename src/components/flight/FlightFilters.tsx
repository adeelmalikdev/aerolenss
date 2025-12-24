import { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FlightFilters as FlightFiltersType, FlightOffer } from '@/types/flight';

interface FlightFiltersProps {
  flights: FlightOffer[];
  filters: FlightFiltersType;
  onFiltersChange: (filters: FlightFiltersType) => void;
  dictionaries?: any;
}

export function FlightFilters({ flights, filters, onFiltersChange, dictionaries }: FlightFiltersProps) {
  const [open, setOpen] = useState(false);

  // Calculate price range from flights
  const prices = flights.map(f => parseFloat(f.price.grandTotal));
  const minPrice = Math.min(...prices) || 0;
  const maxPrice = Math.max(...prices) || 10000;

  // Get unique airlines
  const airlines = [...new Set(flights.flatMap(f => f.validatingAirlineCodes))];

  const updateFilter = <K extends keyof FlightFiltersType>(key: K, value: FlightFiltersType[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      stops: 'any',
      priceRange: [minPrice, maxPrice],
      airlines: [],
      departureTimeRange: [0, 24],
      durationMax: 1440,
    });
  };

  const hasActiveFilters =
    filters.stops !== 'any' ||
    filters.airlines.length > 0 ||
    filters.departureTimeRange[0] > 0 ||
    filters.departureTimeRange[1] < 24 ||
    filters.priceRange[0] > minPrice ||
    filters.priceRange[1] < maxPrice;

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Stops */}
      <div>
        <h4 className="font-medium mb-3">Stops</h4>
        <RadioGroup value={filters.stops} onValueChange={(v) => updateFilter('stops', v as any)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="any" id="stops-any" />
            <Label htmlFor="stops-any">Any</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="direct" id="stops-direct" />
            <Label htmlFor="stops-direct">Direct only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1stop" id="stops-1" />
            <Label htmlFor="stops-1">1 stop or less</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2plus" id="stops-2plus" />
            <Label htmlFor="stops-2plus">2+ stops</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            min={minPrice}
            max={maxPrice}
            step={10}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Departure Time */}
      <div>
        <h4 className="font-medium mb-3">Departure Time</h4>
        <div className="px-2">
          <Slider
            value={filters.departureTimeRange}
            min={0}
            max={24}
            step={1}
            onValueChange={(value) => updateFilter('departureTimeRange', value as [number, number])}
          />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{filters.departureTimeRange[0]}:00</span>
            <span>{filters.departureTimeRange[1]}:00</span>
          </div>
        </div>
      </div>

      {/* Airlines */}
      {airlines.length > 0 && (
        <div>
          <h4 className="font-medium mb-3">Airlines</h4>
          <div className="space-y-2 max-h-40 overflow-auto">
            {airlines.map((code) => {
              const name = dictionaries?.carriers?.[code] || code;
              const isChecked = filters.airlines.includes(code);
              return (
                <div key={code} className="flex items-center space-x-2">
                  <Checkbox
                    id={`airline-${code}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newAirlines = checked
                        ? [...filters.airlines, code]
                        : filters.airlines.filter(a => a !== code);
                      updateFilter('airlines', newAirlines);
                    }}
                  />
                  <Label htmlFor={`airline-${code}`} className="text-sm">{name}</Label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block bg-card border border-border rounded-lg p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        <FiltersContent />
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  !
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <FiltersContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
