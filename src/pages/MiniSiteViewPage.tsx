import { useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, MessageCircle, Star, Clock,
  ShieldCheck, Plus, Minus, ShoppingBag, Navigation, UtensilsCrossed, BedDouble, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import StampIcon from "@/components/StampIcon";
import { useToast } from "@/hooks/use-toast";
import { getMiniSite, formatNaira, MINI_SITE_TYPE_LABEL } from "@/content/miniSites";

const MiniSitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const site = getMiniSite(slug);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState<string>("All");
  const [cartOpen, setCartOpen] = useState(false);

  const sections = useMemo(() => {
    if (!site?.menu) return [];
    return ["All", ...Array.from(new Set(site.menu.map((m) => m.section)))];
  }, [site]);

  const items = site?.menu ?? [];
  const rooms = site?.rooms ?? [];

  const visibleItems = activeSection === "All" ? items : items.filter((i) => i.section === activeSection);

  const cartLines = items
    .filter((i) => cart[i.id])
    .map((i) => ({ ...i, qty: cart[i.id] }));
  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0);
  const cartTotal = cartLines.reduce((n, l) => n + l.qty * l.price, 0);

  if (!site) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Mini site not found</h1>
        <p className="text-sm text-muted-foreground">This listing may have been removed by an administrator.</p>
        <Button onClick={() => navigate("/mini-sites")}>Browse all mini sites</Button>
      </div>
    );
  }

  const setQty = (id: string, delta: number) =>
    setCart((prev) => {
      const next = { ...prev };
      const q = (next[id] || 0) + delta;
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });

  const placeOrder = () => {
    if (!cartCount) return;
    const lines = cartLines.map((l) => `${l.qty} x ${l.name}`).join(", ");
    toast({
      title: "Order sent to " + site.name,
      description: `${lines} — total ${formatNaira(cartTotal)}. The restaurant will confirm on WhatsApp.`,
    });
    window.open(
      `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
        `Hello ${site.name}, I'd like to order: ${lines}. Total ${formatNaira(cartTotal)}.`
      )}`,
      "_blank",
      "noopener"
    );
    setCart({});
    setCartOpen(false);
  };

  const isFood = site.type === "restaurant";
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(site.address)}`;

  return (
    <div className="pb-28">
      <SEO
        title={`${site.name} — ${MINI_SITE_TYPE_LABEL[site.type]} in ${site.city} | CitiTour`}
        description={site.tagline + ". " + site.description.slice(0, 110)}
        canonicalUrl={`${window.location.origin}/m/${site.slug}`}
      />

      {/* ── Hero ── */}
      <section className="relative -mx-4 -mt-6 h-64 overflow-hidden md:h-80">
        <img src={site.cover} alt={`${site.name} interior`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/45" />
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-medium text-foreground shadow-soft"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
          <div className="mx-auto max-w-5xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">{MINI_SITE_TYPE_LABEL[site.type]}</Badge>
              <Badge variant="secondary" className="gap-1 bg-card/95 text-foreground">
                <ShieldCheck className="h-3 w-3 text-success" /> Verified by CitiTour
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-background md:text-4xl">{site.name}</h1>
            <p className="mt-1 text-sm text-background/85 md:text-base">{site.tagline}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 max-w-5xl space-y-10">
        {/* ── Key facts ── */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { icon: Star, label: "Rating", value: `${site.rating} (${site.reviews})` },
            { icon: MapPin, label: "Location", value: site.city },
            { icon: Clock, label: "Hours", value: site.hours },
            {
              icon: isFood ? UtensilsCrossed : BedDouble,
              label: isFood ? "Average plate" : "From",
              value: formatNaira(site.priceFrom),
            },
          ].map((f) => (
            <div key={f.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <f.icon className="mb-2 h-4 w-4 text-primary" />
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-foreground">{f.value}</p>
            </div>
          ))}
        </section>

        {/* ── About ── */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold text-foreground">About</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{site.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {site.amenities.map((a) => (
              <span key={a} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-foreground">
                {a}
              </span>
            ))}
          </div>
        </section>

        {/* ── Menu (restaurants) ── */}
        {isFood && items.length > 0 && (
          <section id="menu">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Order online</p>
                <h2 className="text-2xl font-bold text-foreground">Food menu</h2>
              </div>
              <span className="text-sm text-muted-foreground">{items.length} items</span>
            </div>

            <div className="scrollbar-hide -mx-1 mb-4 flex gap-2 overflow-x-auto px-1 pb-1">
              {sections.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveSection(s)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    activeSection === s
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {visibleItems.map((item) => (
                <article key={item.id} className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold text-foreground">{item.name}</h3>
                      {item.popular && (
                        <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <span className="text-sm font-bold text-foreground">{formatNaira(item.price)}</span>
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2 rounded-full border border-primary px-1.5 py-1">
                          <button onClick={() => setQty(item.id, -1)} aria-label={`Remove one ${item.name}`}>
                            <Minus className="h-3.5 w-3.5 text-primary" />
                          </button>
                          <span className="min-w-4 text-center text-xs font-bold text-foreground">{cart[item.id]}</span>
                          <button onClick={() => setQty(item.id, 1)} aria-label={`Add one ${item.name}`}>
                            <Plus className="h-3.5 w-3.5 text-primary" />
                          </button>
                        </div>
                      ) : (
                        <Button size="sm" className="h-8 rounded-full px-3 text-xs" onClick={() => setQty(item.id, 1)}>
                          <Plus className="mr-1 h-3.5 w-3.5" /> Add
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Rooms (stays) ── */}
        {!isFood && rooms.length > 0 && (
          <section>
            <div className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Availability</p>
              <h2 className="text-2xl font-bold text-foreground">Rooms & rates</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <article key={room.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  <img src={room.image} alt={room.name} loading="lazy" className="h-36 w-full object-cover" />
                  <div className="space-y-2 p-4">
                    <h3 className="text-sm font-semibold text-foreground">{room.name}</h3>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{room.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Sleeps {room.capacity} · {room.beds} bed{room.beds > 1 ? "s" : ""}
                    </p>
                    <div className="flex items-center justify-between border-t border-border pt-3">
                      <span className="text-sm font-bold text-foreground">
                        {formatNaira(room.price)}
                        <span className="text-xs font-normal text-muted-foreground"> /night</span>
                      </span>
                      <Button
                        size="sm"
                        className="h-8 rounded-full px-3 text-xs"
                        onClick={() =>
                          toast({
                            title: "Reservation request sent",
                            description: `${site.name} — ${room.name}. You'll get a confirmation shortly.`,
                          })
                        }
                      >
                        Reserve
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── Gallery ── */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[site.cover, ...site.gallery].map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${site.name} photo ${i + 1}`}
                loading="lazy"
                className="h-36 w-full rounded-2xl object-cover md:h-44"
              />
            ))}
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-foreground">Find & contact</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" /> {site.address}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Phone, label: "Call", href: `tel:${site.phone.replace(/\s/g, "")}`, tone: "primary" as const },
              { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${site.whatsapp}`, tone: "success" as const },
              { icon: Mail, label: "Email", href: `mailto:${site.email}`, tone: "accent" as const },
              { icon: Navigation, label: "Directions", href: mapsUrl, tone: "primary-dark" as const },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border p-4 transition-colors hover:bg-muted"
              >
                <StampIcon icon={c.icon} tone={c.tone} size="sm" />
                <span className="text-sm font-semibold text-foreground">{c.label}</span>
              </a>
            ))}
          </div>
          {site.website && (
            <a
              href={site.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              <Globe className="h-4 w-4" /> {site.website.replace("https://", "")}
            </a>
          )}
        </section>

        <p className="text-center text-xs text-muted-foreground">
          Listed by CitiTour admin on {new Date(site.listedOn).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
          <Link to="/mini-sites" className="font-semibold text-primary hover:underline">
            Browse more mini sites
          </Link>
        </p>
      </div>

      {/* ── Order bar ── */}
      {isFood && cartCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-3 shadow-hero">
          <div className="mx-auto flex max-w-5xl items-center gap-3">
            <button
              onClick={() => setCartOpen((v) => !v)}
              className="flex flex-1 items-center gap-3 text-left"
            >
              <span className="relative rounded-full bg-primary p-2.5">
                <ShoppingBag className="h-4 w-4 text-primary-foreground" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </span>
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{formatNaira(cartTotal)}</span>
                <span className="block text-xs text-muted-foreground">{cartOpen ? "Hide items" : "View items"}</span>
              </span>
            </button>
            <Button className="rounded-full px-6" onClick={placeOrder}>
              Place order
            </Button>
          </div>

          {cartOpen && (
            <div className="mx-auto mt-3 max-w-5xl space-y-2 border-t border-border pt-3">
              {cartLines.map((l) => (
                <div key={l.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">
                    {l.qty} × {l.name}
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">{formatNaira(l.qty * l.price)}</span>
                    <button onClick={() => setQty(l.id, -l.qty)} aria-label={`Remove ${l.name}`}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniSitePage;
