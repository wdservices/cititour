import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { DOC_SECTIONS, DocSection, DocTopic } from "@/content/docs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Camera, ArrowLeft, ExternalLink } from "lucide-react";

function ScreenshotPlaceholder({ label }: { label: string }) {
  return (
    <div className="my-6 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 p-8 flex flex-col items-center justify-center gap-3 min-h-[200px]">
      <Camera className="w-10 h-10 text-muted-foreground/30" />
      <span className="text-sm text-muted-foreground/50 font-medium">{label}</span>
      <span className="text-xs text-muted-foreground/30">Screenshot coming soon</span>
    </div>
  );
}

function TopicCard({ topic }: { topic: DocTopic }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 md:p-6 text-left hover:bg-muted/50 transition-colors"
      >
        <div>
          <h4 className="font-display text-lg font-bold">{topic.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{topic.description}</p>
        </div>
        <div className="ml-4 shrink-0">
          {open ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-5 md:px-6 pb-6 border-t border-border">
          <div className="pt-5 space-y-5">
            {topic.screenshot && <ScreenshotPlaceholder label={topic.screenshot} />}

            {topic.steps && topic.steps.length > 0 && (
              <div>
                <h5 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Steps</h5>
                <ol className="space-y-2">
                  {topic.steps.map((step, i) => {
                    const isSubStep = step.startsWith('  •');
                    if (isSubStep) {
                      return (
                        <li key={i} className="ml-6 text-sm text-muted-foreground list-none flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{step.trim().replace(/^•\s*/, '')}</span>
                        </li>
                      );
                    }
                    return (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs mt-0.5">
                          {i + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {topic.tips && topic.tips.length > 0 && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <h5 className="text-sm font-bold text-primary mb-2">💡 Tips</h5>
                <ul className="space-y-1.5">
                  {topic.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {topic.note && (
              <div className="rounded-xl bg-yellow-500/5 border border-yellow-500/10 p-4">
                <p className="text-sm text-muted-foreground">{topic.note}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionBlock({ section, index }: { section: DocSection; index: number }) {
  const [expanded, setExpanded] = useState(index < 2);

  return (
    <section id={section.id} className="scroll-mt-24">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 mb-4 group"
      >
        <span className="text-3xl">{section.icon}</span>
        <div className="text-left flex-1">
          <h2 className="font-display text-2xl md:text-3xl font-extrabold group-hover:text-primary transition-colors">
            {section.title}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">{section.description}</p>
        </div>
        <div className="ml-4 shrink-0">
          {expanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="space-y-3 ml-0 md:ml-16">
          {section.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function DocsPage() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="CitiTour Help Center — User Guide & Documentation"
        description="Complete guide to using CitiTour. Learn how to discover places, book events, shop on the marketplace, manage your wallet, and more."
        canonicalUrl="/docs"
      />

      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-extrabold">CitiTour</span>
            </Link>
            <span className="text-muted-foreground text-sm hidden md:inline">/</span>
            <span className="text-sm font-medium hidden md:inline">Help Center</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" className="rounded-full hidden md:flex">
              <Link to="/contact-support">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 flex gap-10 py-10 md:py-16 max-w-7xl">
        {/* Sidebar Navigation — Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 px-3">
              Topics
            </h3>
            {DOC_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </a>
            ))}

            <div className="!mt-6 pt-6 border-t border-border">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to top
              </a>
            </div>
          </nav>
        </aside>

        {/* Mobile Nav Toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setMobileNav(!mobileNav)}
            className="rounded-full shadow-lg h-12 w-12 p-0"
          >
            {mobileNav ? "✕" : "☰"}
          </Button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNav && (
          <div className="lg:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-lg font-bold">Navigation</h3>
                <Button variant="ghost" onClick={() => setMobileNav(false)}>✕</Button>
              </div>
              <nav className="space-y-1">
                {DOC_SECTIONS.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setMobileNav(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 min-w-0 max-w-4xl">
          {/* Hero */}
          <div className="mb-12">
            <div className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              User Guide
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-4">
              CitiTour Help Center
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Everything you need to know about using CitiTour — from creating your account
              to managing listings, buying event tickets, and funding your wallet.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {DOC_SECTIONS.slice(0, 4).map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="p-4 rounded-xl border border-border bg-card hover:shadow-card transition-shadow text-center"
              >
                <span className="text-2xl block mb-2">{section.icon}</span>
                <span className="text-sm font-semibold">{section.title}</span>
              </a>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {DOC_SECTIONS.map((section, i) => (
              <SectionBlock key={section.id} section={section} index={i} />
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-muted/50 border border-border text-center">
            <h3 className="font-display text-2xl font-extrabold mb-3">
              Still need help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Our support team is available 24/7. Reach out via live chat, email, or phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="rounded-full">
                <Link to="/contact-support">Contact Support</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link to="/feedback">Send Feedback</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
