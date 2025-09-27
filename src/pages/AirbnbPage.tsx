import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";

const airbnbData = [
  {
    id: "1",
    title: "Cozy Downtown Loft",
    description: "Modern loft apartment in the heart of Garden City. Fully furnished with city views, high-speed WiFi, and premium amenities.",
    image: "/placeholder.svg",
    category: "Apartment",
    rating: 4.9,
    price: "$80-120/night",
    location: "Downtown Garden City",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Garden Villa Retreat",
    description: "Spacious villa with private garden and pool. Perfect for families and groups looking for a peaceful getaway.",
    image: "/placeholder.svg",
    category: "Villa",
    rating: 4.8,
    price: "$150-250/night",
    location: "Garden City Suburbs",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  }
];

const AirbnbPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredPlaces = airbnbData.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <ListingCard
              key={place.id}
              {...place}
              onClick={() => handlePlaceClick(place.id)}
            />
          ))}
        </div>
        
        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rentals found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirbnbPage;