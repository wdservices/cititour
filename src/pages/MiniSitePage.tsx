import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { PROPERTY_AMENITIES } from "@/lib/nigerianStates";
import { Phone, MessageCircle, Mail, MapPin, Star, ChevronLeft, Share2, X, ChevronRight, Camera, ZoomIn } from "lucide-react";

interface RoomCategory {
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

interface PropertyData {
  id: string;
  title: string;
  description: string;
  address: string;
  propertyType: string;
  location: string;
  state: string;
  city: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  checkin: string;
  checkout: string;
  rooms: RoomCategory[];
  amenities: string[];
  phone: string;
  whatsapp: string;
  contactEmail: string;
  priceNum: number;
}

function makeSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useScrollReveal();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function MiniSitePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    const fetchProperty = async () => {
      try {
        const snap = await getDocs(query(collection(db, "house_listings"), where("miniSiteActive", "==", true)));
        const found = snap.docs.find((d) => {
          const data = d.data();
          return makeSlug(data.title || "") === slug;
        });
        if (found) {
          setProperty({ id: found.id, ...found.data() } as PropertyData);
        }
      } catch (e) {
        console.error("Error fetching property:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-sm">Property not found.</p>
        <a href="/explore" className="text-[#1a56db] text-sm font-semibold hover:underline">Browse Properties &rarr;</a>
      </div>
    );
  }

  const allImages = property.images?.length > 0 ? property.images : (property.image ? [property.image] : []);
  const coverImage = allImages[0] || "";
  const galleryImages = allImages.slice(1);
  const amenityObjects = (property.amenities || []).map((id) => PROPERTY_AMENITIES.find((a) => a.id === id)).filter(Boolean);
  const rooms = property.rooms || [];
  const totalRooms = rooms.reduce((sum: number, r: any) => sum + (r.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1a56db] rounded-md flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="text-[15px] font-bold text-gray-800">{property.title}</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-400 hidden sm:block">Powered by <span className="font-semibold text-gray-500">Citivas Hospitality</span></span>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[85vh] min-h-[560px] bg-gray-200 overflow-hidden cursor-pointer group" onClick={() => { if (coverImage) { setLightboxIndex(0); setLightboxOpen(true); } }}>
        {coverImage ? (
          <img src={coverImage} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 lg:p-16 max-w-6xl mx-auto">
          {/* Location tag */}
          {(property.city || property.state) && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-[2px] bg-white/60" />
              <span className="text-white/80 text-[11px] font-semibold tracking-[0.2em] uppercase">{[property.city, property.state].filter(Boolean).join(" · ")}</span>
            </div>
          )}
          {/* Title */}
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight max-w-2xl mb-4">{property.title}</h1>
          {/* Description preview */}
          {property.description && (
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mb-6 line-clamp-2">{property.description}</p>
          )}
          {/* Action buttons */}
          <div className="flex items-center gap-4 mb-10">
            <button onClick={(e) => { e.stopPropagation(); navigate(`/book/${slug}`); }} className="bg-white text-gray-900 px-7 py-3 rounded-lg text-[13px] font-bold hover:bg-gray-100 transition-colors">
              Book Now
            </button>
            <button onClick={(e) => { e.stopPropagation(); document.getElementById("rooms-section")?.scrollIntoView({ behavior: "smooth" }); }} className="border border-white/40 text-white px-7 py-3 rounded-lg text-[13px] font-bold hover:bg-white/10 transition-colors">
              View Rooms
            </button>
          </div>
          {/* Bottom stats */}
          <div className="flex items-center gap-8 sm:gap-12 pt-6 border-t border-white/20">
            {property.rating > 0 && (
              <div>
                <p className="text-white text-xl font-bold">{property.rating}<span className="text-white/60 text-sm ml-0.5">★</span></p>
                <p className="text-white/50 text-[10px] font-semibold tracking-wider uppercase mt-1">Guest Rating</p>
              </div>
            )}
            {rooms.length > 0 && (
              <div>
                <p className="text-white text-xl font-bold">{rooms.length}</p>
                <p className="text-white/50 text-[10px] font-semibold tracking-wider uppercase mt-1">{rooms.length === 1 ? "Room Type" : "Room Types"}</p>
              </div>
            )}
            {totalRooms > 0 && (
              <div>
                <p className="text-white text-xl font-bold">{totalRooms}</p>
                <p className="text-white/50 text-[10px] font-semibold tracking-wider uppercase mt-1">Total Units</p>
              </div>
            )}
            {property.city && (
              <div>
                <p className="text-white text-xl font-bold">{property.city}</p>
                <p className="text-white/50 text-[10px] font-semibold tracking-wider uppercase mt-1">{property.state || "Nigeria"}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* About Us */}
        <ScrollReveal>
        <section className="py-14 sm:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-16 items-start">
            {/* Left: heading + description + check-in/out */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[2px] bg-[#1a56db]" />
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1a56db]">About Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-gray-800 leading-[1.15] mb-6">
                Welcome to<br />
                <span className="text-[#1a56db]">{property.title}.</span>
              </h2>
              <p className="text-[15px] text-gray-500 leading-[1.85] mb-5">
                {property.description || "Experience unparalleled luxury and privacy at this exclusive retreat. Our property offers bespoke service, breathtaking views, and exquisite accommodations for the discerning traveler. Discover a world of tranquility and refinement, where every detail is curated to provide a seamless and unforgettable stay."}
              </p>
              <div className="flex flex-wrap gap-5 text-[13px] text-gray-500">
                {property.checkin && <span><strong className="text-gray-700">Check-in:</strong> {formatTime(property.checkin)}</span>}
                {property.checkout && <span><strong className="text-gray-700">Check-out:</strong> {formatTime(property.checkout)}</span>}
              </div>
              {property.address && (
                <div className="flex items-center gap-2 mt-4 text-[13px] text-gray-500">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{property.address}</span>
                </div>
              )}
            </div>
            {/* Right: image only */}
            <div className="overflow-hidden rounded-2xl bg-gray-100">
              {allImages[1] ? (
                <img src={allImages[1]} alt="" className="w-full h-64 sm:h-80 object-cover rounded-2xl transition-transform duration-500 hover:scale-105" />
              ) : (
                <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-2xl">
                  <Camera className="w-10 h-10 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* Gallery */}
        {galleryImages.length > 0 && (
          <ScrollReveal delay={100}>
          <section className="pb-12 sm:pb-16">
            <div className="flex items-center gap-3 mb-6">
              <Camera className="w-6 h-6 text-[#1a56db]" />
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Gallery</h2>
              <span className="text-[12px] text-gray-400 font-medium ml-auto">{galleryImages.length} photos</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 auto-rows-[140px] sm:auto-rows-[160px]">
              {galleryImages.slice(0, 8).map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setLightboxIndex(i); setLightboxOpen(true); }}
                  className={`relative overflow-hidden rounded-xl cursor-pointer group ${i === 0 ? "col-span-2 row-span-2" : ""} ${i === 3 ? "sm:col-span-2" : ""}`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-75" />
                  </div>
                  {i === 0 && galleryImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      +{galleryImages.length - 1} more
                    </div>
                  )}
                </div>
              ))}
              {galleryImages.length > 8 && (
                <div
                  onClick={() => { setLightboxIndex(8); setLightboxOpen(true); }}
                  className="relative overflow-hidden rounded-xl cursor-pointer group bg-gray-100 flex items-center justify-center"
                >
                  <span className="text-2xl font-bold text-gray-400 group-hover:text-[#1a56db] transition-colors">+{galleryImages.length - 8}</span>
                </div>
              )}
            </div>
          </section>
          </ScrollReveal>
        )}

        {/* Rooms */}
        {property.rooms && property.rooms.length > 0 && (
          <ScrollReveal delay={200}>
          <section id="rooms-section" className="pb-12 sm:pb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Rooms</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {property.rooms.map((room, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:shadow-[#1a56db]/10 transition-all duration-300 hover:-translate-y-1">
                  <div className="relative h-44 bg-gray-100">
                    {room.images?.[0] ? (
                      <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center text-gray-300 text-xs">No image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-800">{room.name || `Room ${idx + 1}`}</h3>
                      <span className="text-[11px] font-semibold text-[#1a56db] whitespace-nowrap">
                        {room.pricePerNight > 0 ? `₦${room.pricePerNight.toLocaleString()}/night` : "Price on request"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                      <span>Max Guests: <strong className="text-gray-600">{room.maxOccupancy}</strong></span>
                      <span>{room.bedType}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/book/${slug}`)}
                      className="w-full py-2.5 rounded-lg text-[12px] font-bold transition-colors bg-[#1a56db] text-white hover:bg-[#1548b8]"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
          </ScrollReveal>
        )}

        {/* Amenities */}
        {amenityObjects.length > 0 && (
          <ScrollReveal delay={300}>
          <section className="py-12 sm:py-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-10">Amenities</h2>
            <div className="flex flex-wrap justify-center gap-10 sm:gap-14">
              {amenityObjects.map((a) => (
                <div key={a!.id} className="flex flex-col items-center gap-3 group cursor-default">
                  <div className="w-18 h-18 rounded-full border-2 border-[#1a56db]/30 flex items-center justify-center text-3xl transition-all duration-300 group-hover:border-[#1a56db] group-hover:bg-[#1a56db]/10 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-[#1a56db]/20">
                    {a!.icon}
                  </div>
                  <span className="text-[12px] text-gray-600 font-medium text-center transition-colors group-hover:text-[#1a56db]">{a!.label}</span>
                </div>
              ))}
            </div>
          </section>
          </ScrollReveal>
        )}

        {/* Contact Us */}
        <ScrollReveal delay={400}>
        <section className="py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Contact Us</h2>
          <div className="rounded-xl border border-gray-200 divide-y divide-gray-200">
            {property.phone && (
              <a href={`tel:${property.phone}`} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-[#1a56db]/10 flex items-center justify-center transition-all group-hover:bg-[#1a56db]/20 group-hover:scale-105">
                  <Phone className="w-6 h-6 text-[#1a56db]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-800">Phone</p>
                  <p className="text-[13px] text-gray-500">{property.phone}</p>
                </div>
              </a>
            )}
            {property.whatsapp && (
              <a href={`https://wa.me/${property.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center transition-all group-hover:bg-green-500/20 group-hover:scale-105">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-800">WhatsApp</p>
                  <p className="text-[13px] text-gray-500">Message us 24/7</p>
                </div>
              </a>
            )}
            {property.contactEmail && (
              <a href={`mailto:${property.contactEmail}`} className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-[#1a56db]/10 flex items-center justify-center transition-all group-hover:bg-[#1a56db]/20 group-hover:scale-105">
                  <Mail className="w-6 h-6 text-[#1a56db]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-800">Email</p>
                  <p className="text-[13px] text-gray-500">{property.contactEmail}</p>
                </div>
              </a>
            )}
            {property.address && (
              <div className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-[#1a56db]/10 flex items-center justify-center transition-all group-hover:bg-[#1a56db]/20 group-hover:scale-105">
                  <MapPin className="w-6 h-6 text-[#1a56db]" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-gray-800">Address</p>
                  <p className="text-[13px] text-gray-500">{property.address}</p>
                </div>
              </div>
            )}
            {!property.phone && !property.whatsapp && !property.contactEmail && !property.address && (
              <div className="p-6 text-center text-[13px] text-gray-400">No contact information available.</div>
            )}
          </div>
        </section>
        </ScrollReveal>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[16px] font-bold text-[#1a56db]">{property.title}</span>
              {property.address && (
                <p className="text-[12px] text-gray-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> {property.address}
                </p>
              )}
            </div>
            <div className="flex items-center gap-6">
              {property.phone && (
                <a href={`tel:${property.phone}`} className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-[#1a56db] transition-colors">
                  <Phone className="w-4 h-4" /> {property.phone}
                </a>
              )}
              {property.contactEmail && (
                <a href={`mailto:${property.contactEmail}`} className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-[#1a56db] transition-colors">
                  <Mail className="w-4 h-4" /> {property.contactEmail}
                </a>
              )}
              <button className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[12px] text-gray-400">&copy; {new Date().getFullYear()} {property.title}. All rights reserved.</p>
            <p className="text-[11px] text-gray-300">Powered by <span className="font-semibold text-gray-400">Citivas Hospitality</span></p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      {lightboxOpen && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-5 bg-white/10 backdrop-blur-sm text-white text-[13px] font-semibold px-3 py-1.5 rounded-full z-10">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          {/* Prev */}
          {lightboxIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev - 1); }}
              className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Next */}
          {lightboxIndex < allImages.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((prev) => prev + 1); }}
              className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all z-10 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}

          {/* Image */}
          <img
            key={lightboxIndex}
            src={allImages[lightboxIndex]}
            alt=""
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg animate-in zoom-in-95 fade-in duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {allImages.slice(Math.max(0, lightboxIndex - 4), lightboxIndex + 5).map((img, i) => {
                const actualIdx = Math.max(0, lightboxIndex - 4) + i;
                return (
                  <button
                    key={actualIdx}
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(actualIdx); }}
                    className={`w-12 h-9 rounded-md overflow-hidden border-2 transition-all ${actualIdx === lightboxIndex ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
