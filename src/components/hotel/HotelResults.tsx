import { HotelOffer } from '@/types/hotel';
import { HotelCard } from './HotelCard';
import { Building2, SearchX } from 'lucide-react';

interface HotelResultsProps {
  hotels: HotelOffer[];
  loading: boolean;
  error: string | null;
  onSelectHotel: (hotel: HotelOffer) => void;
  hasSearched: boolean;
}

export function HotelResults({ hotels, loading, error, onSelectHotel, hasSearched }: HotelResultsProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-64 h-48 bg-muted rounded-lg" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-muted rounded w-3/4" />
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-10 bg-muted rounded w-24 mt-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="bg-card rounded-lg p-12 text-center">
        <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Find Your Perfect Hotel</h3>
        <p className="text-muted-foreground">
          Search for hotels in any city to see available options
        </p>
      </div>
    );
  }

  if (hotels.length === 0) {
    return (
      <div className="bg-card rounded-lg p-12 text-center">
        <SearchX className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Hotels Found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search dates or destination
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {hotels.length} hotel{hotels.length !== 1 ? 's' : ''} found
        </h3>
      </div>
      {hotels.map((hotel) => (
        <HotelCard 
          key={hotel.hotel.hotelId} 
          hotel={hotel} 
          onSelect={onSelectHotel} 
        />
      ))}
    </div>
  );
}
