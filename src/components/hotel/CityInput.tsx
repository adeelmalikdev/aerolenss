import { useState, useRef, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCitySearch } from '@/hooks/useCitySearch';
import { CitySearchResult } from '@/types/hotel';

interface CityInputProps {
  label: string;
  placeholder: string;
  value: CitySearchResult | null;
  onChange: (city: CitySearchResult | null) => void;
  className?: string;
}

export function CityInput({ label, placeholder, value, onChange, className }: CityInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { cities, loading } = useCitySearch(query);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city: CitySearchResult) => {
    onChange(city);
    setQuery('');
    setIsOpen(false);
  };

  const displayValue = value 
    ? `${value.name}${value.countryName ? `, ${value.countryName}` : ''} (${value.iataCode})` 
    : query;

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={displayValue}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(null);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && cities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {cities.map((city) => (
            <button
              key={city.iataCode}
              type="button"
              onClick={() => handleSelect(city)}
              className="w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="font-medium text-foreground">
                  {city.name} ({city.iataCode})
                </div>
                {city.countryName && (
                  <div className="text-sm text-muted-foreground">
                    {city.countryName}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
