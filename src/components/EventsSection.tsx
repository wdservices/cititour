import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Ticket, ArrowRight, Heart, Share2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventDetailModal from './EventDetailModal';
import { getMockImage } from '@/lib/mockImages';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

const formatField = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (val._lat !== undefined && val._long !== undefined) return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
  return String(val);
};

const EventsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(query(collection(db, "businesses"), where("category", "==", "Event")));
        const fetched: Event[] = snap.docs.map((d) => {
          const raw = d.data() as any;
          const tickets = raw.ticketTypes || [];
          const totalMax = tickets.reduce((sum: number, t: any) => sum + (Number(t.quantity) || 0), 0);
          return {
            id: d.id,
            title: formatField(raw.title) || 'Untitled Event',
            description: formatField(raw.description) || '',
            date: raw.startDate || '',
            time: raw.startTime || '',
            location: formatField(raw.location) || 'Location TBA',
            price: tickets.length > 0 ? Number(tickets[0].price) || 0 : 0,
            currency: 'NGN',
            image: raw.image || getMockImage('Event'),
            category: raw.tags?.[0] || 'General',
            organizer: '',
            attendees: 0,
            maxAttendees: totalMax,
            rating: raw.rating || 0,
            reviews: 0,
            tags: raw.tags || [],
          };
        });
        setEvents(fetched);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ['All', 'Food & Drink', 'Technology', 'Music & Entertainment', 'Arts & Culture', 'Business', 'Sports & Recreation', 'General'];

  const filteredEvents = selectedCategory === 'All'
    ? events
    : events.filter(event => event.category === selectedCategory);

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

  return (
    <section id="events" className="py-20 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Upcoming Events
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing events happening around you. From music festivals to tech conferences, find your next experience.
          </p>
        </motion.div>

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
                  ? 'bg-primary text-white'
                  : 'hover:border-primary'
              }`}
            >
              {category}
            </Button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No events yet. Check back soon!</p>
          </div>
        ) : (
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
                  <div className="relative h-48 overflow-hidden bg-primary/10">
                    <img
                      src={event.image || getMockImage(event.category)}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full">
                      NGN {event.price.toLocaleString()}
                    </div>
                    {event.maxAttendees > 0 && (
                      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span className="text-xs">{event.attendees}/{event.maxAttendees}</span>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
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
                    {event.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{event.rating}</span>
                      </div>
                    )}
                    {event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {event.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description || 'No description available'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={(e) => { e.stopPropagation(); handleViewEvent(event); }}
                        className="flex-1 bg-primary hover:opacity-90"
                      >
                        <Ticket className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleLikeEvent(event.id); }}
                        className={likedEvents.has(event.id) ? 'text-red-500 border-red-500' : ''}
                      >
                        <Heart className={`w-4 h-4 ${likedEvents.has(event.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); handleShareEvent(event); }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

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

      <EventDetailModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedEvent(null); }}
      />
    </section>
  );
};

export default EventsSection;
