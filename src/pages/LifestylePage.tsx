import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import lifestyleSpa from "@/assets/lifestyle-spa.jpg";
import lifestyleGym from "@/assets/lifestyle-gym.jpg";

const lifestyleData = [
  {
    id: "1",
    title: "Zen Wellness Spa",
    description: "Luxury spa offering massage therapy, facial treatments, and wellness programs. Relax and rejuvenate in our serene environment.",
    image: lifestyleSpa,
    category: "Spa",
    rating: 4.8,
    price: "$60-200",
    location: "Garden City Wellness District",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "FitLife Gym & Studio",
    description: "State-of-the-art fitness center with personal training, group classes, and modern equipment. Achieve your fitness goals.",
    image: lifestyleGym,
    category: "Fitness",
    rating: 4.6,
    price: "$30-80/month",
    location: "Business District",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  }
];

const LifestylePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredPlaces = lifestyleData.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceClick = (placeId: string) => {
    navigate(`/lifestyle/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Lifestyle & Wellness"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search lifestyle places..."
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
            <p className="text-muted-foreground">No lifestyle places found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LifestylePage;