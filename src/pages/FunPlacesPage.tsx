import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import funAdventure from "@/assets/fun-adventure.jpg";
import funArcade from "@/assets/fun-arcade.jpg";

const funPlacesData = [
  {
    id: "1",
    title: "Adventure Park",
    description: "Thrilling outdoor activities including zip-lining, rock climbing, and obstacle courses. Perfect for adventure seekers and families.",
    image: funAdventure,
    category: "Adventure",
    rating: 4.7,
    price: "$30-50",
    location: "Garden City Outskirts",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Garden City Arcade",
    description: "Modern gaming arcade with classic and latest games. Virtual reality experiences, tournaments, and party packages available.",
    image: funArcade,
    category: "Gaming",
    rating: 4.5,
    price: "$15-25",
    location: "Shopping Mall Level 3",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  }
];

const FunPlacesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredPlaces = funPlacesData.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceClick = (placeId: string) => {
    navigate(`/fun-places/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Fun Places"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search fun places..."
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
            <p className="text-muted-foreground">No fun places found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FunPlacesPage;