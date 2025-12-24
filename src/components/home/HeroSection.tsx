import { useState } from 'react';
import heroImage from '@/assets/hero-airplane.jpg';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FlightSearchForm } from '@/components/flight/FlightSearchForm';
import { MyTripForm } from '@/components/flight/MyTripForm';
import { CheckInForm } from '@/components/flight/CheckInForm';
import { FlightStatusForm } from '@/components/flight/FlightStatusForm';
import { Airport, FlightSearchParams } from '@/types/flight';

interface HeroSectionProps {
  onSearch: (params: FlightSearchParams) => void;
  onSaveSearch?: (origin: Airport, destination: Airport) => void;
  loading?: boolean;
  initialOrigin?: string;
  initialDestination?: string;
}

export function HeroSection({ 
  onSearch, 
  onSaveSearch, 
  loading, 
  initialOrigin, 
  initialDestination 
}: HeroSectionProps) {
  const [activeTab, setActiveTab] = useState('book');

  return (
    <section className="relative min-h-[600px] lg:min-h-[700px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Airplane wing view"
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20 lg:pt-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Take Off With<br />
            <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-lg">
            Compare millions of flights to find the best deals. Search, compare, and book your perfect journey with ease.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-muted/50 h-12 p-1">
              <TabsTrigger value="book" className="px-8 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Book
              </TabsTrigger>
              <TabsTrigger value="my-trip" className="px-8 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                My Trip
              </TabsTrigger>
              <TabsTrigger value="check-in" className="px-8 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Check In
              </TabsTrigger>
              <TabsTrigger value="flight-status" className="px-8 h-10 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                Flight Status
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {activeTab === 'book' && (
            <FlightSearchForm
              onSearch={onSearch}
              onSaveSearch={onSaveSearch}
              loading={loading}
              initialOrigin={initialOrigin}
              initialDestination={initialDestination}
            />
          )}

          {activeTab === 'my-trip' && <MyTripForm />}

          {activeTab === 'check-in' && <CheckInForm />}

          {activeTab === 'flight-status' && <FlightStatusForm />}
        </div>
      </div>
    </section>
  );
}