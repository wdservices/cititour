import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
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
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: July 2026</p>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold mb-2">1. Overview</h2>
              <p>
                We value your privacy. This policy explains what information CitiTour collects, how we use it, and the choices you have. By using CitiTour, you agree to this policy. CitiTour is operated by WDServices (hello.bluewavestech@gmail.com).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
              <p className="mb-3">We collect the following types of information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account information:</strong> Your name, email address, and profile data when you sign up via email or Google.</li>
                <li><strong>Location data:</strong> When you enable location services, we collect your approximate or precise location to show nearby places, events, and localised content. Your city and state are stored with your listings and events.</li>
                <li><strong>Payment information:</strong> When you fund your wallet or purchase event tickets, payment is processed by Paystack. We do not store your card or bank details on our servers. Paystack's own <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer" className="underline text-primary">privacy policy</a> applies to payment data.</li>
                <li><strong>Wallet data:</strong> Your wallet balance and transaction history are stored in Firebase Firestore, linked to your account.</li>
                <li><strong>Listing content:</strong> Business details, product information, property listings, event details, images, and descriptions you create through your dashboard.</li>
                <li><strong>Reviews and feedback:</strong> Reviews, ratings, and feedback you submit on businesses, events, and products.</li>
                <li><strong>Favourites:</strong> Businesses, events, and products you save to your favourites.</li>
                <li><strong>Ticket orders:</strong> Event registrations, ticket purchases, and attendee information you provide.</li>
                <li><strong>Device and usage data:</strong> Browser type, device information, pages viewed, and interaction data for analytics and security.</li>
                <li><strong>Activity logs:</strong> Actions you take on the Platform (sign-ins, listing creation, payments, etc.) for security and audit purposes.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">3. How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide core features — discovery, marketplace, event ticketing, bill splitting, and wallet management.</li>
                <li>Process payments and manage your wallet through Paystack.</li>
                <li>Display your location-based content and localised branding (e.g., TourLAG, TourRIV, TourABJ).</li>
                <li>Personalize recommendations and improve the Platform experience.</li>
                <li>Communicate updates, respond to support requests, and send notifications you opt into.</li>
                <li>Detect fraud, ensure platform security, and enforce our Terms of Use.</li>
                <li>Generate anonymised analytics about Platform usage.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">4. Data Storage and Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>User accounts and data are stored on <strong>Firebase</strong> (Google Cloud), with industry-standard encryption in transit and at rest.</li>
                <li>Images you upload are stored on <strong>Cloudinary</strong>, a cloud-based image management service.</li>
                <li>Payments are processed by <strong>Paystack</strong> — we never see or store your full card or bank details.</li>
                <li>We use session-based authentication — your sign-in state is cleared when you close your browser or reload the page.</li>
                <li>We apply access controls, encrypted connections (HTTPS), and regular security reviews. No system is 100% secure; we work continuously to protect your information.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">5. Data Sharing</h2>
              <p className="mb-3">
                We do not sell your personal data. We may share limited information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Paystack</strong> — to process payments and withdrawals.</li>
                <li><strong>Firebase / Google</strong> — for authentication, database hosting, and analytics.</li>
                <li><strong>Cloudinary</strong> — for image storage and delivery.</li>
                <li><strong>LocationIQ</strong> — for address geocoding and map pin placement (we send search queries; they do not receive your identity).</li>
                <li><strong>Event organizers</strong> — when you register for an event, your name, email, and phone are shared with the organizer.</li>
                <li><strong>Legal authorities</strong> — if required by law or to protect the safety of users and the public.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">6. Your Choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update or delete your account information in <strong>Settings</strong>.</li>
                <li>Control location permissions in your browser or device settings.</li>
                <li>Manage notification preferences in <strong>Settings</strong>.</li>
                <li>Export or delete your data by contacting support.</li>
                <li>Remove your favourites, reviews, and listings at any time from your dashboard.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active or as needed to provide services and meet legal obligations. When you delete your account, we remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., financial records).
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">8. Cookies and Tracking</h2>
              <p>
                CitiTour uses essential cookies for authentication and session management. We do not use third-party advertising cookies or cross-site tracking. Analytics data is collected anonymously to improve the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">9. Children's Privacy</h2>
              <p>
                CitiTour is not intended for users under the age of 13. We do not knowingly collect information from children. If we learn that we have collected data from a child under 13, we will delete it promptly.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify users of material changes through the Platform or by email. Continued use of CitiTour after changes are posted constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">11. Contact</h2>
              <p>
                For privacy questions, data requests, or complaints, contact us via the <Link to="/contact-support" className="underline text-primary">Contact Support</Link> page or email <a href="mailto:hello.bluewavestech@gmail.com" className="underline text-primary">hello.bluewavestech@gmail.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
