import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import airbnbApartment from "@/assets/airbnb-apartment.jpg";
import airbnbHouse from "@/assets/airbnb-house.jpg";

interface AirbnbPlace {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: number;
  price: string;
  location: string;
  phone?: string;
  website?: string;
  isOpen?: boolean;
}

const mockData: AirbnbPlace[] = [
  {
    id: "1",
    title: "Cozy Downtown Loft",
    description: "Modern loft apartment in the heart of Garden City. Fully furnished with city views, high-speed WiFi, and premium amenities.",
    image: airbnbApartment,
    category: "Apartment",
    rating: 4.9,
    price: "$80-120/night",
    location: "Downtown Garden City",
    isOpen: true
  },
  {
    id: "2",
    title: "Garden Villa Retreat",
    description: "Spacious villa with private garden and pool. Perfect for families and groups looking for a peaceful getaway.",
    image: airbnbHouse,
    category: "Villa",
    rating: 4.8,
    price: "$150-250/night",
    location: "Garden City Suburbs",
    isOpen: true
  }
];

const AirbnbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [places, setPlaces] = useState<AirbnbPlace[]>(mockData);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const snapshot = await getDocs(collection(db, "house_listings"));
        const firebasePlaces = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "Untitled Property",
            description: data.description || "",
            image: data.image || data.imageUrl || "",
            category: data.category || data.type || "Rental",
            rating: Number(data.rating || 0),
            price: data.price || (data.pricePerNight ? `$${data.pricePerNight}/night` : ""),
            location: data.location || data.address || "",
            phone: data.phone || "",
            website: data.website || "",
            isOpen: data.isOpen ?? true
          } as AirbnbPlace;
        });
        
        // Remove duplicates between mock data and firebase data if any
        const allPlaces = [...mockData];
        firebasePlaces.forEach(fbPlace => {
          if (!allPlaces.find(p => p.id === fbPlace.id)) {
            allPlaces.push(fbPlace);
          }
        });
        
        setPlaces(allPlaces);
      } catch (err) {
        console.error("Failed to fetch house listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const filteredPlaces = places.filter(place =>
    (place.title?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (place.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (place.category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
    (place.location?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const handlePlaceClick = (placeId: string) => {
    navigate(`/airbnb/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Airbnb & Rentals"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search rentals..."
      />
      
      <div className="px-4 py-6">
        {loading && <p className="text-center py-4">Loading rentals...</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <ListingCard
              key={place.id}
              {...place}
              location={place.location}
              onClick={() => handlePlaceClick(place.id)}
            />
          ))}
        </div>
        
        {!loading && filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rentals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirbnbPage;