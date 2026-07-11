import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Ticket, QrCode, Users, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: Calendar, title: "Create your event", body: "Name, date, venue, ticket tiers. Under 3 minutes." },
  { icon: Ticket, title: "Sell in-app", body: "Users pay via card, transfer or wallet. You get paid weekly." },
  { icon: QrCode, title: "Scan at the door", body: "Every ticket has a unique QR. Validate with the admin app." },
  { icon: TrendingUp, title: "Track & retarget", body: "See attendee analytics and promote your next event to buyers." },
];

const stats = [
  { value: "8%", label: "Commission per ticket" },
  { value: "\u20a6120M+", label: "Tickets sold on-platform" },
  { value: "24h", label: "Payout window" },
];

export default function HostAnEventPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Host an Event & Sell Tickets in Nigeria — CitiTour"
        description="Sell tickets to your Lagos, Abuja or Port Harcourt event on CitiTour. QR entry, weekly payouts, in-app promotion. 8% flat commission."
        canonicalUrl="/host-an-event"
        keywords={["sell event tickets nigeria", "lagos event platform", "qr ticketing nigeria"]}
      />

      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold">CitiTour</Link>
          <Button asChild className="rounded-full"><Link to="/auth">Sign in</Link></Button>
        </div>
      </header>

      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-95 -z-10" />
        <div className="container mx-auto px-4 max-w-4xl text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-semibold uppercase tracking-wider mb-6">
            <Ticket className="w-3.5 h-3.5" /> Ticketing
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.02] mb-6">
            Host it. Sell it out.
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            The easiest way to sell tickets to concerts, brunches, launches and members-only nights across Nigeria.
          </p>
          <Button asChild size="lg" className="rounded-full bg-white text-ink hover:bg-white/90 h-14 px-8 text-base font-semibold">
            <Link to="/event-tickets">Create event <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>

          <div className="mt-14 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.label}>
                <div className="font-display text-4xl md:text-5xl font-extrabold">{s.value}</div>
                <div className="text-sm opacity-80 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mb-14">
            <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">How it works</div>
            <h2 className="font-display text-4xl md:text-5xl font-extrabold">From idea to sold-out, in one flow.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div key={s.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="text-xs font-mono text-muted-foreground mb-2">STEP {String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Users className="w-10 h-10 mx-auto text-primary mb-4" />
          <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">Your audience is already here.</h2>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            50,000+ active users across Lagos, Abuja and Port Harcourt open CitiTour every week looking for their next night out.
          </p>
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8">
            <Link to="/event-tickets">Start selling tickets</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CitiTour</p>
          <div className="flex gap-6"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link></div>
        </div>
      </footer>
    </div>
  );
}
