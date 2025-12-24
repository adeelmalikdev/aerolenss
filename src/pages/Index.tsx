import { useState } from 'react';
import { Plane, TrendingDown, Shield, Clock } from 'lucide-react';
import { FlightSearchForm } from '@/components/flight/FlightSearchForm';
import { FlightResults } from '@/components/flight/FlightResults';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { FlightSearchParams } from '@/types/flight';

const Index = () => {
  const { flights, dictionaries, loading, error, searchFlights } = useFlightSearch();
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (params: FlightSearchParams) => {
    setHasSearched(true);
    searchFlights(params);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Plane className="h-10 w-10 text-primary" />
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground">SkyFinder</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compare millions of flights to find the best deals. Search, compare, and book your perfect journey.
            </p>
          </div>

          <FlightSearchForm onSearch={handleSearch} loading={loading} />

          {!hasSearched && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                <TrendingDown className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Best Prices</h3>
                  <p className="text-sm text-muted-foreground">Compare prices from hundreds of airlines and travel sites</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Data</h3>
                  <p className="text-sm text-muted-foreground">Get live flight information powered by Amadeus</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card/50">
                <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">Trusted</h3>
                  <p className="text-sm text-muted-foreground">Book with confidence from verified providers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="container mx-auto px-4 py-8">
          <FlightResults
            flights={flights}
            dictionaries={dictionaries}
            loading={loading}
            error={error}
          />
        </div>
      )}
    </div>
  );
};

export default Index;
