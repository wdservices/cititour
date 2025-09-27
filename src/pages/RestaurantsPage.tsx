import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";

// Mock data for restaurants
const restaurantsData = [
  {
    id: "1",
    title: "Garden Bistro",
    description: "Fine dining restaurant specializing in modern European cuisine. Fresh ingredients, innovative dishes, and excellent wine selection.",
    image: "/placeholder.svg",
    category: "Fine Dining",
    rating: 4.8,
    price: "$40-80",
    location: "Garden City Center",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Street Food Paradise",
    description: "Authentic local street food in a modern setting. Try our famous Garden City specialties and traditional comfort foods.",
    image: "/placeholder.svg", 
    category: "Street Food",
    rating: 4.6,
    price: "$10-25",
    location: "Food District",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "3",
    title: "Rooftop Lounge & Grill",
    description: "Stunning rooftop dining experience with panoramic city views. Perfect for romantic dinners and special celebrations.",
    image: "/placeholder.svg",
    category: "Rooftop",
    rating: 4.9,
    price: "$50-100",
    location: "Downtown Skyline",
    phone: "+1234567892",
    website: "https://example.com", 
    isOpen: false
  },
  {
    id: "4",
    title: "Garden Café",
    description: "Cozy café serving artisan coffee, fresh pastries, and light meals. Perfect spot for meetings, studying, or casual dining.",
    image: "/placeholder.svg",
    category: "Café", 
    rating: 4.5,
    price: "$5-20",
    location: "University District",
    phone: "+1234567893",
    website: "https://example.com",
    isOpen: true
  }
];

const RestaurantsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredRestaurants = restaurantsData.filter(restaurant =>
    restaurant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRestaurantClick = (restaurantId: string) => {
    navigate(`/restaurants/${restaurantId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Restaurants"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search restaurants..."
      />
      
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <ListingCard
              key={restaurant.id}
              {...restaurant}
              onClick={() => handleRestaurantClick(restaurant.id)}
            />
          ))}
        </div>
        
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No restaurants found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage;