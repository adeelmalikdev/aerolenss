import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookings, Booking } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { Plane, Calendar, MapPin, User, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export function MyTripForm() {
  const [bookingReference, setBookingReference] = useState('');
  const [lastName, setLastName] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);
  const { findBooking, loading } = useBookings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingReference.trim() || !lastName.trim()) return;
    
    const booking = await findBooking(bookingReference.toUpperCase(), lastName);
    setFoundBooking(booking);
    setSearched(true);
  };

  const flightData = foundBooking?.flight_data as {
    airline?: string;
    flightNumber?: string;
    origin?: string;
    destination?: string;
    departureTime?: string;
    arrivalTime?: string;
    price?: number;
  } | null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="booking-ref">Booking Reference</Label>
            <Input
              id="booking-ref"
              placeholder="e.g., ABC123"
              value={bookingReference}
              onChange={(e) => setBookingReference(e.target.value.toUpperCase())}
              maxLength={6}
              className="uppercase"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last Name</Label>
            <Input
              id="last-name"
              placeholder="Enter passenger last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" disabled={loading || !bookingReference || !lastName}>
          {loading ? 'Searching...' : 'Find My Booking'}
        </Button>
      </form>

      {searched && !foundBooking && (
        <div className="bg-muted/50 rounded-lg p-6 text-center">
          <p className="text-muted-foreground">
            No booking found with that reference and last name.
          </p>
          {!user && (
            <p className="text-sm text-muted-foreground mt-2">
              <button 
                onClick={() => navigate('/auth')}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
              {' '}to view all your bookings.
            </p>
          )}
        </div>
      )}

      {foundBooking && flightData && (
        <div className="bg-muted/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5 text-primary" />
              <span className="font-semibold">{flightData.airline} {flightData.flightNumber}</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              foundBooking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
              foundBooking.status === 'checked_in' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {foundBooking.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">From</p>
                <p className="font-medium">{flightData.origin}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">To</p>
                <p className="font-medium">{flightData.destination}</p>
              </div>
            </div>
          </div>

          {flightData.departureTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{format(new Date(flightData.departureTime), 'PPP')}</span>
              <Clock className="h-4 w-4 text-muted-foreground ml-4" />
              <span>{format(new Date(flightData.departureTime), 'p')}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>Passenger: {foundBooking.passenger_last_name}</span>
          </div>

          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Booking Reference: <span className="font-mono font-bold">{foundBooking.booking_reference}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
