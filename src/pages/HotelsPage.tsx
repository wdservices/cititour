import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import hotelLuxury from "@/assets/hotel-luxury.jpg";
import hotelBoutique from "@/assets/hotel-boutique.jpg";
import hotelBudget from "@/assets/hotel-budget.jpg";
import hotelResort from "@/assets/hotel-resort.jpg";

// Mock data for hotels
const hotelsData = [
  {
    id: "1",
    title: "Garden City Grand Hotel",
    description: "Luxury 5-star hotel in the heart of Garden City. Featuring world-class amenities, spa services, and fine dining restaurants.",
    image: hotelLuxury,
    category: "5-Star",
    rating: 4.9,
    price: "$200-400/night",
    location: "Downtown Garden City",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2",
    title: "Boutique Garden Inn",
    description: "Charming boutique hotel with personalized service and unique design. Perfect for romantic getaways and business travelers.",
    image: hotelBoutique,
    category: "Boutique",
    rating: 4.7,
    price: "$120-250/night",
    location: "Garden District",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "3",
    title: "Budget Stay Garden",
    description: "Comfortable and affordable accommodation for budget-conscious travelers. Clean rooms, friendly staff, and great location.",
    image: hotelBudget,
    category: "Budget",
    rating: 4.3,
    price: "$50-80/night",
    location: "Near Garden City Airport",
    phone: "+1234567892",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "4",
    title: "Garden Resort & Spa",
    description: "Luxury resort with full-service spa, multiple pools, golf course, and beachfront access. All-inclusive packages available.",
    image: hotelResort,
    category: "Resort",
    rating: 4.8,
    price: "$300-600/night",
    location: "Garden City Beach",
    phone: "+1234567893",
    website: "https://example.com",
    isOpen: true
  }
];

const HotelsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredHotels = hotelsData.filter(hotel =>
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
      </div>
    </div>
  );
};

export default HotelsPage;