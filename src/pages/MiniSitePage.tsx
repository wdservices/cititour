import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Globe, MessageCircle, Star, Clock,
  ShieldCheck, Plus, Minus, ShoppingBag, Navigation, UtensilsCrossed, BedDouble, X,
  Users, Wifi, Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import StampIcon from "@/components/StampIcon";
import { useToast } from "@/hooks/use-toast";
import { getMiniSite, findMiniSite, formatNaira, MINI_SITE_TYPE_LABEL } from "@/content/miniSites";
import { useMiniSites } from "@/hooks/useMiniSites";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { format, addDays, differenceInCalendarDays, isBefore, isSameDay, isAfter } from "date-fns";

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
function DateRangePicker({
  checkIn, checkOut, onRangeChange,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onRangeChange: (start: Date | null, end: Date | null) => void;
}) {
  const [viewDate, setViewDate] = useState(() => {
    const d = checkIn || new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = viewDate.getFullYear();
  const mon = viewDate.getMonth();
  const daysInMonth = new Date(year, mon + 1, 0).getDate();
  const firstDay = new Date(year, mon, 1).getDay();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, mon, i + 1));

  const handleDayClick = (d: Date) => {
    if (isBefore(d, today)) return;
    if (!checkIn || (checkIn && checkOut)) {
      onRangeChange(d, null);
    } else if (isBefore(d, checkIn)) {
      onRangeChange(d, null);
    } else {
      onRangeChange(checkIn, d);
    }
  };

  const isInRange = (d: Date) => {
    if (!checkIn || !checkOut) return false;
    return isAfter(d, checkIn) && isBefore(d, checkOut);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setViewDate(new Date(year, mon - 1, 1))}
          className="rounded-lg p-1.5 hover:bg-muted transition-colors text-sm font-bold text-muted-foreground">
          ‹
        </button>
        <h3 className="text-sm font-bold text-foreground">{format(viewDate, "MMMM yyyy")}</h3>
        <button onClick={() => setViewDate(new Date(year, mon + 1, 1))}
          className="rounded-lg p-1.5 hover:bg-muted transition-colors text-sm font-bold text-muted-foreground">
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-muted-foreground mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-1">{d.charAt(0)}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {blanks.map((b) => <div key={`b-${b}`} />)}
        {days.map((d) => {
          const isPast = isBefore(d, today);
          const isStart = checkIn && isSameDay(d, checkIn);
          const isEnd = checkOut && isSameDay(d, checkOut);
          const inRange = isInRange(d);
          return (
            <div key={d.getTime()} onClick={() => handleDayClick(d)}
              className={`p-2 rounded-full cursor-pointer transition-all text-xs font-medium ${
                isPast ? "text-muted-foreground/40 cursor-not-allowed"
                  : isStart || isEnd ? "bg-primary text-primary-foreground font-bold"
                    : inRange ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-foreground"
              }`}>
              {d.getDate()}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Check-in</span>
          <span className="text-sm font-bold text-foreground">{checkIn ? format(checkIn, "MMM d") : "Select"}</span>
        </div>
        <span className="text-muted-foreground">→</span>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Check-out</span>
          <span className="text-sm font-bold text-foreground">{checkOut ? format(checkOut, "MMM d") : "Select"}</span>
        </div>
      </div>
    </div>
  );
}

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

  /* ── Room booking state ── */
  const [dbRooms, setDbRooms] = useState<DbRoom[]>([]);
  const [dbProperty, setDbProperty] = useState<DbProperty | null>(null);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
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

  const selectedRoom = selectedRoomIdx !== null ? displayRooms[selectedRoomIdx] : null;
  const nights = checkIn && checkOut ? differenceInCalendarDays(checkOut, checkIn) : 0;
  const roomTotal = selectedRoom && nights > 0 ? selectedRoom.pricePerNight * nights : 0;

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

  const handleBookRoom = () => {
    if (!selectedRoom || !checkIn || !checkOut || nights <= 0) {
      toast({ title: "Select dates", description: "Please choose check-in and check-out dates.", variant: "destructive" });
      return;
    }
    const bookingSlug = dbProperty
      ? (dbProperty.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "")
      : slug;
    navigate(`/book/${bookingSlug}`, {
      state: {
        roomName: selectedRoom.name,
        roomImage: selectedRoom.images?.[0] || site.cover,
        pricePerNight: selectedRoom.pricePerNight,
        nights,
        checkIn: format(checkIn, "MMM d, yyyy"),
        checkOut: format(checkOut, "MMM d, yyyy"),
        guests: selectedRoom.maxOccupancy,
        total: roomTotal,
        deposit: selectedRoom.deposit || 0,
        propertyTitle: site.name,
        propertyLocation: site.city,
        ownerId: dbProperty?.ownerId || dbProperty?.userId || "",
        propertyId: dbProperty?.id || "",
      }
    });
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

      {/* ── Hero — taller for properties ── */}
      <section className="mx-auto mt-4 max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-border shadow-card">
          <img
            src={site.cover}
            alt={`${site.name} — ${MINI_SITE_TYPE_LABEL[site.type]} in ${site.city}`}
            className="w-full object-cover h-72 sm:h-80 md:h-[28rem] lg:h-[32rem]"
          />
          <div className="absolute inset-0 bg-foreground/45" />
          <button
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-card/95 px-3 py-2 text-sm font-medium text-foreground shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">{MINI_SITE_TYPE_LABEL[site.type]}</Badge>
              <Badge variant="secondary" className="gap-1 bg-card/95 text-foreground">
                <ShieldCheck className="h-3 w-3 text-success" /> Verified by CitiTour
              </Badge>
            </div>
            <h1 className="font-display text-3xl font-extrabold leading-tight text-background md:text-4xl">{site.name}</h1>
            <p className="mt-1 max-w-2xl text-sm text-background/85 md:text-base">{site.tagline}</p>
          </div>
        </div>

        {site.gallery.length > 1 && (
          <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto pb-1">
            {site.gallery.slice(0, 8).map((g, i) => (
              <img
                key={g + i}
                src={g}
                alt={`${site.name} photo ${i + 1}`}
                loading="lazy"
                className="h-20 w-28 shrink-0 rounded-xl border border-border object-cover md:h-24 md:w-36"
              />
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto mt-8 max-w-5xl space-y-10 px-4">

        {/* ── About — directly under hero ── */}
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

        {/* ── Stay details (uniform for seeded + user-listed properties) ── */}
        {!isFood && (site.bedrooms || site.propertyType) && (
          <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="text-xl font-bold text-foreground">Stay details</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
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
                  <div key={f.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground">{f.value}</p>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ── Rooms with date picker (from Firestore) ── */}
        {!isFood && (
          <section>
            <div className="mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Availability</p>
              <h2 className="text-2xl font-bold text-foreground">Select a room &amp; dates</h2>
            </div>

            {roomsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : displayRooms.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
                <BedDouble className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">No room listings available yet.</p>
                <p className="mt-1 text-xs text-muted-foreground/70">Contact the host directly for availability.</p>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-12">
                {/* ── Left: Date picker ── */}
                <div className="lg:col-span-4">
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onRangeChange={(s, e) => { setCheckIn(s); setCheckOut(e); setSelectedRoomIdx(null); }}
                  />
                </div>

                {/* ── Right: Room cards ── */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {displayRooms.map((room, idx) => {
                    const isSelected = selectedRoomIdx === idx;
                    return (
                      <div key={idx}
                        className={`overflow-hidden rounded-2xl border bg-card transition-all ${
                          isSelected
                            ? "border-primary shadow-card ring-1 ring-primary/20"
                            : "border-border shadow-soft hover:border-primary/30"
                        }`}>
                        <div className="flex flex-col sm:flex-row">
                          {/* Room image */}
                          <div className="w-full sm:w-40 shrink-0 h-40 sm:h-auto bg-muted relative">
                            {room.images?.[0] ? (
                              <img src={room.images[0]} alt={room.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                                <BedDouble className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                            {isSelected && (
                              <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                                Selected
                              </span>
                            )}
                          </div>

                          {/* Room details */}
                          <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="text-base font-bold text-foreground">{room.name || `Room ${idx + 1}`}</h3>
                                {room.quantity > 0 && room.quantity <= 3 && (
                                  <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                                    {room.quantity} left
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {room.bedType} · {room.bathrooms} bath{room.bathrooms !== 1 ? "s" : ""}
                              </p>
                              <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {room.maxOccupancy} guests</span>
                                <span className="inline-flex items-center gap-1"><Wifi className="h-3 w-3" /> WiFi</span>
                              </div>
                            </div>

                            <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
                              <div>
                                <span className="text-lg font-extrabold text-foreground">
                                  {room.pricePerNight > 0 ? formatNaira(room.pricePerNight) : "TBD"}
                                </span>
                                <span className="text-xs text-muted-foreground"> /night</span>
                              </div>
                              <Button
                                size="sm"
                                variant={isSelected ? "default" : "outline"}
                                className="h-8 rounded-full px-4 text-xs"
                                onClick={() => setSelectedRoomIdx(isSelected ? null : idx)}
                              >
                                {isSelected ? "Selected" : "Select"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* ── Book button ── */}
                  {selectedRoom && checkIn && checkOut && nights > 0 && (
                    <div className="mt-2 rounded-2xl border border-primary bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {selectedRoom.name} · {nights} night{nights !== 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(checkIn, "MMM d")} → {format(checkOut, "MMM d")} · {formatNaira(roomTotal)} total
                        </p>
                      </div>
                      <Button className="rounded-full px-6" onClick={handleBookRoom}>
                        <Calendar className="mr-2 h-4 w-4" /> Book &amp; Pay
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

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

        {/* ── Gallery ── */}
        <section>
          <h2 className="mb-4 text-2xl font-bold text-foreground">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[site.cover, ...site.gallery].map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightboxIdx(i)}
                className="group relative overflow-hidden rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <img
                  src={img}
                  alt={`${site.name} photo ${i + 1}`}
                  loading="lazy"
                  className="h-36 w-full object-cover md:h-44 transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </span>
              </button>
            ))}
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
          {site.listedBy === "admin" ? "Listed by CitiTour admin" : `Listed by ${site.hostName ?? "a CitiTour host"}`} on{" "}
          {new Date(site.listedOn).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} ·{" "}
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
