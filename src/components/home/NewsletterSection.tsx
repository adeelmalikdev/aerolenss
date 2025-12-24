import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function NewsletterSection() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success('Thanks for subscribing! You\'ll receive our best deals.');
      setEmail('');
    }
  };

  return (
    <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Subscribe & Receive Our Exclusive Offers
          </h2>
          <p className="text-primary-foreground/80 mb-8">
            Get the best flight deals delivered straight to your inbox
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 bg-primary-foreground text-foreground placeholder:text-muted-foreground border-0"
              required
            />
            <Button 
              type="submit"
              variant="secondary"
              size="lg"
              className="h-12 px-8"
            >
              Subscribe <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}