import { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const faqs = [
  {
    category: 'Booking',
    questions: [
      {
        q: 'How do I book a flight?',
        a: 'Simply enter your departure and arrival cities, select your travel dates, and click "Search Flights". Browse the results, select your preferred flight, and follow the booking process.',
      },
      {
        q: 'Can I book a round-trip flight?',
        a: 'Yes! Select the "Round Trip" option in the search form to search for outbound and return flights together.',
      },
      {
        q: 'How do I get my booking confirmation?',
        a: 'After completing your booking, you\'ll receive a confirmation email with your booking reference. You can also find your bookings in the "My Trip" section.',
      },
    ],
  },
  {
    category: 'Check-in',
    questions: [
      {
        q: 'When can I check in online?',
        a: 'Online check-in typically opens 24 hours before your scheduled departure and closes 2 hours before departure. Times may vary by airline.',
      },
      {
        q: 'How do I check in?',
        a: 'Go to the "Check In" tab on our homepage, enter your booking reference and last name, then follow the prompts to complete check-in.',
      },
      {
        q: 'Can I select my seat during check-in?',
        a: 'Seat selection availability depends on the airline and fare type. Most airlines offer seat selection during online check-in.',
      },
    ],
  },
  {
    category: 'Changes & Cancellations',
    questions: [
      {
        q: 'How do I change my flight?',
        a: 'To change your flight, go to "My Trip", find your booking, and select "Modify Booking". Change fees and fare differences may apply.',
      },
      {
        q: 'What is the cancellation policy?',
        a: 'Cancellation policies vary by airline and fare type. Check your booking confirmation for specific terms, or contact customer support for assistance.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Refunds typically take 7-14 business days to process, depending on your payment method and bank.',
      },
    ],
  },
  {
    category: 'Account',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign In" in the top right corner, then select "Sign Up" to create a new account with your email address.',
      },
      {
        q: 'Can I save my search preferences?',
        a: 'Yes! Sign in to your account to save favorite routes, set price alerts, and access your search history.',
      },
      {
        q: 'How do I reset my password?',
        a: 'On the sign-in page, click "Forgot Password" and enter your email. You\'ll receive a link to reset your password.',
      },
    ],
  },
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    document.title = 'Help Center | AeroLens';
  }, []);

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
           q.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  const handleContactAction = (type: 'chat' | 'email' | 'phone') => {
    switch (type) {
      case 'chat':
        toast.info('Live chat support coming soon!');
        break;
      case 'email':
        window.location.href = 'mailto:support@aerolens.com';
        break;
      case 'phone':
        toast.info('Phone support: 1-800-AEROLENS');
        break;
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Help Center</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find answers to common questions or reach out to our support team.
          </p>

          {/* Search */}
          <div className="relative mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
              aria-label="Search help articles"
            />
          </div>

          {/* FAQs */}
          <div className="space-y-8 mb-16">
            {filteredFaqs.map((category) => (
              <section key={category.category} aria-labelledby={`category-${category.category}`}>
                <h2 id={`category-${category.category}`} className="text-xl font-semibold mb-4">{category.category}</h2>
                <div className="space-y-2">
                  {category.questions.map((item, index) => {
                    const id = `${category.category}-${index}`;
                    const isOpen = openItems.includes(id);
                    return (
                      <div key={id} className="border rounded-lg">
                        <button
                          onClick={() => toggleItem(id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                          aria-expanded={isOpen}
                          aria-controls={`answer-${id}`}
                        >
                          <span className="font-medium">{item.q}</span>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" aria-hidden="true" />
                          )}
                        </button>
                        {isOpen && (
                          <div id={`answer-${id}`} className="px-4 pb-4 text-muted-foreground">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Contact Options */}
          <section className="bg-card rounded-xl border p-8" aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-2xl font-bold mb-6">Still need help?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Chat with our support team
                </p>
                <Button variant="outline" size="sm" onClick={() => handleContactAction('chat')}>
                  Start Chat
                </Button>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  support@aerolens.com
                </p>
                <Button variant="outline" size="sm" onClick={() => handleContactAction('email')}>
                  Send Email
                </Button>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2">Phone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  1-800-AEROLENS
                </p>
                <Button variant="outline" size="sm" onClick={() => handleContactAction('phone')}>
                  Call Now
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}