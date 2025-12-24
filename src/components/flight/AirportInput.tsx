import { useState, useEffect, useRef } from 'react';
import { Plane, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAirportSearch } from '@/hooks/useAirportSearch';
import { Airport } from '@/types/flight';
import { cn } from '@/lib/utils';

interface AirportInputProps {
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  placeholder: string;
  icon?: 'departure' | 'arrival';
  className?: string;
}

export function AirportInput({ value, onChange, placeholder, icon = 'departure', className }: AirportInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { airports, loading, searchAirports } = useAirportSearch();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        searchAirports(query);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, searchAirports]);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery('');
    setIsOpen(false);
  };

  const displayValue = value 
    ? `${value.name}${value.cityName ? ` (${value.iataCode})` : ` - ${value.iataCode}`}` 
    : query;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon === 'departure' ? (
            <Plane className="h-4 w-4 rotate-45" />
          ) : (
            <MapPin className="h-4 w-4" />
          )}
        </div>
        <Input
          ref={inputRef}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2 || airports.length > 0) {
              setIsOpen(true);
            }
          }}
          placeholder={placeholder}
          className="pl-10 h-12 bg-card border-border"
        />
      </div>

      {isOpen && (airports.length > 0 || loading) && (
        <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Searching airports...
            </div>
          ) : (
            airports.map((airport) => (
              <button
                key={airport.iataCode}
                onClick={() => handleSelect(airport)}
                className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3"
              >
                <div className="flex-shrink-0 w-12 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{airport.iataCode}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{airport.name}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {airport.cityName}, {airport.countryName}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
