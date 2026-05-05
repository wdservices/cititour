import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
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
        setItems(data);
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
        ...(Array.isArray(item.images) ? item.images.join(",") : ""),
        ...(Array.isArray(item.tags) ? item.tags.join(",") : ""),
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

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="All Businesses | CititourNG"
        description="Browse all business listings across categories."
        keywords={["all businesses", "Nigeria", "restaurants", "hotels", "shopping", "lifestyle"]}
        canonicalUrl={`${window.location.origin}/businesses`}
      />
      <SearchHeader
        title="All Businesses"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search businesses by name, tag, category..."
      />
      <div className="px-4 py-6">
        {loading && <p className="text-center">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <ListingCard 
                  key={item.id} 
                  {...item} 
                  onClick={() => handleClick(item.id, item.category)} 
                />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No businesses found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllBusinessesPage;