import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin, Phone, Mail, Globe, MessageCircle, Star, Clock,
  ShieldCheck, Plus, Minus, ShoppingBag, UtensilsCrossed, BedDouble, X,
  Users, Wifi, ChevronDown, ChevronUp, Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import StampIcon from "@/components/StampIcon";
import { useToast } from "@/hooks/use-toast";
import { getMiniSite, findMiniSite, formatNaira, MINI_SITE_TYPE_LABEL } from "@/content/miniSites";
import { getAmenityInfo } from "@/lib/amenityIcons";
import { useMiniSites } from "@/hooks/useMiniSites";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format } from "date-fns";

/* ── Firestore room shape (from house_listings) ── */
interface DbRoom {
  name: string;
  bedType: string;
  bathrooms: number;
  maxOccupancy: number;
  quantity: number;
  pricePerNight: number;
  minNights: number;
  deposit: number;
  images: string[];
}

interface DbProperty {
  id: string;
  title: string;
  rooms: DbRoom[];
  ownerId?: string;
  userId?: string;
  location?: string;
  city?: string;
  state?: string;
}

/* ── Mini calendar ── */

const MiniSitePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sites, loading } = useMiniSites();
  const site = findMiniSite(sites, slug) ?? getMiniSite(slug);

  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeSection, setActiveSection] = useState<string>("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  /* ── Room booking state ── */
  const [dbRooms, setDbRooms] = useState<DbRoom[]>([]);
  const [dbProperty, setDbProperty] = useState<DbProperty | null>(null);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const sections = useMemo(() => {
    if (!site?.menu) return [];
    return ["All", ...Array.from(new Set(site.menu.map((m) => m.section)))];
  }, [site]);

  const items = site?.menu ?? [];
  const allImages = site ? [site.cover, ...site.gallery] : [];

  const visibleItems = activeSection === "All" ? items : items.filter((i) => i.section === activeSection);

  const cartLines = items
    .filter((i) => cart[i.id])
    .map((i) => ({ ...i, qty: cart[i.id] }));
  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0);
  const cartTotal = cartLines.reduce((n, l) => n + l.qty * l.price, 0);

  /* ── Fetch actual rooms from Firestore house_listings ── */
  useEffect(() => {
    if (!site || site.type === "restaurant") return;
    setRoomsLoading(true);
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "house_listings"), where("miniSiteActive", "==", true))
        );
        const match = snap.docs.find((d) => {
          const data = d.data();
          const titleSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
          return titleSlug === slug || d.id === site.sourceId;
        });
        if (match) {
          const data = match.data() as any;
          const rooms: DbRoom[] = Array.isArray(data.rooms) ? data.rooms : [];
          setDbRooms(rooms);
          setDbProperty({ id: match.id, ...data } as DbProperty);
        }
      } catch (e) {
        console.error("Failed to load rooms from DB:", e);
      } finally {
        setRoomsLoading(false);
      }
    })();
  }, [site, slug]);

  /* ── Derived room data ── */
  const displayRooms = useMemo(() => {
    if (dbRooms.length > 0) return dbRooms;
    return [];
  }, [dbRooms]);

  if (!site) {
    if (loading) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
          <p className="text-sm text-muted-foreground">Loading mini site…</p>
        </div>
      );
    }
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
        title={`${site.name} — ${MINI_SITE_TYPE_LABEL[site.type]} in ${site.city} | Citivas`}
        description={site.tagline + ". " + site.description.slice(0, 110)}
        canonicalUrl={`${window.location.origin}/m/${site.slug}`}
      />

      {/* ── Hero — full-width, edge-to-edge ── */}
      <section className="relative w-full h-[70vh] min-h-[480px] max-h-[700px]">
        <img
          src={site.cover}
          alt={`${site.name} — ${MINI_SITE_TYPE_LABEL[site.type]} in ${site.city}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Logo + Brand name */}
        <div className="absolute left-4 top-4 sm:left-8 sm:top-8 z-10 flex items-center gap-2.5 bg-white/95 rounded-xl px-4 py-2.5 shadow-lg">
          {site.logo ? (
            <img src={site.logo} alt={`${site.name} logo`} className="h-9 w-9 object-contain rounded" />
          ) : (
            <span className="inline-flex items-center justify-center h-9 w-9 rounded-lg bg-primary font-bold text-xs text-white">
              {site.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </span>
          )}
          <span className="text-sm font-bold text-gray-800">{site.name}</span>
        </div>

        {/* Centered hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground">
              {MINI_SITE_TYPE_LABEL[site.type]}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-800">
              <ShieldCheck className="h-3 w-3 text-green-600" /> Verified by Citivas
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-lg max-w-4xl">
            {site.name}
          </h1>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/90 drop-shadow font-medium">
            {site.tagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isFood && displayRooms.length > 0 && (
              <button
                onClick={() => {
                  const el = document.getElementById("rooms-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-primary-foreground px-8 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-lg hover:bg-primary/90 transition-colors"
              >
                Book Now
              </button>
            )}
            <button
              onClick={() => {
                const el = document.getElementById("about-section");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-white/95 text-gray-800 px-8 py-3.5 rounded-full text-sm sm:text-base font-bold shadow-lg hover:bg-white transition-colors"
            >
              {isFood ? "View Menu" : "Explore Rooms"}
            </button>
          </div>
        </div>

      </section>

      {/* ── About — centered, full-width ── */}
      <section id="about-section" className="py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Welcome to</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">{site.name}</h2>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground mb-10">{site.description}</p>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { icon: Star, label: "Rating", value: `${site.rating} (${site.reviews})` },
              { icon: MapPin, label: "Location", value: site.city },
              { icon: Clock, label: "Hours", value: site.hours },
              {
                icon: isFood ? UtensilsCrossed : BedDouble,
                label: isFood ? "Average plate" : "Starting from",
                value: formatNaira(site.priceFrom),
              },
            ].map((f) => (
              <div key={f.label} className="text-center p-6 rounded-2xl border border-border bg-card shadow-soft">
                <f.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
                <p className="mt-1 text-sm sm:text-base font-bold text-foreground">{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rooms grid (from Firestore) — right after About ── */}
      {!isFood && (
        <section id="rooms-section" className="py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Availability</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Featured Rooms</h2>
            </div>

            {roomsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : displayRooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center max-w-lg mx-auto">
                <BedDouble className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No room listings available yet.</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Contact the host directly for availability.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {displayRooms.map((room, idx) => (
                  <div key={idx}
                    className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover:shadow-card hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => {
                      const bookingSlug = dbProperty
                        ? (dbProperty.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
                        : slug;
                      navigate(`/book/${bookingSlug}`, { state: { preSelectedRoom: idx } });
                    }}
                  >
                    <div className="relative h-52 w-full bg-muted overflow-hidden">
                      {room.images?.[0] ? (
                        <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                          <BedDouble className="h-8 w-8 text-muted-foreground/30" />
                        </div>
                      )}
                      {room.quantity > 0 && room.quantity <= 3 && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-accent/90 px-2.5 py-1 text-[11px] font-bold text-accent-foreground backdrop-blur-sm">
                          {room.quantity} left
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-foreground">{room.name || `Room ${idx + 1}`}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {room.bedType} · {room.bathrooms} bath{room.bathrooms !== 1 ? "s" : ""}
                      </p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" /> {room.maxOccupancy} guests</span>
                        <span className="inline-flex items-center gap-1.5"><Wifi className="h-4 w-4" /> WiFi</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                        <div>
                          <span className="text-xl font-extrabold text-foreground">
                            {room.pricePerNight > 0 ? formatNaira(room.pricePerNight) : "TBD"}
                          </span>
                          <span className="text-sm text-muted-foreground"> /night</span>
                        </div>
                        <Button size="sm" className="h-9 rounded-full px-5 text-sm">
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Gallery — bento grid matching widget layout ── */}
      <section id="gallery-section" className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8">Gallery</h2>

          {(() => {
            const imgs = [site.cover, ...site.gallery];
            const open = (idx: number) => setLightboxIdx(idx);

            if (imgs.length === 0) return null;

            if (imgs.length === 1) {
              return (
                <button type="button" onClick={() => open(0)} className="w-full overflow-hidden rounded-2xl">
                  <img src={imgs[0]} alt={`${site.name} photo 1`} className="w-full h-72 sm:h-96 object-cover" />
                </button>
              );
            }

            if (imgs.length === 2) {
              return (
                <div className="grid grid-cols-2 gap-3">
                  {imgs.map((img, i) => (
                    <button key={i} type="button" onClick={() => open(i)} className="overflow-hidden rounded-2xl">
                      <img src={img} alt={`${site.name} photo ${i + 1}`} loading="lazy" className="w-full h-52 sm:h-64 object-cover" />
                    </button>
                  ))}
                </div>
              );
            }

            const hero = imgs[0];
            const rightTop = imgs[1];
            const rightBottom = imgs.length > 2 ? imgs[2] : null;
            const bottomRow = imgs.slice(3);

            return (
              <div className="space-y-3">
                {/* Row 1: large left + 2 stacked right */}
                <div className="flex gap-3" style={{ height: "340px" }}>
                  <button
                    type="button"
                    onClick={() => open(0)}
                    className="flex-[3] overflow-hidden rounded-2xl"
                  >
                    <img src={hero} alt={`${site.name} photo 1`} className="w-full h-full object-cover" />
                  </button>
                  <div className="flex-[2] flex flex-col gap-3">
                    {rightTop && (
                      <button type="button" onClick={() => open(1)} className="flex-1 overflow-hidden rounded-2xl">
                        <img src={rightTop} alt={`${site.name} photo 2`} loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    )}
                    {rightBottom ? (
                      <button type="button" onClick={() => open(2)} className="flex-1 overflow-hidden rounded-2xl">
                        <img src={rightBottom} alt={`${site.name} photo 3`} loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ) : (
                      <div className="flex-1" />
                    )}
                  </div>
                </div>

                {/* Row 2 — bottom images side by side */}
                {bottomRow.length > 0 && (
                  <div className="flex gap-3">
                    {bottomRow.map((img, i) => (
                      <button
                        key={i + 3}
                        type="button"
                        onClick={() => open(i + 3)}
                        className="flex-1 overflow-hidden rounded-2xl"
                        style={{ height: "220px" }}
                      >
                        <img src={img} alt={`${site.name} photo ${i + 4}`} loading="lazy" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx - 1 + allImages.length) % allImages.length); }}
            className="absolute left-2 sm:left-6 text-white/80 hover:text-white p-2 text-3xl font-bold"
            aria-label="Previous image"
          >
            ‹
          </button>
          <img
            src={allImages[lightboxIdx]}
            alt={`${site.name} photo ${lightboxIdx + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIdx((lightboxIdx + 1) % allImages.length); }}
            className="absolute right-2 sm:right-6 text-white/80 hover:text-white p-2 text-3xl font-bold"
            aria-label="Next image"
          >
            ›
          </button>
          <p className="text-white/60 text-sm mt-3">{lightboxIdx + 1} / {allImages.length}</p>
        </div>
      )}

      {/* ── Amenities — card grid with icons, show 4 + More button ── */}
      {site.amenities.length > 0 && (
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">What we offer</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
                {isFood ? "Facilities" : "Hotel Amenities"}
              </h2>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                {isFood
                  ? "Enjoy our world-class facilities and services designed for your comfort"
                  : "Enjoy world-class facilities and services designed for your comfort"}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(showAllAmenities ? site.amenities : site.amenities.slice(0, 4)).map((a) => {
                const info = getAmenityInfo(a);
                const Icon = info.icon;
                return (
                  <div key={a} className="flex flex-col items-center text-center rounded-2xl border border-border bg-card p-6 shadow-soft hover:shadow-card hover:border-primary/20 transition-all">
                    <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1">{info.label}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{info.description}</p>
                  </div>
                );
              })}
            </div>
            {site.amenities.length > 4 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAllAmenities(!showAllAmenities)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-primary/30 bg-primary/5 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
                >
                  {showAllAmenities ? (
                    <>Show Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>View All ({site.amenities.length}) <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Stay details ── */}
      {!isFood && (site.bedrooms || site.propertyType) && (
        <section className="py-12 sm:py-16 px-4 bg-muted/40">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Property info</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-8">Stay Details</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 max-w-4xl mx-auto">
              {[
                { label: "Property type", value: site.propertyType },
                { label: "Bedrooms", value: site.bedrooms ? String(site.bedrooms) : undefined },
                { label: "Bathrooms", value: site.bathrooms ? String(site.bathrooms) : undefined },
                { label: "Sleeps", value: site.guests ? `${site.guests} guests` : undefined },
                { label: "Check-in", value: site.checkIn },
                { label: "Check-out", value: site.checkOut },
                { label: "Rate", value: site.priceFrom ? `${formatNaira(site.priceFrom)} / ${site.priceUnit ?? "night"}` : undefined },
                { label: "Host", value: site.hostName },
              ]
                .filter((f) => f.value)
                .map((f) => (
                  <div key={f.label} className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{f.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Menu (restaurants) ── */}
      {isFood && items.length > 0 && (
        <section id="menu" className="py-12 sm:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Order online</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">Food Menu</h2>
              <p className="mt-2 text-sm text-muted-foreground">{items.length} items</p>
            </div>
            <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto justify-center pb-1">
              {sections.map((s) => (
                <button key={s} onClick={() => setActiveSection(s)} className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-sm font-medium transition-colors ${activeSection === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:border-primary/50"}`}>
                  {s}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item) => (
                <article key={item.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-soft hover:shadow-card transition-all">
                  <img src={item.image} alt={item.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-bold text-foreground">{item.name}</h3>
                      {item.popular && <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">Popular</span>}
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground mt-1">{item.description}</p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="text-base font-bold text-foreground">{formatNaira(item.price)}</span>
                      {cart[item.id] ? (
                        <div className="flex items-center gap-2 rounded-full border border-primary px-2 py-1">
                          <button onClick={() => setQty(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus className="h-3.5 w-3.5 text-primary" /></button>
                          <span className="min-w-4 text-center text-xs font-bold text-foreground">{cart[item.id]}</span>
                          <button onClick={() => setQty(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus className="h-3.5 w-3.5 text-primary" /></button>
                        </div>
                      ) : (
                        <Button size="sm" className="h-8 rounded-full px-4 text-xs" onClick={() => setQty(item.id, 1)}><Plus className="mr-1 h-3.5 w-3.5" /> Add</Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Contact Us — fully written text with linked details ── */}
      <section id="contact-section" className="py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary mb-3">Get in touch</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">Contact Us</h2>
          </div>

          <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              We'd love to hear from you. Whether you have a question about availability, rates, or anything else — our team is ready to help.
            </p>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Address</p>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {site.address}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Phone</p>
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {site.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">Email</p>
                  <a href={`mailto:${site.email}`} className="text-muted-foreground hover:text-primary transition-colors">
                    {site.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1">WhatsApp</p>
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    Chat with us on WhatsApp
                  </a>
                </div>
              </div>

              {site.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Website</p>
                    <a href={site.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                      {site.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#1a1f2e] text-white">
        <div className="max-w-6xl mx-auto px-4 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                {site.logo ? (
                  <img src={site.logo} alt={`${site.name} logo`} className="h-10 w-10 object-contain rounded-lg bg-white/10 p-1" />
                ) : (
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary font-bold text-sm text-white">
                    {site.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                )}
                <span className="text-xl font-bold">{site.name}</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{site.tagline}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-base font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2.5 text-sm text-gray-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/mini-sites" className="hover:text-white transition-colors">Apartments</a></li>
                <li><button onClick={() => document.getElementById("gallery-section")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors text-left">Gallery</button></li>
                <li><button onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors text-left">About Us</button></li>
                <li><button onClick={() => document.getElementById("rooms-section")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors text-left">Rooms</button></li>
                <li><button onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors text-left">Contact</button></li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <h3 className="text-base font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex gap-2.5">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{site.address}</a>
                </li>
                <li className="flex gap-2.5">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white transition-colors">{site.phone}</a>
                </li>
                <li className="flex gap-2.5">
                  <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">{site.email}</a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="text-base font-bold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                {site.website && (
                  <a href={site.website} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <Globe className="h-4 w-4" />
                  </a>
                )}
                {site.whatsapp && (
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                  </a>
                )}
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <p>Website developed by <a href="https://bwtng.live" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bluewaves Technologies</a> — www.bwtng.live</p>
          </div>
        </div>
      </footer>

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
