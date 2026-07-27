import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";

interface Hotel {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  price: string;
  location: string;
  phone: string;
  website: string;
  isOpen: boolean;
  _source?: "business" | "house_listing";
  slug?: string;
}

const HotelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const [bizSnap, propSnap] = await Promise.all([
          getDocs(query(collection(db, "businesses"))),
          getDocs(query(collection(db, "house_listings"), where("miniSiteActive", "==", true))),
        ]);

        const bizHotels: Hotel[] = bizSnap.docs
          .map(doc => ({ id: doc.id, ...doc.data(), _source: "business" as const }))
          .filter((doc: any) => doc.category === "Hotel") as Hotel[];

        const propHotels: Hotel[] = propSnap.docs.map(doc => {
          const data = doc.data() as any;
          const slug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
          return {
            id: doc.id,
            title: data.title || "",
            description: data.description || "",
            image: data.image || (data.images && data.images[0]) || "",
            category: "Shortlet & Hotel",
            rating: data.rating || 0,
            price: data.price || "",
            location: data.location || "",
            phone: data.phone || "",
            isOpen: true,
            _source: "house_listing",
            slug,
          };
        });

        setHotels([...bizHotels, ...propHotels]);
      } catch (err) {
        setError("Failed to fetch hotels.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel => {
    const q = searchTerm.toLowerCase();
    return (
      (hotel.title?.toLowerCase().includes(q) ?? false) ||
      (hotel.description?.toLowerCase().includes(q) ?? false) ||
      (hotel.category?.toLowerCase().includes(q) ?? false)
    );
  });

  const handleHotelClick = (hotel: Hotel) => {
    if (hotel._source === "house_listing" && hotel.slug) {
      navigate(`/property/${hotel.slug}`);
      return;
    }
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Hotels"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search hotels..."
      />
      
      <div className="px-4 py-6">
        {loading && <p className="text-center">Loading hotels...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <ListingCard
                  key={hotel.id}
                  {...hotel}
                  onClick={() => handleHotelClick(hotel)}
                />
              ))}
            </div>
            
            {filteredHotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No hotels found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HotelsPage;