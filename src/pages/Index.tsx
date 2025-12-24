import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedDestinations } from '@/components/home/FeaturedDestinations';
import { ServicesSection } from '@/components/home/ServicesSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { Footer } from '@/components/home/Footer';
import { FlightResults } from '@/components/flight/FlightResults';
import { SavedSearches } from '@/components/flight/SavedSearches';
import { RecentSearches } from '@/components/flight/RecentSearches';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { useAuth } from '@/hooks/useAuth';
import { FlightSearchParams, Airport } from '@/types/flight';

const Index = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { flights, dictionaries, loading, error, searchFlights } = useFlightSearch();
  const { savedSearches, loading: savedLoading, saveSearch, deleteSearch } = useSavedSearches();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();
  const [hasSearched, setHasSearched] = useState(false);

  const initialOrigin = searchParams.get('origin') || undefined;
  const initialDestination = searchParams.get('destination') || undefined;

  const handleSearch = (params: FlightSearchParams) => {
    setHasSearched(true);
    searchFlights(params);
    
    addRecentSearch({
      originCode: params.origin,
      originName: params.origin,
      destinationCode: params.destination,
      destinationName: params.destination,
    });
  };

  const handleSaveSearch = async (origin: Airport, destination: Airport) => {
    await saveSearch(
      origin.iataCode,
      origin.name || origin.iataCode,
      destination.iataCode,
      destination.name || destination.iataCode
    );
  };

  const handleQuickSearch = (originCode: string, destinationCode: string) => {
    window.history.pushState({}, '', `/?origin=${originCode}&destination=${destinationCode}`);
    window.location.reload();
  };

  const handleSelectDestination = (code: string) => {
    window.history.pushState({}, '', `/?destination=${code}`);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <HeroSection
        onSearch={handleSearch}
        onSaveSearch={handleSaveSearch}
        loading={loading}
        initialOrigin={initialOrigin}
        initialDestination={initialDestination}
      />

      {/* Quick Access Searches */}
      {!hasSearched && (
        <div className="container mx-auto px-4 py-8 space-y-4">
          {user && savedSearches.length > 0 && (
            <SavedSearches
              searches={savedSearches}
              loading={savedLoading}
              onSelect={handleQuickSearch}
              onDelete={deleteSearch}
            />
          )}
          
          {recentSearches.length > 0 && (
            <RecentSearches
              searches={recentSearches}
              onSelect={handleQuickSearch}
              onClear={clearRecentSearches}
            />
          )}
        </div>
      )}

      {/* Results Section */}
      {hasSearched ? (
        <div className="container mx-auto px-4 py-8">
          <FlightResults
            flights={flights}
            dictionaries={dictionaries}
            loading={loading}
            error={error}
          />
        </div>
      ) : (
        <>
          <FeaturedDestinations onSelectDestination={handleSelectDestination} />
          <ServicesSection />
          <TestimonialsSection />
          <NewsletterSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;