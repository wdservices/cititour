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
        const q = query(collection(db, "businesses"), where("category", "==", "Hotel"));
        const querySnapshot = await getDocs(q);
        const hotelsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Hotel[];
        setHotels(hotelsData);
      } catch (err) {
        setError("Failed to fetch hotels.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter(hotel =>
    hotel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleHotelClick = (hotelId: string) => {
    navigate(`/hotels/${hotelId}`);
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
                  onClick={() => handleHotelClick(hotel.id)}
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