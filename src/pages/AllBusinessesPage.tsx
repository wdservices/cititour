import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Search, SlidersHorizontal, Star, MapPin, Phone, Globe, MessageCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

type BusinessItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  price?: string;
  location?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  isOpen?: boolean;
  tags?: string[];
};

const pathMap: Record<string, string> = {
  Restaurant: "restaurants",
  Hotel: "hotels",
  Shopping: "shopping",
  Attraction: "attractions",
  "Fun Places": "fun-places",
  Airbnb: "airbnb",
  Lifestyle: "lifestyle",
  Event: "events",
  Events: "events",
  Other: "others",
  // Fallbacks for slightly different labels
  "Event Venue": "events",
  Entertainment: "fun-places",
  "Spa & Wellness": "lifestyle",
  "Business Services": "others",
};

const getCategoryColor = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("hotel") || cat.includes("airbnb")) return "bg-secondary text-secondary-foreground";
  if (cat.includes("restaurant") || cat.includes("food")) return "bg-primary text-primary-foreground";
  if (cat.includes("shop") || cat.includes("retail")) return "bg-amber-500 text-white";
  return "bg-primary/20 text-primary";
};

const AllBusinessesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const snap = await getDocs(collection(db, "businesses"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as BusinessItem[];
        
        // Auto-delist logic for Events: 24 hours after endDate
        const filteredData = data.filter(item => {
          if (item.category === "Event" || item.category === "Events" || item.category === "Event Venue") {
            const d = item as any;
            if (d.endDate) {
              const end = new Date(d.endDate).getTime();
              const now = new Date().getTime();
              if (now > end + 86400000) { // 24 hours in ms
                return false;
              }
            }
          }
          return true;
        });

        setItems(filteredData);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch businesses.");
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => {
      const fields = [
        item.title,
        item.description,
        item.category,
        item.location || "",
        item.price || "",
        ...(Array.isArray(item.images) ? [item.images.join(",")] : []),
        ...(Array.isArray(item.tags) ? [item.tags.join(",")] : []),
      ]
        .filter(Boolean)
        .map((s) => s.toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [items, searchTerm]);

  const handleClick = (itemId: string, category: string) => {
    const base = pathMap[category] || "others";
    navigate(`/${base}/${itemId}`);
  };

  const renderValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
      if (val._lat !== undefined && val._long !== undefined) {
        return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
      }
      return JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="All Businesses | CititourNG"
        description="Browse all premium business spots in Lagos & Port Harcourt."
        keywords={["all businesses", "Nigeria", "restaurants", "hotels", "shopping", "lifestyle"]}
        canonicalUrl={`${window.location.origin}/businesses`}
      />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Page Header */}
        <header className="mb-8 lg:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">All Businesses</h1>
              <p className="text-muted-foreground text-base lg:text-lg">Curated premium spots in Lagos & Port Harcourt</p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex-1 md:w-80 flex items-center bg-card/60 backdrop-blur-sm rounded-xl px-4 py-3 border border-border/50 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all shadow-sm">
                <Search className="text-muted-foreground w-5 h-5 mr-3 shrink-0" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or category" 
                  className="bg-transparent border-none focus:outline-none focus:ring-0 text-foreground w-full text-base placeholder:text-muted-foreground/70"
                />
              </div>
              <button className="flex items-center justify-center p-3.5 bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl hover:bg-card/80 transition-colors shadow-sm">
                <SlidersHorizontal className="text-foreground w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex justify-center py-20">
            <p className="text-muted-foreground animate-pulse">Loading businesses...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 bg-red-500/10 inline-block px-4 py-2 rounded-lg">{error}</p>
          </div>
        )}

        {/* Listings Stack */}
        {!loading && !error && (
          <section className="flex flex-col gap-6">
            {filtered.map((biz) => (
              <div 
                key={biz.id}
                onClick={() => handleClick(biz.id, biz.category)}
                className="group bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:bg-card/60 transition-all duration-300 shadow-card hover:shadow-primary/5 cursor-pointer"
              >
                {/* Image Section */}
                <div className="md:w-[320px] lg:w-[380px] shrink-0 relative overflow-hidden aspect-video md:aspect-auto h-48 md:h-auto">
                  <img 
                    src={renderValue(biz.image)} 
                    alt={renderValue(biz.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-full shadow-lg border border-white/10 ${getCategoryColor(biz.category || "Other")}`}>
                      {renderValue(biz.category || "Business")}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-5 lg:p-7 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-4">
                      <h3 className="text-xl lg:text-2xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {renderValue(biz.title)}
                      </h3>
                      {biz.rating != null && biz.rating > 0 && (
                        <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm border border-border/30 px-2 py-1 rounded-lg shrink-0">
                          <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                          <span className="font-bold text-foreground text-sm">{renderValue(biz.rating)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground text-sm lg:text-base line-clamp-2 mb-4 leading-relaxed">
                      {renderValue(biz.description)}
                    </p>
                    
                    {biz.location && (
                      <div className="flex items-center text-muted-foreground mb-6">
                        <MapPin className="text-primary w-4 h-4 mr-2 shrink-0" />
                        <span className="text-sm line-clamp-1">{renderValue(biz.location)}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-auto">
                    {biz.phone && (
                      <Button 
                        onClick={(e) => { e.stopPropagation(); window.open(`tel:${renderValue(biz.phone)}`, '_self'); }}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 h-11 px-6 rounded-xl font-bold transition-all shadow-none hover:shadow-[0_0_15px_rgba(192,193,255,0.4)]"
                      >
                        <Phone className="w-5 h-5" />
                        <span>Call</span>
                      </Button>
                    )}
                    {biz.website && (
                      <Button 
                        onClick={(e) => { e.stopPropagation(); window.open(renderValue(biz.website), '_blank'); }}
                        variant="outline" 
                        className="h-11 w-12 p-0 rounded-xl border-border/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all bg-transparent"
                        aria-label="Website"
                      >
                        <Globe className="w-5 h-5" />
                      </Button>
                    )}
                    {biz.whatsapp && (
                      <Button 
                        onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/${renderValue(biz.whatsapp).replace(/\D/g, "")}`, '_blank'); }}
                        variant="outline" 
                        className="h-11 w-12 p-0 rounded-xl border-border/50 text-muted-foreground hover:text-green-500 hover:border-green-500/50 transition-all bg-transparent"
                        aria-label="WhatsApp"
                      >
                        <MessageCircle className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/50 border-dashed">
            <p className="text-muted-foreground text-lg">No businesses found matching your search.</p>
          </div>
        )}

        {/* Load More (Mock) */}
        {!loading && !error && filtered.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button variant="outline" className="h-14 px-8 rounded-xl font-bold bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all flex items-center gap-2">
              <span>Load More Businesses</span>
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AllBusinessesPage;