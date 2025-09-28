import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import attractionMuseum from "@/assets/attraction-museum.jpg";
import attractionGarden from "@/assets/attraction-garden.jpg";

const attractionsData = [
  {
    id: "1",
    title: "Garden City Museum",
    description: "Discover the rich history and culture of Garden City through interactive exhibits, artifacts, and guided tours.",
    image: attractionMuseum,
    category: "Museum",
    rating: 4.7,
    price: "$12-18",
    location: "Cultural District",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Botanical Gardens",
    description: "Stunning botanical gardens featuring rare plants, themed sections, and peaceful walking trails. Perfect for nature lovers.",
    image: attractionGarden,
    category: "Nature",
    rating: 4.9,
    price: "$8-15",
    location: "Garden City Park",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  }
];

const AttractionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredAttractions = attractionsData.filter(attraction =>
    attraction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attraction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attraction.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAttractionClick = (attractionId: string) => {
    navigate(`/attractions/${attractionId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Attractions"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search attractions..."
      />
      
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <ListingCard
              key={attraction.id}
              {...attraction}
              onClick={() => handleAttractionClick(attraction.id)}
            />
          ))}
        </div>
        
        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No attractions found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttractionsPage;