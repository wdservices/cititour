import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Clock, Users, Ticket, Heart, Share2, ArrowLeft,
  CreditCard, Smartphone, Wallet, X, Loader2, CheckCircle2, User, Mail, Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { logActivity } from "@/lib/activityLog";
import { AddressPicker } from "@/components/AddressPicker";
import { getMockImage } from "@/lib/mockImages";
import { fmt } from "@/lib/useFirestore";

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  startDate: string;
  startTime: string;
  ownerId: string;
  ticketTypes: TicketTier[];
  tags: string[];
  category: string;
  lat?: number;
  lon?: number;
}

type Step = 'details' | 'register' | 'payment' | 'success';

const DynamicEventPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance, deductFunds } = useWallet();
  const qc = useQueryClient();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>('details');
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'wallet' | 'transfer'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!eventId) { navigate('/'); return; }
    const load = async () => {
      try {
        setLoading(true);
        const snap = await getDoc(doc(db, 'events', eventId));
        if (!snap.exists()) {
          toast({ title: "Event Not Found", description: "This event may have been removed.", variant: "destructive" });
          navigate('/');
          return;
        }
        const data = snap.data() as any;
        setEvent({
          id: snap.id,
          title: fmt(data.title) || 'Untitled Event',
          description: fmt(data.description) || '',
          location: fmt(data.location) || 'Location TBA',
          image: data.image || getMockImage('Event'),
          startDate: data.startDate || '',
          startTime: data.startTime || '',
          ownerId: data.ownerId || '',
          ticketTypes: (data.ticketTypes || []).map((t: any) => ({
            name: t.name || 'General',
            price: Number(t.price) || 0,
            quantity: Number(t.quantity) || 0,
          })),
          tags: data.tags || [],
          category: data.tags?.[0] || 'Event',
          lat: data.lat,
          lon: data.lon,
        });
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Failed to load event.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId, navigate, toast]);

  const reset = () => { setStep('details'); setSelectedTier(null); setQuantity(1); setName(''); setEmail(''); setPhone(''); setSelectedPayment('card'); };

  const tickets = event?.ticketTypes || [];
  const isFree = tickets.length === 0 || tickets.every(t => t.price === 0);
  const total = selectedTier ? selectedTier.price * quantity : 0;

  const handleAttend = () => {
    if (!user) { toast({ title: 'Sign in required', description: 'Please sign in to attend.', variant: 'destructive' }); return; }
    if (!isFree && tickets.length > 0 && !selectedTier) {
      toast({ title: 'Select a ticket', description: 'Please choose a ticket tier before continuing.', variant: 'destructive' });
      return;
    }
    setName(user.name || '');
    setEmail(user.email || '');
    setStep('register');
  };

  const handleRegisterSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast({ title: 'Missing info', description: 'Please fill in your name and email.', variant: 'destructive' }); return;
    }
    if (isFree) { submitOrder(); }
    else {
      if (!selectedTier) { toast({ title: 'Select a ticket', description: 'Please choose a ticket tier.', variant: 'destructive' }); return; }
      setStep('payment');
    }
  };

  const submitOrder = async () => {
    if (!user || !event) return;
    setSubmitting(true);
    try {
      // If paying with wallet, deduct funds first
      if (!isFree && selectedPayment === 'wallet' && total > 0) {
        if (balance < total) {
          toast({
            title: 'Insufficient Balance',
            description: `You need ₦${total.toLocaleString()} but only have ₦${balance.toLocaleString()} in your wallet.`,
            variant: 'destructive',
          });
          setSubmitting(false);
          return;
        }
        const deducted = await deductFunds(total, `Event Ticket: ${event.title}`);
        if (!deducted) {
          setSubmitting(false);
          return;
        }
      }

      await addDoc(collection(db, 'ticket_orders'), {
        eventId: event.id,
        eventTitle: event.title,
        ownerId: event.ownerId || '',
        buyerId: user.id,
        buyerName: name.trim(),
        buyerEmail: email.trim(),
        buyerPhone: phone.trim() || '',
        ticketTier: selectedTier?.name || 'Free',
        quantity,
        amount: total,
        totalAmount: total,
        paymentMethod: isFree ? 'free' : selectedPayment,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      logActivity({ userId: user.id, userEmail: user.email || "", userName: user.name || "", action: "register_event", targetType: "event", targetId: event.id, targetName: event.title, details: "Registered for event: " + event.title });
      setStep('success');
      qc.invalidateQueries({ queryKey: ["myEventOrders"] });
      qc.invalidateQueries({ queryKey: ["ticket_orders"] });
      toast({ title: 'You are registered!', description: `Your spot for "${event.title}" is confirmed.` });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Something went wrong.', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const paymentMethods = [
    { id: 'card' as const, label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, or Verve' },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet, desc: 'Pay with your in-app wallet' },
    { id: 'transfer' as const, label: 'Bank Transfer', icon: Smartphone, desc: 'Bank transfer or USSD' },
  ];

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) { navigator.share({ title: event?.title, text: event?.description, url }); }
    else { navigator.clipboard.writeText(url); toast({ title: 'Link copied!' }); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <Button onClick={() => navigate('/events')}><ArrowLeft className="h-4 w-4 mr-2" />Back to Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => step !== 'details' ? reset() : window.history.length > 2 ? navigate(-1) : navigate('/events')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold truncate">{step === 'details' ? event.title : step === 'register' ? 'Register' : step === 'payment' ? 'Payment' : 'Confirmed'}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {step === 'details' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main */}
            <div className="md:col-span-2 space-y-5">
              {event.image && (
                <div className="relative h-64 rounded-2xl overflow-hidden bg-primary/10">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <Badge className="mb-2">{event.category}</Badge>
                <h1 className="text-3xl font-bold mb-3">{event.title}</h1>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description || 'No description available.'}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" /><span>{event.startDate ? new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Date TBA'}</span></div>
                {event.startTime && <div className="flex items-center gap-2 text-muted-foreground"><Clock className="w-4 h-4" /><span>{event.startTime}</span></div>}
                <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /><span>{event.location}</span></div>
                {event.lat && event.lon && (
                  <div className="mt-3">
                    <AddressPicker readOnly initialLat={event.lat} initialLon={event.lon} initialAddress={event.location} />
                  </div>
                )}
              </div>
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">{event.tags.map(t => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-3">
                  <h4 className="font-semibold">{isFree ? 'Free Event' : 'Select Ticket'}</h4>
                  {tickets.length === 0 ? (
                    <p className="text-sm text-muted-foreground">This is a free event.</p>
                  ) : tickets.map((tier, i) => {
                    const available = tier.quantity;
                    const isSelected = selectedTier?.name === tier.name;
                    return (
                      <button key={i} disabled={available <= 0}
                        onClick={() => { setSelectedTier(tier); setQuantity(1); }}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${available <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{tier.name || `Tier ${i + 1}`}</span>
                          <span className="font-bold text-primary">{tier.price === 0 ? 'Free' : `₦${tier.price.toLocaleString()}`}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{available} spots</p>
                      </button>
                    );
                  })}
                  <Button onClick={handleAttend} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                    <Ticket className="w-4 h-4 mr-2" />{isFree ? 'Reserve a Spot' : 'Attend'}
                  </Button>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsLiked(!isLiked)}>
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-destructive text-destructive' : ''}`} />{isLiked ? 'Saved' : 'Save'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />Share
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 'register' && (
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-1">Register for {event.title}</h3>
            <p className="text-sm text-muted-foreground mb-6">Fill in your details to reserve a spot</p>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold uppercase text-muted-foreground">Full Name *</Label>
                <div className="relative mt-1.5"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} className="pl-10" /></div>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase text-muted-foreground">Email *</Label>
                <div className="relative mt-1.5"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} className="pl-10" /></div>
              </div>
              <div>
                <Label className="text-xs font-bold uppercase text-muted-foreground">Phone (optional)</Label>
                <div className="relative mt-1.5"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input type="tel" placeholder="0801 234 5678" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10" /></div>
              </div>
              {!isFree && selectedTier && (
                <div>
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Tickets</Label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                    <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}>+</Button>
                    <span className="text-sm text-muted-foreground ml-2">× ₦{selectedTier.price.toLocaleString()} = ₦{total.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            <Button onClick={handleRegisterSubmit} className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
              {isFree ? 'Confirm Reservation' : 'Continue to Payment'}<ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {step === 'payment' && (
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <div className="bg-muted/30 rounded-xl p-4 mb-5">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{event.title}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ticket</span><span className="font-medium">{selectedTier?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{quantity}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">₦{total.toLocaleString()}</span></div>
              </div>
            </div>
            <div className="space-y-2 mb-5">
              {paymentMethods.map(m => {
                const Icon = m.icon;
                return (
                  <Button key={m.id} variant={selectedPayment === m.id ? 'default' : 'outline'} className="w-full justify-start h-auto p-3" onClick={() => setSelectedPayment(m.id)}>
                    <div className="flex items-center gap-3 text-left"><Icon className="w-5 h-5" /><div><div className="font-medium">{m.label}</div><div className="text-xs text-muted-foreground">{m.desc}</div></div></div>
                  </Button>
                );
              })}
            </div>
            <Button onClick={submitOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}Pay ₦{total.toLocaleString()}
            </Button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2">You're In!</h3>
            <p className="text-muted-foreground mb-1">Your spot for <strong>{event.title}</strong> is confirmed.</p>
            {selectedTier && <p className="text-sm text-muted-foreground mb-1">{selectedTier.name} × {quantity}</p>}
            {total > 0 && <p className="text-sm font-semibold text-primary mb-4">₦{total.toLocaleString()} paid</p>}
            <p className="text-xs text-muted-foreground mb-6">A confirmation has been sent to {email}</p>
            <Button onClick={() => { reset(); navigate('/events'); }} className="bg-accent text-accent-foreground hover:bg-accent/90">Done</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicEventPage;
