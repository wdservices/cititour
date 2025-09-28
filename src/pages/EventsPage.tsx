import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
import eventMusic from "@/assets/event-music.jpg";
import eventArt from "@/assets/event-art.jpg";
import eventFood from "@/assets/event-food.jpg";
import eventTech from "@/assets/event-tech.jpg";

// Mock data for events
const eventsData = [
  {
    id: "1",
    title: "Garden City Music Festival",
    description: "Annual music festival featuring local and international artists. Experience live performances, food trucks, and amazing atmosphere.",
    image: eventMusic,
    category: "Music",
    rating: 4.8,
    price: "$25-50",
    location: "Central Park, Garden City",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "2", 
    title: "Art Gallery Exhibition",
    description: "Contemporary art exhibition showcasing works by emerging local artists. Interactive displays and guided tours available.",
    image: eventArt,
    category: "Art",
    rating: 4.6,
    price: "$15",
    location: "Garden City Art Center",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true
  },
  {
    id: "3",
    title: "Food & Wine Festival", 
    description: "Culinary celebration featuring the best restaurants in Garden City. Wine tastings, cooking demonstrations, and live entertainment.",
    image: eventFood,
    category: "Food",
    rating: 4.9,
    price: "$30-75",
    location: "Garden City Convention Center", 
    phone: "+1234567892",
    website: "https://example.com",
    isOpen: false
  },
  {
    id: "4",
    title: "Tech Conference 2024",
    description: "Leading technology conference bringing together innovators, entrepreneurs, and tech enthusiasts. Keynotes and networking sessions.",
    image: eventTech, 
    category: "Technology",
    rating: 4.7,
    price: "$100-200",
    location: "Garden City Business District",
    phone: "+1234567893", 
    website: "https://example.com",
    isOpen: true
  }
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const filteredEvents = eventsData.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEventClick = (eventId: string) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Events"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search events..."
      />
      
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <ListingCard
              key={event.id}
              {...event}
              onClick={() => handleEventClick(event.id)}
            />
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;