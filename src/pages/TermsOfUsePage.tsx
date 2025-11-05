import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TourPH</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Terms of Use</h1>
          <p className="text-muted-foreground mb-8">Last updated: October 2024</p>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold mb-2">Acceptance of Terms</h2>
              <p>
                By accessing or using TourPH, you agree to these Terms. If you do not agree, please discontinue use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Use of Service</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Follow applicable laws and respect community guidelines.</li>
                <li>Do not misuse features, disrupt services, or attempt unauthorized access.</li>
                <li>Content you submit (reviews, photos) must be accurate and lawful.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Accounts</h2>
              <p>
                You are responsible for maintaining account security and for all activity under your account. Notify us of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Bookings and Payments</h2>
              <p>
                Some features involve bookings or payments handled by third‑party providers. Terms of those providers also apply.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Content and IP</h2>
              <p>
                TourPH content is protected by intellectual property laws. You may not copy, distribute, or modify content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Disclaimers</h2>
              <p>
                TourPH is provided "as is" without warranties. We do not guarantee availability, accuracy of listings, or fitness for a particular purpose.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, TourPH is not liable for indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Termination</h2>
              <p>
                We may suspend or terminate access for violations of these Terms or for security reasons.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
              <p>
                We may update these Terms. Continued use after changes constitutes acceptance. We will provide notice of material updates.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p>
                For questions about these Terms, contact Support via the <Link to="/contact-support" className="underline">Contact Support</Link> page.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUsePage;