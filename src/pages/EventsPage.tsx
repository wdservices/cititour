import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, Heart, Share2, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SEO from "@/components/SEO";
import EventDetailModal from '../components/EventDetailModal';
import { getMockImage } from '@/lib/mockImages';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  rating: number;
  reviews: number;
  isFeatured?: boolean;
  tags: string[];
}

const EventsPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Food & Drink', 'Technology', 'Music & Entertainment', 'Arts & Culture', 'Business', 'Sports & Recreation'];

  useEffect(() => {
    // For now, use mock data to show all 6 events
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Lagos Food & Wine Festival',
        description: 'Experience the finest culinary delights from top chefs across Nigeria. Live cooking demonstrations, wine tasting, and gourmet food sampling.',
        date: '2024-06-15',
        time: '12:00 PM',
        location: 'Eko Atlantic, Lagos',
        price: 5000,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        category: 'Food & Drink',
        organizer: 'Lagos Culinary Guild',
        attendees: 245,
        maxAttendees: 500,
        rating: 4.8,
        reviews: 89,
        isFeatured: true,
        tags: ['food', 'wine', 'festival', 'tasting']
      },
      {
        id: '2',
        title: 'Tech Summit Abuja 2024',
        description: 'Connect with tech leaders, innovators, and entrepreneurs. Keynote speeches, panel discussions, and networking opportunities.',
        date: '2024-07-20',
        time: '9:00 AM',
        location: 'Abuja International Conference Center',
        price: 15000,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        category: 'Technology',
        organizer: 'TechHub Nigeria',
        attendees: 180,
        maxAttendees: 300,
        rating: 4.6,
        reviews: 67,
        tags: ['tech', 'conference', 'networking', 'innovation']
      },
      {
        id: '3',
        title: 'Afrobeats Night Live',
        description: 'An unforgettable night of live Afrobeats music featuring top Nigerian artists. Dance, enjoy, and experience the best of Nigerian music culture.',
        date: '2024-06-30',
        time: '8:00 PM',
        location: 'Eko Hotels & Suites, Lagos',
        price: 7500,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
        category: 'Music & Entertainment',
        organizer: 'Beat Entertainment',
        attendees: 320,
        maxAttendees: 450,
        rating: 4.9,
        reviews: 124,
        isFeatured: true,
        tags: ['music', 'afrobeats', 'live', 'concert']
      },
      {
        id: '4',
        title: 'Art Exhibition: Nigerian Masters',
        description: 'Celebrate Nigerian contemporary art with works from renowned artists. Gallery tours, artist meet-and-greets, and art workshops.',
        date: '2024-07-10',
        time: '10:00 AM',
        location: 'Nike Art Gallery, Lagos',
        price: 2000,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&q=80',
        category: 'Arts & Culture',
        organizer: 'Nigerian Artists Association',
        attendees: 89,
        maxAttendees: 150,
        rating: 4.7,
        reviews: 45,
        tags: ['art', 'exhibition', 'culture', 'gallery']
      },
      {
        id: '5',
        title: 'Entrepreneurship Workshop',
        description: 'Learn from successful Nigerian entrepreneurs. Business strategies, funding opportunities, and growth hacking techniques.',
        date: '2024-08-05',
        time: '2:00 PM',
        location: 'Co-Creation Hub, Abuja',
        price: 3500,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
        category: 'Business',
        organizer: 'Startup Nigeria',
        attendees: 67,
        maxAttendees: 100,
        rating: 4.5,
        reviews: 34,
        tags: ['business', 'workshop', 'entrepreneurship', 'learning']
      },
      {
        id: '6',
        title: 'Beach Volleyball Tournament',
        description: 'Join the exciting beach volleyball competition at Tarkwa Bay. Professional players, amateur teams, and family fun activities.',
        date: '2024-07-25',
        time: '10:00 AM',
        location: 'Tarkwa Bay Beach, Lagos',
        price: 1000,
        currency: 'NGN',
        image: 'https://images.unsplash.com/photo-1461896836934-bd45ba8f8e8b?w=800&q=80',
        category: 'Sports & Recreation',
        organizer: 'Lagos Sports Club',
        attendees: 156,
        maxAttendees: 200,
        rating: 4.4,
        reviews: 28,
        tags: ['sports', 'volleyball', 'beach', 'tournament']
      }
    ];
    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'All' || event.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' || 
      (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
      (event.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLikeEvent = (eventId: string) => {
    setLikedEvents(prev => {
      const newLikes = new Set(prev);
      if (newLikes.has(eventId)) {
        newLikes.delete(eventId);
      } else {
        newLikes.add(eventId);
      }
      return newLikes;
    });
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleShareEvent = (event: Event) => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/events/${event.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Events | CititourNG"
        description="Discover the best events happening in Lagos & Port Harcourt."
        keywords={["events", "Nigeria", "parties", "concerts", "gatherings"]}
        canonicalUrl={`${window.location.origin}/events`}
      />

      {/* Blue Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 -ml-2"
            onClick={() => navigate('/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Calendar className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold">Events</h1>
                <p className="text-white/80 mt-1">Discover amazing events happening around you</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full ${
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'hover:border-primary'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => handleViewEvent(event)}>
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden bg-primary/10">
                  <img
                    src={event.image || getMockImage(event.category)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Featured Badge */}
                  {event.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-primary text-white">
                      Featured
                    </Badge>
                  )}

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    {event.currency || 'NGN'} {event.price != null ? event.price.toLocaleString() : '0'}
                  </div>

                  {/* Attendees Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{event.attendees || 0}/{event.maxAttendees || 0}</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.title || 'Untitled Event'}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location || 'Location TBA'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date ? new Date(event.date).toLocaleDateString() : 'Date TBA'}</span>
                    {event.time && (
                      <>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Rating */}
              {event.rating != null && (
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{event.rating}</span>
                  <span className="text-sm text-muted-foreground">({event.reviews || 0} reviews)</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {(event.tags || []).slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {event.description || 'No description available'}
              </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEvent(event);
                      }}
                      className="flex-1 bg-primary hover:opacity-90"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeEvent(event.id);
                      }}
                      className={likedEvents.has(event.id) ? 'text-red-500 border-red-500' : ''}
                    >
                      <Heart className={`w-4 h-4 ${likedEvents.has(event.id) ? 'fill-current' : ''}`} />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareEvent(event);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Organizer Info */}
              <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                {event.organizer ? `Organized by ${event.organizer}` : 'Organizer TBA'}
              </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events found matching your search.</p>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
};

export default EventsPage;