import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { Building2, MapPin } from "lucide-react";
import { db } from "@/lib/firebase";
import SEO from "@/components/SEO";
import SearchHeader from "@/components/SearchHeader";
import MiniSiteCard from "@/components/MiniSiteCard";
import { useMiniSites } from "@/hooks/useMiniSites";
import { getMockImage } from "@/lib/mockImages";

type PropertyProduct = {
  id: string;
  title: string;
  image: string;
  location: string;
  price: string;
  category: string;
};

const PROPERTY_CATEGORIES = ["property", "properties", "apartment", "shortlet", "house", "real estate"];

const asText = (v: any): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (v._lat !== undefined && v._long !== undefined) return `${v._lat.toFixed(4)}, ${v._long.toFixed(4)}`;
  return String(v);
};

/** Property & Stays — every shortlet, apartment, hotel and house on CitiTour. */
const AirbnbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<PropertyProduct[]>([]);
  const navigate = useNavigate();
  const { sites, loading } = useMiniSites();

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, "marketplace"));
        setProducts(
          snap.docs
            .map((d) => {
              const raw = d.data() as any;
              return {
                id: d.id,
                title: asText(raw.title) || "Untitled property",
                image: raw.image || getMockImage("Airbnb"),
                location: asText(raw.location),
                price: asText(raw.price) || "Price on request",
                category: asText(raw.category) || "Property",
              };
            })
            .filter((p) => PROPERTY_CATEGORIES.includes(p.category.toLowerCase()))
        );
      } catch (err) {
        console.error("Failed to fetch property products:", err);
      }
    })();
  }, []);

  const q = searchTerm.trim().toLowerCase();

  const stays = useMemo(
    () =>
      sites
        .filter((s) => s.type !== "restaurant")
        .filter(
          (s) =>
            !q ||
            s.name.toLowerCase().includes(q) ||
            s.city.toLowerCase().includes(q) ||
            (s.propertyType ?? "").toLowerCase().includes(q) ||
            s.tags.some((t) => t.toLowerCase().includes(q))
        ),
    [sites, q]
  );

  const filteredProducts = products.filter(
    (p) => !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
  );

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Property & Stays in Nigeria | CitiTour"
        description="Browse verified shortlets, serviced apartments, hotels and houses across Nigeria — each with its own CitiTour mini website."
        canonicalUrl={`${window.location.origin}/airbnb`}
      />

      <SearchHeader
        title="Property & Stays"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search shortlets, apartments, hotels..."
      />

      <div className="px-4 py-6">
        <section className="mb-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-primary">Mini websites</p>
          <h2 className="mb-4 text-xl font-bold text-foreground">Shortlets, apartments &amp; hotels you can book</h2>

          {loading && stays.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">Loading stays…</p>
          ) : stays.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">No stays match your search.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stays.map((site) => (
                <MiniSiteCard key={site.slug} site={site} />
              ))}
            </div>
          )}
        </section>

        {filteredProducts.length > 0 && (
          <section>
            <p className="text-[11px] font-bold uppercase tracking-widest text-primary">From the marketplace</p>
            <h2 className="mb-4 text-xl font-bold text-foreground">Property for sale &amp; rent</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/marketplace/${item.id}`)}
                  className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3.5">
                    <h3 className="truncate text-sm font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </p>
                    <p className="mt-2 text-sm font-bold text-primary">{item.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <button
          onClick={() => navigate("/profile/dashboard?tab=listings&action=create&type=property")}
          className="mt-10 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 p-4 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <Building2 className="h-4 w-4" /> List your property on CitiTour
        </button>
      </div>
    </div>
  );
};

export default AirbnbPage;
