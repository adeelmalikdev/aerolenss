import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Footer } from '@/components/home/Footer';
import { HotelSearchForm } from '@/components/hotel/HotelSearchForm';
import { HotelResults } from '@/components/hotel/HotelResults';
import { HotelDetailsModal } from '@/components/hotel/HotelDetailsModal';
import { useHotelSearch } from '@/hooks/useHotelSearch';
import { HotelOffer, HotelSearchParams } from '@/types/hotel';

export default function Hotels() {
  const { hotels, loading, error, searchHotels } = useHotelSearch();
  const [selectedHotel, setSelectedHotel] = useState<HotelOffer | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (params: HotelSearchParams) => {
    setHasSearched(true);
    searchHotels(params);
  };

  return (
    <>
      <Helmet>
        <title>Hotel Booking - Find & Book Hotels Worldwide | SkyWings</title>
        <meta 
          name="description" 
          content="Search and book hotels worldwide with SkyWings. Find the best deals on accommodation for your next trip." 
        />
      </Helmet>

      <main className="min-h-screen bg-background pt-20">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                Find Your Perfect Stay
              </h1>
              <p className="text-muted-foreground">
                Search and compare hotels from around the world
              </p>
            </div>
            <HotelSearchForm onSearch={handleSearch} loading={loading} />
          </div>
        </section>

        {/* Results section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <HotelResults 
              hotels={hotels}
              loading={loading}
              error={error}
              onSelectHotel={setSelectedHotel}
              hasSearched={hasSearched}
            />
          </div>
        </section>

        <Footer />
      </main>

      <HotelDetailsModal 
        hotel={selectedHotel}
        open={!!selectedHotel}
        onClose={() => setSelectedHotel(null)}
      />
    </>
  );
}
