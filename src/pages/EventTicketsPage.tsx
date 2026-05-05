import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Plus, Calendar, DollarSign, Share2, Copy, QrCode } from "lucide-react";
import SearchHeader from "@/components/SearchHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { addDoc, collection, serverTimestamp, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
// Removed Firebase Storage; using Cloudinary for image uploads
import QRCode from "react-qr-code";

// All tickets are loaded from Firestore; no mock data.

const COMMISSION_RATE = 0.07; // 7% commission per ticket (example)

type TicketItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  ticketType: string;
  price: string;
  quantity: number;
  sold: number;
  commission: string;
  status: string;
  date: string;
  imageUrl?: string;
};

const EventTicketsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [generatedTicket, setGeneratedTicket] = useState<{ id: string; payload: string } | null>(null);
  const [listings, setListings] = useState<TicketItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);
  const [editTicketType, setEditTicketType] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');
  const [sales, setSales] = useState<Array<{ id: string; userId: string; price: number; commission: number; status: string; createdAt?: any }>>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { deductFunds } = useWallet();
  // Extended event fields
  const [category, setCategory] = useState("Music");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string>("");
  const [shareableLink, setShareableLink] = useState<string>("");

  const filteredTickets = listings.filter(ticket =>
    ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, 'events'));
        const items: Array<{
          id: string; eventId: string; eventTitle: string; ticketType: string; price: string; quantity: number; sold: number; commission: string; status: string; date: string; imageUrl?: string;
        }> = [];
        for (const eventDoc of eventsSnap.docs) {
          const eventData: any = eventDoc.data();
          const eventId = eventDoc.id;
          const eventTitle = String(eventData.title || 'Untitled Event');
          const imageUrl = eventData.imageUrl as string | undefined;
          const date = (() => {
            const ts = eventData.startDate;
            if (ts?.toDate) {
              const d = ts.toDate();
              return d.toISOString().slice(0,10);
            }
            return '';
          })();
          const ticketsSnap = await getDocs(collection(db, 'events', eventId, 'tickets'));
          for (const ticketDoc of ticketsSnap.docs) {
            const t = ticketDoc.data() as any;
            const priceNumber = Number(t.price || 0);
            const commissionNumber = Number(t.commission ?? (priceNumber * COMMISSION_RATE));
            items.push({
              id: ticketDoc.id,
              eventId,
              eventTitle,
              ticketType: String(t.ticketType || 'Ticket'),
              price: `₦${priceNumber}`,
              quantity: Number(t.quantity || 0),
              sold: Number(t.sold || 0),
              commission: `₦${commissionNumber.toFixed(2)}`,
              status: String(t.status || 'active'),
              date,
              imageUrl,
            });
          }
        }
        setListings(items);
      } catch (e) {
        console.error('Failed to load tickets', e);
      }
    };
    loadTickets();
  }, []);

  const handlePurchase = async (ticket: TicketItem) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    try {
      setIsPurchasing(true);
      const priceNumber = Number(ticket.price.replace(/[^0-9.]/g, ''));
      const ok = await deductFunds(priceNumber, `Ticket purchase: ${ticket.eventTitle} - ${ticket.ticketType}`);
      if (!ok) {
        toast({ title: 'Wallet required', description: 'Unable to deduct from wallet. Please fund your wallet and try again.', variant: 'destructive' });
        return;
      }
      const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
      const docRef = await addDoc(collection(db, 'tickets'), {
        eventId: ticket.eventId,
        ticketId: ticket.id,
        eventTitle: ticket.eventTitle,
        userId: user.id,
        status: 'valid',
        price: priceNumber,
        commission,
        createdAt: serverTimestamp(),
      });
      const payload = `ticket:${docRef.id}`;
      setGeneratedTicket({ id: docRef.id, payload });
    } catch (e) {
      console.error('Purchase failed', e);
    } finally {
      setIsPurchasing(false);
    }
  };

  const openEdit = (ticket: TicketItem) => {
    setActiveTicket(ticket);
    setEditTicketType(ticket.ticketType);
    setEditPrice(String(Number(ticket.price.replace(/[^0-9.]/g, '')) || ''));
    setEditQuantity(String(ticket.quantity));
    setEditStatus(ticket.status === 'active' ? 'active' : 'inactive');
    setEditOpen(true);
  };

  const saveEdit = async () => {
    if (!activeTicket) return;
    if (!user) {
      toast({ title: 'Login required', description: 'Please sign in to edit a ticket.' });
      navigate('/auth');
      return;
    }
    const priceNumber = Number(editPrice);
    const quantityNumber = Number(editQuantity);
    if (!editTicketType || isNaN(priceNumber) || isNaN(quantityNumber) || priceNumber <= 0 || quantityNumber <= 0) {
      toast({ title: 'Invalid values', description: 'Please provide a valid type, price, and quantity.', variant: 'destructive' });
      return;
    }
    try {
      setIsUpdatingTicket(true);
      const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
      await updateDoc(doc(db, 'events', activeTicket.eventId, 'tickets', activeTicket.id), {
        ticketType: editTicketType,
        price: priceNumber,
        quantity: quantityNumber,
        available: quantityNumber - Number(activeTicket.sold || 0) < 0 ? 0 : quantityNumber - Number(activeTicket.sold || 0),
        commission,
        status: editStatus,
        updatedAt: serverTimestamp(),
      });
      setListings(prev => prev.map(t => t.id === activeTicket.id ? {
        ...t,
        ticketType: editTicketType,
        price: `₦${priceNumber}`,
        quantity: quantityNumber,
        commission: `₦${commission}`,
        status: editStatus,
      } : t));
      toast({ title: 'Ticket updated', description: 'Changes saved successfully.' });
      setEditOpen(false);
    } catch (e: any) {
      console.error('Update ticket failed', e);
      toast({ title: 'Failed to update', description: e?.message || 'Please try again.', variant: 'destructive' });
    } finally {
      setIsUpdatingTicket(false);
    }
  };

  const openSales = async (ticket: TicketItem) => {
    setActiveTicket(ticket);
    setSalesOpen(true);
    setSalesLoading(true);
    try {
      const q = query(collection(db, 'tickets'), where('ticketId', '==', ticket.id));
      const snap = await getDocs(q);
      const items: Array<{ id: string; userId: string; price: number; commission: number; status: string; createdAt?: any }> = [];
      for (const d of snap.docs) {
        const data = d.data() as any;
        items.push({
          id: d.id,
          userId: String(data.userId || ''),
          price: Number(data.price || 0),
          commission: Number(data.commission || 0),
          status: String(data.status || 'valid'),
          createdAt: data.createdAt,
        });
      }
      setSales(items);
    } catch (e) {
      console.error('Load sales failed', e);
      toast({ title: 'Failed to load sales', description: 'Please try again later.' });
    } finally {
      setSalesLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    // Basic validation
    const priceNumber = Number(price);
    const quantityNumber = Number(quantity);
    if (!eventTitle || !ticketType || !date || isNaN(priceNumber) || isNaN(quantityNumber) || priceNumber <= 0 || quantityNumber <= 0) {
      toast({
        title: 'Missing or invalid information',
        description: 'Please fill all fields with valid values.',
        variant: 'destructive'
      });
      return;
    }
    try {
      setIsCreating(true);
      // Create event document
      const eventRef = await addDoc(collection(db, 'events'), {
        organizerId: user.id,
        title: eventTitle,
        description,
        category,
        eventType: 'listing',
        venue,
        address,
        location,
        website,
        phone,
        priceRange,
        startDate: new Date(date),
        endDate: new Date(date),
        startTime,
        endTime,
        capacity: capacity ? Number(capacity) : null,
        ticketsAvailable: quantityNumber,
        ticketsSold: 0,
        status: 'upcoming',
        isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      // Create ticket type under the event FIRST
      const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
      const ticketRef = await addDoc(collection(db, 'events', eventRef.id, 'tickets'), {
        eventId: eventRef.id,
        ticketType,
        price: priceNumber,
        quantity: quantityNumber,
        sold: 0,
        available: quantityNumber,
        commission,
        description: 'User-created ticket',
        status: 'active',
        createdAt: serverTimestamp(),
      });

      // Optional image upload (non-blocking) via Cloudinary
      if (imageFile) {
        try {
          const { secureUrl, publicId } = await uploadImageToCloudinary(imageFile, { folder: `events/${eventRef.id}` });
          await updateDoc(doc(db, 'events', eventRef.id), { imageUrl: secureUrl, imagePublicId: publicId });
        } catch (imgErr: any) {
          console.error('Image upload failed', imgErr);
          toast({
            title: 'Image upload failed',
            description: imgErr?.message || 'Event created without image.',
            variant: 'destructive'
          });
        }
      }

      // Update local list for immediate feedback
      setListings(prev => [
        ...prev,
        {
          id: ticketRef.id,
          eventId: eventRef.id,
          eventTitle,
          ticketType,
          price: `₦${priceNumber}`,
          quantity: quantityNumber,
          sold: 0,
          commission: `₦${commission}`,
          status: 'active',
          date,
        }
      ]);

      toast({
        title: 'Event created successfully!',
        description: 'Your event and ticket type have been created.',
      });
      
      // Generate shareable link and show share dialog
      const shareLink = generateShareableLink(eventRef.id, eventTitle);
      setShareDialogOpen(true);
      
      // Reset and close
      setEventTitle('');
      setTicketType('');
      setPrice('');
      setQuantity('');
      setDate('');
      setCreateOpen(false);
    } catch (e: any) {
      console.error('Create ticket failed', e);
      toast({
        title: 'Failed to create ticket',
        description: e?.message || 'Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Share functionality
  const generateShareableLink = (eventId: string, eventTitle: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://cititourng.com';
    const shareLink = `${baseUrl}/events/${eventId}`;
    setShareableLink(shareLink);
    setCreatedEventId(eventId);
    return shareLink;
  };

  const handleShareEvent = (ticket: TicketItem) => {
    const shareLink = generateShareableLink(ticket.eventId, ticket.eventTitle);
    setShareDialogOpen(true);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  const handleShareViaNative = () => {
    if (navigator.share) {
      navigator.share({
        title: "Check out this event!",
        text: `Join us for an amazing event`,
        url: shareableLink,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleShowQR = () => {
    setQrDialogOpen(true);
    setShareDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        title="Event Tickets"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search your tickets..."
      />
      
      <div className="px-4 py-6">
        {/* Create Ticket Button */}
        <Card className="mb-6 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Create New Event Ticket</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Start selling tickets for your upcoming event
            </p>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Ticket
            </Button>
          </CardContent>
        </Card>

        {/* Create Ticket Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>Set up your event and ticket type</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventTitle">Event Title *</Label>
                <Input id="eventTitle" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g., Garden City Music Festival" />
              </div>
              <div>
                <Label htmlFor="ticketType">Ticket Type *</Label>
                <Input id="ticketType" value={ticketType} onChange={(e) => setTicketType(e.target.value)} placeholder="e.g., General Admission" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input id="price" type="number" min="1" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Event Date *</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Music">Music</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Festival">Festival</SelectItem>
                    <SelectItem value="Exhibition">Exhibition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short event description" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue name" />
                </div>
                <div>
                  <Label htmlFor="location">City/Area</Label>
                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Makati, Manila" />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Input id="priceRange" value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="₦25-50" />
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" type="number" min="0" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="image">Event Image</Label>
                <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <span className="text-sm">Active</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setCreateOpen(false)} disabled={isCreating}>Cancel</Button>
                <Button className="flex-1" onClick={handleCreateTicket} disabled={isCreating}>
                  {isCreating ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">
                      {ticket.eventTitle}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {ticket.ticketType}
                    </p>
                  </div>
                  <Badge 
                    variant={ticket.status === 'active' ? 'default' : 'secondary'}
                    className={ticket.status === 'active' ? 'bg-green-500' : ''}
                  >
                    {ticket.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-medium">{ticket.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sold</p>
                      <p className="font-medium">{ticket.sold}/{ticket.quantity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-muted-foreground">Commission</p>
                      <p className="font-medium text-green-600">{ticket.commission}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Event Date</p>
                      <p className="font-medium">{ticket.date}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(ticket)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openSales(ticket)}>
                    Sales
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShareEvent(ticket)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => handlePurchase(ticket)} disabled={isPurchasing}>
                    {isPurchasing ? 'Processing...' : 'Buy'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tickets found matching your search.</p>
          </div>
        )}
      </div>

      {/* Generated E-ticket */}
      {generatedTicket && (
        <div className="px-4 pb-10">
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Your E-ticket</h3>
              <p className="text-sm text-muted-foreground mb-4">Show this QR at the event entrance.</p>
              <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                <QRCode value={generatedTicket.payload} size={180} />
              </div>
              <p className="text-xs text-muted-foreground mt-3">Ticket ID: {generatedTicket.id}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Ticket Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Ticket</DialogTitle>
            <DialogDescription>Update details for this ticket type</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editType">Ticket Type</Label>
              <Input id="editType" value={editTicketType} onChange={(e) => setEditTicketType(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="editPrice">Price (₦)</Label>
                <Input id="editPrice" type="number" min="1" step="0.01" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="editQty">Quantity</Label>
                <Input id="editQty" type="number" min="1" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v as 'active' | 'inactive')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setEditOpen(false)} disabled={isUpdatingTicket}>Cancel</Button>
              <Button className="flex-1" onClick={saveEdit} disabled={isUpdatingTicket}>{isUpdatingTicket ? 'Saving…' : 'Save Changes'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Sales Dialog */}
      <Dialog open={salesOpen} onOpenChange={setSalesOpen}>
        <DialogContent className="sm:max-w-lg max-h-[75vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sales</DialogTitle>
            <DialogDescription>Purchases for this ticket type</DialogDescription>
          </DialogHeader>
          {salesLoading ? (
            <p className="text-sm text-muted-foreground">Loading sales…</p>
          ) : sales.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sales yet for this ticket.</p>
          ) : (
            <div className="space-y-3">
              {sales.map(s => (
                <div key={s.id} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <p className="text-sm font-medium">Buyer: {s.userId || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">Status: {s.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Price: ₦{s.price}</p>
                    <p className="text-xs text-muted-foreground">Commission: ₦{s.commission}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Share Event Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Event</DialogTitle>
            <DialogDescription>Share your event with potential attendees</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Event Link:</p>
              <div className="flex items-center gap-2">
                <Input 
                  value={shareableLink} 
                  readOnly 
                  className="flex-1 text-sm"
                />
                <Button size="sm" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={handleShareViaNative} className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleShowQR} variant="outline" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>• Anyone with this link can view and book your event</p>
              <p>• QR code can be scanned for quick access</p>
              <p>• Share on social media to reach more attendees</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event QR Code</DialogTitle>
            <DialogDescription>Scan this code to view the event</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center p-6 bg-muted rounded-lg">
              <QRCode value={shareableLink} size={200} />
              <p className="text-sm text-muted-foreground mt-4">Scan to view event</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                value={shareableLink} 
                readOnly 
                className="flex-1 text-sm"
              />
              <Button size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Print this QR code and display it at your venue or share it digitally
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTicketsPage;