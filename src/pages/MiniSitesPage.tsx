import { useMemo, useState } from "react";
import { Search, UtensilsCrossed, BedDouble, Building2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";
import MiniSiteCard from "@/components/MiniSiteCard";
import StampIcon from "@/components/StampIcon";
import { useMiniSites } from "@/hooks/useMiniSites";

const FILTERS = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "hotel", label: "Hotels", icon: Building2 },
  { id: "shortlet", label: "Shortlets", icon: BedDouble },
  { id: "restaurant", label: "Restaurants", icon: UtensilsCrossed },
] as const;

const MiniSitesPage = () => {
  const { sites, loading } = useMiniSites();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sites.filter((s) => {
      const matchType = filter === "all" || s.type === filter;
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      return matchType && matchQuery;
    });
  }, [sites, filter, query]);

  return (
    <div className="mx-auto max-w-6xl pb-12">
      <SEO
        title="Stays & Restaurants with Mini Websites | Citivas"
        description="Browse hotels, shortlets and restaurants running their own Citivas mini website — full menus, room rates, direct ordering and booking."
        canonicalUrl={`${window.location.origin}/mini-sites`}
      />

      {/* ── Header ── */}
      <header className="mb-6">
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Citivas mini websites</p>
        <h1 className="mt-1 text-3xl font-extrabold leading-tight text-foreground md:text-4xl">
          Stays &amp; restaurants, with their own storefront
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Every business here runs a full mini website on Citivas — photo gallery, live menu or room rates,
          contact details and one-tap ordering or booking.
        </p>
      </header>

      {/* ── Search + filters ── */}
      <div className="sticky top-[68px] z-20 -mx-4 mb-6 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city or cuisine…"
            className="h-11 rounded-full pl-10"
            aria-label="Search mini sites"
          />
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/50"
              }`}
            >
              <f.icon className="h-4 w-4" />
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-muted" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="group flex flex-col items-center gap-3 py-20 text-center">
          <StampIcon icon={Search} tone="muted" size="lg" />
          <h2 className="text-lg font-semibold text-foreground">No mini sites match that search</h2>
          <p className="text-sm text-muted-foreground">Try a different city, cuisine or clear the filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((site) => (
            <MiniSiteCard key={site.slug} site={site} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MiniSitesPage;
