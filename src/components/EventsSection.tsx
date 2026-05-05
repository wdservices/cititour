import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, ArrowRight, Heart, Share2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventDetailModal from './EventDetailModal';

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
    image: '/api/placeholder/400/250',
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
    image: '/api/placeholder/400/250',
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
    image: '/api/placeholder/400/250',
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
    image: '/api/placeholder/400/250',
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
    image: '/api/placeholder/400/250',
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
    image: '/api/placeholder/400/250',
    category: 'Sports & Recreation',
    organizer: 'Lagos Sports Club',
    attendees: 156,
    maxAttendees: 200,
    rating: 4.4,
    reviews: 28,
    tags: ['sports', 'volleyball', 'beach', 'tournament']
  }
];

const EventsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Food & Drink', 'Technology', 'Music & Entertainment', 'Arts & Culture', 'Business', 'Sports & Recreation'];

  const filteredEvents = selectedCategory === 'All' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === selectedCategory);

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/events/${event.id}`);
    }
  };

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-violet-700 to-sky-600 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing events happening around you. From music festivals to tech conferences, find your next experience.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
                  ? 'bg-gradient-to-r from-violet-600 to-sky-600 text-white'
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
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer" onClick={() => handleViewEvent(event)}>
                {/* Event Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-violet-400 to-sky-400 flex items-center justify-center">
                    <Calendar className="w-16 h-16 text-white/50" />
                  </div>
                  
                  {/* Featured Badge */}
                  {event.isFeatured && (
                    <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      Featured
                    </Badge>
                  )}

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                    NGN {event.price.toLocaleString()}
                  </div>

                  {/* Attendees Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs">{event.attendees}/{event.maxAttendees}</span>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {event.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{event.rating}</span>
                    <span className="text-sm text-muted-foreground">({event.reviews} reviews)</span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookEvent(event);
                      }}
                      className="flex-1 bg-gradient-to-r from-violet-600 to-sky-600 hover:opacity-90"
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
                    Organized by {event.organizer}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Events Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-3 group"
            onClick={() => window.location.href = '/events'}
          >
            View All Events
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
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
    </section>
  );
};

export default EventsSection;
