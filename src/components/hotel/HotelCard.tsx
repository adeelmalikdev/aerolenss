import { Star, MapPin, Wifi, Car, Coffee, Dumbbell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HotelOffer } from '@/types/hotel';

interface HotelCardProps {
  hotel: HotelOffer;
  onSelect: (hotel: HotelOffer) => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  WIFI: <Wifi className="h-4 w-4" />,
  PARKING: <Car className="h-4 w-4" />,
  RESTAURANT: <Coffee className="h-4 w-4" />,
  FITNESS_CENTER: <Dumbbell className="h-4 w-4" />,
};

export function HotelCard({ hotel, onSelect }: HotelCardProps) {
  const offer = hotel.offers?.[0];
  if (!offer) return null;

  const rating = hotel.hotel.rating ? parseInt(hotel.hotel.rating) : 0;
  const price = parseFloat(offer.price.total);
  const currency = offer.price.currency;
  
  // Calculate nights
  const checkIn = new Date(offer.checkInDate);
  const checkOut = new Date(offer.checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = (price / nights).toFixed(0);

  const amenities = hotel.hotel.amenities?.slice(0, 4) || [];

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image placeholder */}
        <div className="w-full md:w-64 h-48 md:h-auto bg-muted flex items-center justify-center relative">
          {hotel.hotel.media?.[0]?.uri ? (
            <img 
              src={hotel.hotel.media[0].uri} 
              alt={hotel.hotel.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-muted-foreground text-sm">No image available</div>
          )}
          {rating > 0 && (
            <div className="absolute top-2 left-2 bg-background/90 rounded-md px-2 py-1 flex items-center gap-1">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-primary text-primary" />
              ))}
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {hotel.hotel.name}
              </h3>
              
              {hotel.hotel.address && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {hotel.hotel.address.cityName}
                    {hotel.hotel.address.countryCode && `, ${hotel.hotel.address.countryCode}`}
                  </span>
                </div>
              )}

              {offer.room.typeEstimated?.category && (
                <Badge variant="secondary" className="mb-2">
                  {offer.room.typeEstimated.category.replace(/_/g, ' ')}
                </Badge>
              )}

              {amenities.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {amenities.map((amenity) => (
                    <div 
                      key={amenity} 
                      className="text-muted-foreground" 
                      title={amenity.replace(/_/g, ' ')}
                    >
                      {amenityIcons[amenity] || null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-end justify-between mt-4 pt-4 border-t border-border">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  {currency} {pricePerNight}
                </div>
                <div className="text-sm text-muted-foreground">
                  per night · {nights} night{nights > 1 ? 's' : ''} total: {currency} {price.toFixed(0)}
                </div>
              </div>
              <Button onClick={() => onSelect(hotel)}>
                View Deal
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
