import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import SearchHeader from "@/components/SearchHeader";
import ListingCard from "@/components/ListingCard";
// All events are loaded from Firestore; no mock data.

interface Event {
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

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "events"));
        const eventsData = snapshot.docs.map(doc => {
          const d = doc.data() as any;
          return {
            id: doc.id,
            title: String(d.title || "Untitled Event"),
            description: String(d.description || ""),
            image: String(d.imageUrl || ""),
            category: String(d.category || "Event"),
            rating: Number(d.rating ?? 4.5),
            price: String(d.priceRange || ""),
            location: String(d.location || ""),
            phone: String(d.phone || ""),
            website: String(d.website || ""),
            isOpen: Boolean(d.isActive ?? true),
          } as Event;
        });
        setEvents(eventsData);
      } catch (err) {
        setError("Failed to fetch events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event =>
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
        {loading && <p className="text-center">Loading events...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;