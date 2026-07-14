import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Ticket, 
  Heart, 
  Share2, 
  Star, 
  ArrowLeft,
  CreditCard,
  Smartphone,
  Wallet,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  venue: string;
  address: string;
  location: string;
  startDate: any;
  endDate: any;
  startTime: string;
  endTime: string;
  capacity: number | null;
  ticketsAvailable: number;
  ticketsSold: number;
  status: string;
  isActive: boolean;
  organizerId: string;
  website?: string;
  phone?: string;
  imageUrl?: string;
  priceRange?: string;
}

interface TicketType {
  id: string;
  ticketType: string;
  price: number;
  quantity: number;
  sold: number;
  available: number;
  commission: number;
  status: string;
}

const DynamicEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'wallet' | 'transfer'>('card');
  const [ticketQuantity, setTicketQuantity] = useState(1);

  useEffect(() => {
    if (!eventId) {
      navigate('/');
      return;
    }

    const loadEvent = async () => {
      try {
        setLoading(true);
        
        // Load event details
        const eventDoc = await getDoc(doc(db, 'events', eventId));
        if (!eventDoc.exists()) {
          toast({
            title: "Event Not Found",
            description: "This event may have been removed or the link is invalid.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        const eventData = eventDoc.data() as Event;
        setEvent({
          ...eventData,
          id: eventDoc.id
        });

        // Load ticket types for this event
        const ticketsSnapshot = await getDocs(collection(db, 'events', eventId, 'tickets'));
        const tickets = ticketsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as TicketType));
        setTicketTypes(tickets);

      } catch (error) {
        console.error('Error loading event:', error);
        toast({
          title: "Error Loading Event",
          description: "Failed to load event details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventId, navigate, toast]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "Removed from Favorites" : "Added to Favorites",
      description: isLiked ? "Event removed from your favorites." : "Event added to your favorites.",
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      });
    }
  };

  const handleBookTicket = (ticket: TicketType) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setSelectedTicket(ticket);
    setTicketQuantity(1);
    setShowPayment(true);
  };

  const handlePayment = () => {
    if (!selectedTicket || !event) return;
    
    // Simulate payment processing
    toast({
      title: "Payment Successful!",
      description: `Your booking for ${ticketQuantity}x "${event.title}" - ${selectedTicket.ticketType} is confirmed.`,
    });
    setShowPayment(false);
    setSelectedTicket(null);
  };

  const paymentMethods = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or Verve' },
    { id: 'wallet', label: 'Wallet', icon: Wallet, description: 'Pay with your in-app wallet' },
    { id: 'transfer', label: 'Bank Transfer', icon: Smartphone, description: 'Pay with bank transfer or USSD' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-muted-foreground mb-6">This event may have been removed or the link is invalid.</p>
          <Button onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Event Details</h1>
          </div>
        </div>
      </div>

      {/* Event Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Badge className="mb-2">{event.category}</Badge>
                    <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleLike}
                      className={isLiked ? 'text-destructive border-destructive' : ''}
                    >
                      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Event Image */}
                {event.imageUrl && (
                  <div className="w-full h-64 bg-primary rounded-lg mb-6 flex items-center justify-center">
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Date</div>
                      <div className="text-sm text-muted-foreground">
                        {event.startDate?.toDate?.() ? 
                          new Date(event.startDate.toDate()).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }) : 'TBD'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Time</div>
                      <div className="text-sm text-muted-foreground">
                        {event.startTime} - {event.endTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {event.venue}, {event.location}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Capacity</div>
                      <div className="text-sm text-muted-foreground">
                        {event.capacity ? `${event.ticketsSold}/${event.capacity}` : 'Unlimited'}
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Venue Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Venue Information</h3>
                  <div className="bg-muted/30 rounded-lg p-4">
                    <div className="font-medium mb-2">{event.venue}</div>
                    <div className="text-sm text-muted-foreground mb-2">{event.address}</div>
                    {event.phone && (
                      <div className="text-sm text-muted-foreground mb-2">Phone: {event.phone}</div>
                    )}
                    {event.website && (
                      <div className="text-sm">
                        <a 
                          href={event.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card>
              <CardHeader>
                <CardTitle>Available Tickets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticketTypes.length === 0 ? (
                  <p className="text-muted-foreground">No tickets available for this event.</p>
                ) : (
                  ticketTypes.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{ticket.ticketType}</h4>
                          <p className="text-sm text-muted-foreground">
                            {ticket.sold} sold out of {ticket.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            ₦{ticket.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">per person</div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2 mb-4">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(ticket.sold / ticket.quantity) * 100}%` }}
                        />
                      </div>

                      <Button 
                        className="w-full"
                        onClick={() => handleBookTicket(ticket)}
                        disabled={ticket.available <= 0}
                      >
                        {ticket.available <= 0 ? 'Sold Out' : 'Buy Now'}
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={handleShare} className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                <Button onClick={handleLike} className="w-full" variant="outline">
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'Remove from Favorites' : 'Add to Favorites'}
                </Button>
              </CardContent>
            </Card>

            {/* Event Status */}
            <Card>
              <CardHeader>
                <CardTitle>Event Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status</span>
                    <Badge className={event.isActive ? 'bg-success text-success-foreground' : 'bg-primary text-primary-foreground'}>
                      {event.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tickets Available</span>
                    <span className="text-sm font-medium">
                      {ticketTypes.reduce((sum, ticket) => sum + ticket.available, 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Booking</DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-medium mb-3">Booking Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">{event.title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{selectedTicket.ticketType}</span>
                    <div className="flex items-center gap-3 bg-background border border-border/50 rounded-lg p-1 shadow-sm">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}>-</Button>
                      <span className="font-bold w-4 text-center">{ticketQuantity}</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => setTicketQuantity(Math.min(selectedTicket.available, ticketQuantity + 1))}>+</Button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Price per ticket</span>
                    <span>₦{selectedTicket.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Service fee</span>
                    <span>₦500</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">₦{((selectedTicket.price * ticketQuantity) + 500).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
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

              <Button
                onClick={handlePayment}
                className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-base shadow-lg shadow-primary/20"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay ₦{((selectedTicket.price * ticketQuantity) + 500).toLocaleString()}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DynamicEventPage;
