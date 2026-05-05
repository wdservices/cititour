import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  Heart, 
  Share2, 
  Star, 
  X, 
  ArrowRight,
  CreditCard,
  Smartphone,
  Wallet
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

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
  tags: string[];
}

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'wallet' | 'transfer'>('card');
  const { toast } = useToast();

  if (!event) return null;

  const handleBookNow = () => {
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Simulate payment processing
    toast({
      title: "Payment Successful!",
      description: `Your booking for "${event.title}" is confirmed.`,
    });
    setShowPayment(false);
    onClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.origin + `/events/${event.id}`
      });
    } else {
      navigator.clipboard.writeText(`${event.title} - ${window.location.origin}/events/${event.id}`);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: isLiked ? "Event removed from your favorites." : "Event added to your favorites.",
    });
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or Verve' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Pay with your in-app wallet' },
    { id: 'transfer', label: 'Bank Transfer', icon: Smartphone, description: 'Pay with bank transfer or USSD' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header with Image */}
        <div className="relative h-64 bg-gradient-to-br from-violet-400 to-sky-400">
          <div className="absolute inset-0 bg-black/20" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">
                  {event.category}
                </Badge>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {event.title}
                </DialogTitle>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{event.rating}</span>
                    <span>({event.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees}/{event.maxAttendees} attending</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">
                  {event.currency} {event.price.toLocaleString()}
                </div>
                <div className="text-sm text-white/80">per person</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quick Actions */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={handleBookNow}
              className="flex-1 bg-gradient-to-r from-violet-600 to-sky-600 hover:opacity-90"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Book Now
            </Button>
            <Button
              variant="outline"
              onClick={handleLike}
              className={isLiked ? 'text-red-500 border-red-500' : ''}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">About This Event</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Organizer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Organizer</h3>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">{event.organizer}</div>
                    <div className="text-sm text-muted-foreground">Event Organizer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Event Info Card */}
              <div className="bg-muted/30 rounded-lg p-4 space-y-4">
                <h3 className="font-semibold">Event Details</h3>
                
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div className="text-sm text-muted-foreground">{event.time}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{event.location}</div>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Price</div>
                    <div className="text-sm text-muted-foreground">per person</div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {event.currency} {event.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Availability</div>
                    <div className="text-sm text-muted-foreground">spots left</div>
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    {event.maxAttendees - event.attendees}
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-semibold mb-3">What's Included</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Event admission</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Welcome drink</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Event merchandise</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    <span>Certificate of attendance</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPayment && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-sm p-6"
            >
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Complete Your Booking</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Booking Summary */}
                <div className="bg-muted/30 rounded-lg p-4 mb-6">
                  <h4 className="font-medium mb-2">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{event.title}</span>
                      <span>{event.currency} {event.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Service fee</span>
                      <span>{event.currency} 500</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{event.currency} {(event.price + 500).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-medium">Select Payment Method</h4>
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <Button
                        key={method.id}
                        variant={selectedPayment === method.id ? "default" : "outline"}
                        className="w-full justify-start h-auto p-4"
                        onClick={() => setSelectedPayment(method.id as any)}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <Icon className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{method.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {method.description}
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                {/* Complete Payment Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-violet-600 to-sky-600 hover:opacity-90"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay {event.currency} {(event.price + 500).toLocaleString()}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
