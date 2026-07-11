import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { POSTS } from "@/content/blog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="CitiTour Blog — Nigerian City Life, Food & Culture"
        description="City guides, food stories and product updates from CitiTour. Curated for Lagos, Abuja and Port Harcourt."
        canonicalUrl="/blog"
      />

      <header className="border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold">CitiTour</Link>
          <Button asChild className="rounded-full"><Link to="/auth">Sign in</Link></Button>
        </div>
      </header>

      <section className="py-16 md:py-24 border-b border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">Field notes</div>
          <h1 className="font-display text-5xl md:text-6xl font-extrabold mb-4">The CitiTour Journal</h1>
          <p className="text-muted-foreground text-lg">City guides, restaurant reviews and how we\u2019re building the platform.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <ul className="space-y-6">
            {POSTS.map(p => (
              <li key={p.slug}>
                <Link to={`/blog/${p.slug}`}
                  className="group block p-6 md:p-8 rounded-2xl bg-card border border-border hover:shadow-card transition-shadow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {p.tags.map(t => (
                      <span key={t} className="text-xs font-semibold uppercase tracking-wider text-primary">#{t}</span>
                    ))}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold mb-2 group-hover:text-primary transition-colors">{p.title}</h2>
                  <p className="text-muted-foreground mb-4">{p.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(p.date).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {p.readMinutes} min read</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
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
