import { useEffect } from 'react';
import { Plane, Users, Globe, Shield } from 'lucide-react';

export default function About() {
  useEffect(() => {
    document.title = 'About Us | AeroLens';
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About AeroLens</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8">
              AeroLens is your trusted partner in finding the best flight deals worldwide. 
              We compare millions of flights to help you travel smarter and save more.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <article className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Plane className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                <p className="text-muted-foreground">
                  To make flight booking simple, transparent, and affordable for everyone. 
                  We believe everyone deserves to explore the world.
                </p>
              </article>

              <article className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Our Team</h3>
                <p className="text-muted-foreground">
                  A passionate team of travel enthusiasts and tech experts working together 
                  to revolutionize how you search for flights.
                </p>
              </article>

              <article className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
                <p className="text-muted-foreground">
                  We partner with hundreds of airlines and travel providers to bring you 
                  comprehensive flight options across the globe.
                </p>
              </article>

              <article className="bg-card rounded-xl p-6 border">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust & Security</h3>
                <p className="text-muted-foreground">
                  Your data security is our priority. We use industry-standard encryption 
                  to protect your information.
                </p>
              </article>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2024, AeroLens was born from a simple frustration: finding affordable 
              flights shouldn't be complicated. Our founders, frequent travelers themselves, 
              set out to create a platform that puts the user first.
            </p>
            <p className="text-muted-foreground mb-4">
              Today, we help millions of travelers find their perfect flights. From budget 
              backpackers to business travelers, AeroLens serves everyone with the same 
              commitment to transparency and value.
            </p>

            <h2 className="text-2xl font-bold mt-12 mb-4">Why Choose AeroLens?</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Compare prices from hundreds of airlines and travel sites</li>
              <li>No hidden fees - the price you see is the price you pay</li>
              <li>Smart filters to find exactly what you're looking for</li>
              <li>24/7 customer support for peace of mind</li>
              <li>Price alerts to catch the best deals</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}