import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Users, Ticket, Heart, Share2, Star, X, ArrowRight,
  CreditCard, Smartphone, Wallet, Loader2, CheckCircle2, User, Mail, Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { logActivity } from "@/lib/activityLog";
import { AddressPicker } from "@/components/AddressPicker";

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  ownerId: string;
  ticketTypes: TicketTier[];
  tags: string[];
  lat?: number;
  lon?: number;
}

interface EventDetailModalProps {
  event: EventData | null;
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'details' | 'register' | 'payment' | 'success';

const EventDetailModal: React.FC<EventDetailModalProps> = ({ event, isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance, deductFunds } = useWallet();
  const qc = useQueryClient();
  const [step, setStep] = useState<Step>('details');
  const [selectedTier, setSelectedTier] = useState<TicketTier | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'wallet' | 'transfer'>('card');
  const [submitting, setSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  if (!event) return null;

  const tickets = event.ticketTypes || [];
  const lowestPrice = tickets.length > 0 ? Math.min(...tickets.map(t => Number(t.price) || 0)) : 0;
  const isFree = tickets.length === 0 || lowestPrice === 0;
  const total = selectedTier ? (Number(selectedTier.price) || 0) * quantity : 0;

  const reset = () => {
    setStep('details');
    setSelectedTier(null);
    setQuantity(1);
    setName('');
    setEmail('');
    setPhone('');
    setSelectedPayment('card');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAttend = () => {
    if (!user) {
      toast({ title: 'Sign in required', description: 'Please sign in to attend this event.', variant: 'destructive' });
      return;
    }
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
      toast({ title: 'Missing info', description: 'Please fill in your name and email.', variant: 'destructive' });
      return;
    }
    if (isFree) {
      submitOrder();
    } else {
      if (!selectedTier) {
        toast({ title: 'Select a ticket', description: 'Please choose a ticket tier.', variant: 'destructive' });
        return;
      }
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
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const paymentMethods = [
    { id: 'card' as const, label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, or Verve' },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet, desc: 'Pay with your in-app wallet' },
    { id: 'transfer' as const, label: 'Bank Transfer', icon: Smartphone, desc: 'Bank transfer or USSD' },
  ];

  const handleShare = () => {
    const url = `${window.location.origin}/events/${event.id}`;
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url });
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Event link copied to clipboard.' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header Image */}
        <div className="relative h-56 bg-primary overflow-hidden">
          {event.image && (
            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
          <div className="absolute bottom-4 left-6 right-6">
            <Badge className="mb-2 bg-white/20 text-white backdrop-blur-sm">{event.category || 'Event'}</Badge>
            <DialogTitle className="text-2xl font-bold text-white mb-1">{event.title}</DialogTitle>
            <div className="flex items-center gap-3 text-white/80 text-sm">
              {event.date && <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(event.date).toLocaleDateString()}</span>}
              {event.time && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: Event Details ── */}
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About This Event</h3>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description || 'No description available.'}</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{event.location || 'Location TBA'}</span>
                  </div>
                  {event.lat && event.lon && (
                    <AddressPicker readOnly initialLat={event.lat} initialLon={event.lon} initialAddress={event.location} />
                  )}
                  {event.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {event.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Ticket Tiers */}
                  <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                    <h4 className="font-semibold text-sm">{isFree ? 'Free Event' : 'Select Ticket'}</h4>
                    {tickets.length === 0 ? (
                      <p className="text-sm text-muted-foreground">This is a free event. Reserve your spot!</p>
                    ) : (
                      tickets.map((tier, i) => {
                        const available = (Number(tier.quantity) || 0);
                        const isSelected = selectedTier?.name === tier.name;
                        return (
                          <button key={i} disabled={available <= 0}
                            onClick={() => { setSelectedTier(tier); setQuantity(1); }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'} ${available <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div className="flex justify-between items-center">
                              <span className="font-medium text-sm">{tier.name || `Tier ${i + 1}`}</span>
                              <span className="font-bold text-primary">{Number(tier.price) === 0 ? 'Free' : `₦${Number(tier.price).toLocaleString()}`}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{available} spots left</p>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <Button onClick={handleAttend} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                    <Ticket className="w-4 h-4 mr-2" />
                    {isFree ? 'Reserve a Spot' : 'Attend'}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsLiked(!isLiked)}>
                      <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-destructive text-destructive' : ''}`} /> {isLiked ? 'Saved' : 'Save'}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-1" /> Share
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── STEP 2: Registration Form ── */}
          {step === 'register' && (
            <motion.div key="register" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="p-6">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('details')}>
                ← Back
              </Button>
              <h3 className="text-lg font-bold mb-1">Register for {event.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">Fill in your details to reserve a spot</p>

              <div className="space-y-4 max-w-md">
                <div>
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Full Name *</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Email *</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase text-muted-foreground">Phone (optional)</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="tel" placeholder="0801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10" />
                  </div>
                </div>

                {/* Quantity for paid tiers */}
                {!isFree && selectedTier && (
                  <div>
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Tickets</Label>
                    <div className="flex items-center gap-3 mt-1.5">
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                      <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setQuantity(quantity + 1)}>+</Button>
                      <span className="text-sm text-muted-foreground ml-2">× ₦{Number(selectedTier.price).toLocaleString()} = ₦{total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <Button onClick={handleRegisterSubmit} className="mt-6 w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={submitting}>
                {isFree ? 'Confirm Reservation' : 'Continue to Payment'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}

          {/* ── STEP 3: Payment ── */}
          {step === 'payment' && (
            <motion.div key="payment" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="p-6">
              <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => setStep('register')}>
                ← Back
              </Button>
              <h3 className="text-lg font-bold mb-4">Complete Payment</h3>

              {/* Summary */}
              <div className="bg-muted/30 rounded-xl p-4 mb-5">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-medium">{event.title}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Ticket</span><span className="font-medium">{selectedTier?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium">{quantity}</span></div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">₦{total.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 mb-5">
                {paymentMethods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <Button key={m.id} variant={selectedPayment === m.id ? 'default' : 'outline'}
                      className="w-full justify-start h-auto p-3" onClick={() => setSelectedPayment(m.id)}>
                      <div className="flex items-center gap-3 text-left">
                        <Icon className="w-5 h-5" />
                        <div><div className="font-medium">{m.label}</div><div className="text-xs text-muted-foreground">{m.desc}</div></div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              <Button onClick={submitOrder} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" disabled={submitting}>
                {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                Pay ₦{total.toLocaleString()}
              </Button>
            </motion.div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">You're In!</h3>
              <p className="text-muted-foreground mb-1">Your spot for <strong>{event.title}</strong> is confirmed.</p>
              {selectedTier && <p className="text-sm text-muted-foreground mb-1">{selectedTier.name} × {quantity}</p>}
              {total > 0 && <p className="text-sm font-semibold text-primary mb-4">₦{total.toLocaleString()} paid</p>}
              <p className="text-xs text-muted-foreground mb-6">A confirmation has been sent to {email}</p>
              <Button onClick={handleClose} className="bg-accent text-accent-foreground hover:bg-accent/90">Done</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;
