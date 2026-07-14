import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TourPH</span>
          </div>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to home</Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: October 2024</p>

          <div className="space-y-8 text-foreground/90">
            <section>
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p>
                We value your privacy. This policy explains what information we collect, how we use it, and the choices you have. By using TourPH, you agree to this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account details such as name, email, and profile preferences.</li>
                <li>Activity data like check-ins, favourites, and reviews you submit.</li>
                <li>Device and usage data for performance, diagnostics, and security.</li>
                <li>Location data when enabled, to show nearby places and events.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use Information</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide core features such as discovery, booking, and reviews.</li>
                <li>Personalize recommendations and improve the product experience.</li>
                <li>Detect fraud, ensure platform security, and enforce our Terms.</li>
                <li>Communicate updates, respond to support requests, and send alerts you opt into.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Sharing</h2>
              <p>
                We do not sell your personal data. We may share limited information with trusted service providers (e.g., payment, analytics, hosting) strictly to operate TourPH. These providers adhere to comparable privacy safeguards.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Update or delete your account information in Settings.</li>
                <li>Manage analytics and notifications preferences in Privacy and Notifications settings.</li>
                <li>Control location permissions in your device settings.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Data Retention</h2>
              <p>
                We retain data for as long as your account is active or as needed to provide services and meet legal obligations. You may request deletion of your account data via Support.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Security</h2>
              <p>
                We apply industry-standard security practices, including access controls, encryption in transit, and regular audits. No system is 100% secure; we work continuously to protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Contact</h2>
              <p>
                For privacy questions or requests, contact Support via the <Link to="/contact-support" className="underline">Contact Support</Link> page.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;