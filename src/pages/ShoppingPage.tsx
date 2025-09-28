import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import shoppingMall from "@/assets/shopping-mall.jpg";
import shoppingMarket from "@/assets/shopping-market.jpg";

const shoppingData = [
  {
    id: "1",
    title: "Garden City Mall",
    description: "Premier shopping destination with over 200 stores, restaurants, and entertainment venues. Fashion, electronics, and more.",
    image: shoppingMall,
    category: "Shopping Mall",
    rating: 4.6,
    price: "Varies",
    location: "Downtown Garden City",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Local Craft Market",
    description: "Artisan market featuring local crafts, handmade goods, and unique souvenirs. Supporting local artisans and creators.",
    image: shoppingMarket,
    category: "Market",
    rating: 4.8,
    price: "$5-100",
    location: "Old Town Square",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  }
];

const ShoppingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredPlaces = shoppingData.filter(place =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlaceClick = (placeId: string) => {
    navigate(`/shopping/${placeId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Shopping"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search shopping places..."
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
            <p className="text-muted-foreground">No shopping places found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingPage;