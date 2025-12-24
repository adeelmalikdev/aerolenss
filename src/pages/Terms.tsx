export default function Terms() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 2024</p>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using SkyFinder's services, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Service Description</h2>
              <p className="text-muted-foreground mb-4">
                SkyFinder provides a flight search and comparison platform. We help you find and compare 
                flight options from various airlines and travel providers. When you make a booking, your 
                contract is with the airline or travel provider, not SkyFinder.
              </p>
              <p className="text-muted-foreground">
                We strive to provide accurate information, but prices and availability are subject to 
                change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and up-to-date information</li>
                <li>Notifying us of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Booking Terms</h2>
              <p className="text-muted-foreground mb-4">
                When making a booking through our platform:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You confirm that all passenger information is accurate</li>
                <li>You agree to the airline's terms and conditions</li>
                <li>You understand that fare rules and restrictions apply</li>
                <li>You accept responsibility for meeting travel requirements (visas, passports, etc.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Pricing and Payment</h2>
              <p className="text-muted-foreground mb-4">
                Prices displayed include taxes and fees unless otherwise stated. Additional charges may 
                apply for optional services such as baggage, seat selection, or changes.
              </p>
              <p className="text-muted-foreground">
                Payment is processed securely through our payment providers. We do not store complete 
                payment card details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Changes and Cancellations</h2>
              <p className="text-muted-foreground">
                Change and cancellation policies are determined by the airline or travel provider. 
                Fees may apply. Please review the fare rules before booking. Contact us or the 
                airline directly to request changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                SkyFinder acts as an intermediary and is not liable for:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Flight cancellations, delays, or changes by airlines</li>
                <li>Quality of service provided by airlines or partners</li>
                <li>Inaccuracies in third-party information</li>
                <li>Losses arising from the use of our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on SkyFinder, including logos, text, graphics, and software, is our 
                property or that of our licensors. You may not reproduce, distribute, or create 
                derivative works without our permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Prohibited Activities</h2>
              <p className="text-muted-foreground mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Use our services for any illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Interfere with the proper functioning of our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We may update these terms from time to time. Continued use of our services after 
                changes constitutes acceptance of the new terms. We encourage you to review these 
                terms periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact</h2>
              <p className="text-muted-foreground">
                For questions about these Terms of Service, please contact us at legal@skyfinder.com 
                or through our Help Center.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
