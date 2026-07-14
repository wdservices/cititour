import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin, Star, Heart, ArrowRight, Loader2 } from "lucide-react";
import CategoryGrid from "@/components/CategoryGrid";
import HeroSlider from "@/components/HeroSlider";
import SEO from "@/components/SEO";
import { getMockImage } from "@/lib/mockImages";

type BusinessItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  location?: string;
};

const CategoriesPage = () => {
  const [businesses, setBusinesses] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const q = query(collection(db, "businesses"), limit(6));
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        })) as BusinessItem[];
        setBusinesses(data);
      } catch (err) {
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
    "Event Venue": "events",
    Entertainment: "fun-places",
    "Spa & Wellness": "lifestyle",
    "Business Services": "others",
  };

  const handleBusinessClick = (item: BusinessItem) => {
    const base = pathMap[item.category] || "others";
    navigate(`/${base}/${item.id}`);
  };

  const renderValue = (val: any) => {
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
        title="Explore Categories | CititourNG"
        description="Discover restaurants, hotels, events, attractions, lifestyle, shopping, and more across Nigeria."
        keywords={[
          "Nigeria",
          "restaurants",
          "hotels",
          "events",
          "attractions",
          "lifestyle",
          "shopping",
          "travel",
          "tourism",
          "fun places",
        ]}
        canonicalUrl={`${window.location.origin}/explore`}
        ogImage="/favicon.ico"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Explore Categories",
          itemListElement: [
            "Restaurants",
            "Hotels",
            "Events",
            "Fun Places",
            "Shopping",
            "Airbnb",
            "Attractions",
            "Lifestyle",
            "Others",
          ].map((name: string, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: name,
          })),
        }}
      />

      <main className="pb-12">
        {/* Hero Carousel */}
        <HeroSlider />

        {/* Category Grid */}
        <CategoryGrid />

        {/* ── Business Listings Section ── */}
        <section className="px-4 md:px-6 py-10 md:py-14">
          {/* Section header */}
          <div className="mb-8 md:mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Business Listings
              </h2>
              <p className="text-muted-foreground text-base">
                Discover and connect with top local businesses
              </p>
            </div>
            <button
              onClick={() => navigate("/businesses")}
              className="flex items-center gap-2 text-primary font-bold text-sm hover:underline transition-all group"
            >
              View Business Place
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Business Cards */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No businesses available yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {businesses.map((biz, index) => (
                <div
                  key={biz.id}
                  className="group bg-card/60 dark:bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 cursor-pointer hover:shadow-card animate-fade-in"
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onClick={() => handleBusinessClick(biz)}
                >
                  {/* Square Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={renderValue(biz.image) || getMockImage(biz.category)}
                      alt={renderValue(biz.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Favorite overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(biz.id);
                      }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-red-400 transition-colors"
                      aria-label={likedIds.has(biz.id) ? "Unlike" : "Like"}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          likedIds.has(biz.id) ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                    </button>
                    {/* Rating badge on image */}
                    {biz.rating != null && biz.rating > 0 && (
                      <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-[11px] font-bold text-foreground">
                          {renderValue(biz.rating)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3.5">
                    <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                      {renderValue(biz.title)}
                    </h3>
                    {biz.location && (
                      <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1 mb-2.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{renderValue(biz.location)}</span>
                      </div>
                    )}
                    <span className="font-bold text-sm text-primary">
                      {renderValue(biz.category)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CategoriesPage;