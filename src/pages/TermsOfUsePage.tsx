import { Link } from 'react-router-dom';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/cititour-logo.png" alt="CitiTour" className="w-9 h-9 rounded-xl object-contain" style={{ filter: 'brightness(0) invert(33%) sepia(98%) saturate(3463%) hue-rotate(195deg) brightness(97%) contrast(96%)' }} />
            <span className="text-xl font-bold text-foreground">CitiTour</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Use</h1>
          <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p>
                By accessing or using CitiTour ("the Platform"), you agree to these Terms of Use. If you do not agree, please discontinue use immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
              <p className="mb-3">
                CitiTour is Nigeria's urban concierge platform. The Platform enables you to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Discover and review businesses, restaurants, hotels, fun places, and attractions across Nigerian cities.</li>
                <li>Browse and purchase products and services on the Marketplace from local sellers.</li>
                <li>Find, register for, and purchase tickets to events and experiences.</li>
                <li>List and manage your own businesses, products, properties, and events through your dashboard.</li>
                <li>Fund a digital wallet and use it to pay for event tickets and other services.</li>
                <li>Split bills with friends using the Split It feature.</li>
                <li>Run advertisements to promote your listings.</li>
                <li>Save favourites, leave reviews, and share listings with others.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. Accounts</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must be at least 13 years old to use CitiTour.</li>
                <li>You may sign up using your email address or Google account.</li>
                <li>You are responsible for maintaining the security of your account and for all activity that occurs under it.</li>
                <li>You must provide accurate and complete information when creating your account.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Session-based authentication is used — you will be required to sign in again when you reload the page or open a new browser session.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Listings and Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>When you create a listing (business, product, property, or event), you confirm that you have the right to do so and that the information is accurate.</li>
                <li>Listings must comply with Nigerian law and must not contain misleading, fraudulent, or harmful content.</li>
                <li>CitiTour reserves the right to remove listings that violate these Terms or community guidelines.</li>
                <li>You retain ownership of content you submit, but grant CitiTour a license to display, distribute, and promote it on the Platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Marketplace</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>The Marketplace connects buyers and sellers. CitiTour is not a party to any transaction between buyers and sellers.</li>
                <li>Sellers are responsible for the accuracy of their product listings, pricing, and fulfillment of orders.</li>
                <li>Buyers should review product details carefully before making a purchase.</li>
                <li>Discount and promo pricing displayed on products is set by the seller and may change at any time.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Events and Ticketing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Event organizers are responsible for the accuracy of event details, ticket pricing, and event execution.</li>
                <li>When you register for a paid event, your payment is processed through Paystack. CitiTour does not store your card details.</li>
                <li>Refund and cancellation policies are set by the event organizer. Check the event details before purchasing.</li>
                <li>Event tickets are non-transferable unless explicitly stated by the organizer.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Wallet and Payments</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>CitiTour offers a digital wallet that can be funded via Paystack (card, bank transfer, or USSD).</li>
                <li>Wallet funds can be used to purchase event tickets on the Platform.</li>
                <li>Withdrawals from the wallet are processed to a verified Nigerian bank account via Paystack Transfer.</li>
                <li>A service fee applies to wallet withdrawals as displayed at the time of withdrawal.</li>
                <li>Wallet funds are non-transferable between users and have no cash value outside the Platform.</li>
                <li>CitiTour is not responsible for delays caused by Paystack or your bank.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Reviews and User Content</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Reviews and feedback you submit must be honest, accurate, and based on your genuine experience.</li>
                <li>You must not submit content that is defamatory, obscene, or violates the rights of others.</li>
                <li>CitiTour may remove reviews that violate these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Prohibited Conduct</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Do not attempt to gain unauthorized access to the Platform or other users' accounts.</li>
                <li>Do not use automated tools (bots, scrapers) to access or collect data from the Platform.</li>
                <li>Do not interfere with or disrupt the Platform's infrastructure or security.</li>
                <li>Do not impersonate another person or entity.</li>
                <li>Do not use the Platform for any illegal purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Intellectual Property</h2>
              <p>
                All content, design, logos, and software on CitiTour are protected by intellectual property laws. You may not copy, distribute, modify, or create derivative works from any content on the Platform without prior written permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">11. Disclaimers</h2>
              <p>
                CitiTour is provided "as is" and "as available" without warranties of any kind. We do not guarantee uninterrupted availability, accuracy of listings or event information, or that the Platform will meet your specific requirements. We are not responsible for the conduct of users, businesses, event organizers, or sellers on the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">12. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by Nigerian law, CitiTour, its operators, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of data, revenue, or profits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">13. Termination</h2>
              <p>
                We may suspend or terminate your access to CitiTour at any time, without prior notice, for conduct that we believe violates these Terms, is harmful to other users, or is for security reasons. You may also delete your account at any time from the Settings page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">14. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of CitiTour after changes are posted constitutes your acceptance of the updated Terms. We will notify users of material changes through the Platform or by email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">15. Governing Law</h2>
              <p>
                These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of the Nigerian courts.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">16. Contact</h2>
              <p>
                For questions about these Terms, contact us via the <Link to="/contact-support" className="underline text-primary hover:underline">Contact Support</Link> page or email <a href="mailto:hello.bluewavestech@gmail.com" className="underline text-primary">hello.bluewavestech@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUsePage;
