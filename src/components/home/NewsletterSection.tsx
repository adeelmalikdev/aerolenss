import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNewsletter } from '@/hooks/useNewsletter';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const { subscribe, loading } = useNewsletter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const success = await subscribe(email);
      if (success) setEmail('');
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
              disabled={loading}
            >
              {loading ? 'Subscribing...' : 'Subscribe'} <Send className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
