import { Hotel, Car, CreditCard, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const services = [
  {
    id: 1,
    icon: Hotel,
    title: 'Hotel Booking',
    description: 'Up to 50% off on hotels worldwide',
  },
  {
    id: 2,
    icon: Car,
    title: 'Car Rental',
    description: 'Over 10,000 locations worldwide',
  },
  {
    id: 3,
    icon: CreditCard,
    title: 'Travel Insurance',
    description: 'Comprehensive coverage for your trip',
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Our Additional Services
          </h2>
          <p className="text-muted-foreground">
            Everything you need for the perfect trip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {services.map((service) => (
            <Card 
              key={service.id} 
              className="group text-center hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20"
            >
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.description}
                </p>
                <Button variant="link" className="text-primary p-0 h-auto">
                  Book Now <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button variant="outline" size="lg">
            View More Services
          </Button>
        </div>
      </div>
    </section>
  );
}