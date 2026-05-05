import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchHeader from "@/components/SearchHeader";
import SEO from "@/components/SEO";
import ListingCard from "@/components/ListingCard";

interface BusinessItem {
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
}

const SearchPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [results, setResults] = useState<BusinessItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const snap = await getDocs(collection(db, "businesses"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })) as BusinessItem[];
        setResults(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  useEffect(() => {
    // keep URL in sync with input
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      if (searchTerm) next.set("q", searchTerm);
      else next.delete("q");
      return next;
    });
  }, [searchTerm, setParams]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return results;
    return results.filter((item) => {
      const fields = [
        item.title,
        item.description,
        item.category,
        item.location || "",
        item.price || "",
        ...(Array.isArray(item.images) ? item.images.join(",") : ""),
        ...(Array.isArray((item as any).tags) ? (item as any).tags.join(",") : ""),
      ]
        .filter(Boolean)
        .map((s) => s.toLowerCase());
      return fields.some((f) => f.includes(q));
    });
  }, [results, searchTerm]);

  const handleClick = (itemId: string, category: string) => {
    // Navigate to detail page using category path mapping
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
    };
    const base = pathMap[category] || "others";
    navigate(`/${base}/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`Search${searchTerm ? `: ${searchTerm}` : ""} | CititourNG`}
        description="Search businesses across categories like restaurants, hotels, events, attractions, lifestyle, shopping, and more."
        keywords={["Nigeria", "search", "restaurants", "hotels", "events", "attractions", "lifestyle", "shopping", "tourism"]}
        canonicalUrl={`${window.location.origin}/search${searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ""}`}
      />
      <SearchHeader
        title="Search"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search restaurants, hotels, events, attractions..."
      />

      <div className="px-4 py-6">
        {loading && <p className="text-center">Loading results...</p>}
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
                <p className="text-muted-foreground">No results found. Try another search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;