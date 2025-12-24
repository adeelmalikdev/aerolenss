import { Plane, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Newsroom', href: '#' },
    { label: 'Investor Relations', href: '#' },
    { label: 'Legal', href: '#' },
    { label: 'Privacy Policy', href: '#' },
  ],
  customerService: [
    { label: 'Help Center', href: '#' },
    { label: 'Feedback', href: '#' },
    { label: 'Air Traveler Rights', href: '#' },
    { label: 'Delay Plan', href: '#' },
    { label: 'Site Map', href: '#' },
  ],
  products: [
    { label: 'Optional Services & Fees', href: '#' },
    { label: 'Corporate Travel', href: '#' },
    { label: 'Travel Agents', href: '#' },
    { label: 'Gift Certificates', href: '#' },
    { label: 'Travel Insurance', href: '#' },
    { label: 'Cargo', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-card border-t py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Plane className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">SkyFinder</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Your trusted partner for finding the best flight deals worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">About SkyFinder</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Customer Services</h4>
            <ul className="space-y-2">
              {footerLinks.customerService.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Products & Services</h4>
            <ul className="space-y-2">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} SkyFinder. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}