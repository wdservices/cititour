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
import { uploadImageToCloudinary, CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { addDoc, collection, serverTimestamp, getDocs, updateDoc, doc, query, where } from "firebase/firestore";
import QRCode from "react-qr-code";
import ImageUpload from "@/components/ImageUpload";

const COMMISSION_RATE = 0.07;

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
  const [sales, setSales] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [ticketType, setTicketType] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { deductFunds } = useWallet();
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
  const [shareableLink, setShareableLink] = useState<string>("");

  const filteredTickets = listings.filter(ticket =>
    ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const eventsSnap = await getDocs(collection(db, 'events'));
        const items: TicketItem[] = [];
        for (const eventDoc of eventsSnap.docs) {
          const eventData: any = eventDoc.data();
          const eventId = eventDoc.id;
          const eventTitle = String(eventData.title || 'Untitled Event');
          const imageUrl = eventData.imageUrl;
          const date = eventData.startDate?.toDate ? eventData.startDate.toDate().toISOString().slice(0, 10) : '';
          
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
    if (!user) { navigate('/auth'); return; }
    try {
      setIsPurchasing(true);
      const priceNumber = Number(ticket.price.replace(/[^0-9.]/g, ''));
      const ok = await deductFunds(priceNumber, `Ticket purchase: ${ticket.eventTitle}`);
      if (!ok) {
        toast({ title: 'Wallet required', description: 'Insufficient funds.', variant: 'destructive' });
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
      setGeneratedTicket({ id: docRef.id, payload: `ticket:${docRef.id}` });
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
    if (!activeTicket || !user) return;
    const priceNumber = Number(editPrice);
    const quantityNumber = Number(editQuantity);
    try {
      setIsUpdatingTicket(true);
      const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
      await updateDoc(doc(db, 'events', activeTicket.eventId, 'tickets', activeTicket.id), {
        ticketType: editTicketType,
        price: priceNumber,
        quantity: quantityNumber,
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
      setEditOpen(false);
    } catch (e) {
      console.error('Update failed', e);
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
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSales(items);
    } catch (e) {
      console.error('Load sales failed', e);
    } finally {
      setSalesLoading(false);
    }
  };

  const generateShareableLink = (eventId: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/events/${eventId}`;
    setShareableLink(link);
    return link;
  };

  const handleCreateTicket = async () => {
    if (!user) { navigate('/auth'); return; }
    try {
      setIsCreating(true);
      const eventRef = await addDoc(collection(db, 'events'), {
        organizerId: user.id,
        title: eventTitle,
        description,
        category,
        venue,
        address,
        location,
        startDate: new Date(date),
        imageUrl: uploadedImageUrl,
        imagePublicId: uploadedImagePublicId,
        createdAt: serverTimestamp(),
      });
      
      const priceNumber = Number(price);
      const quantityNumber = Number(quantity);
      const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
      
      await addDoc(collection(db, 'events', eventRef.id, 'tickets'), {
        eventId: eventRef.id,
        ticketType,
        price: priceNumber,
        quantity: quantityNumber,
        sold: 0,
        available: quantityNumber,
        commission,
        status: 'active',
        createdAt: serverTimestamp(),
      });

      generateShareableLink(eventRef.id);
      setShareDialogOpen(true);
      setCreateOpen(false);
    } catch (e) {
      console.error('Create failed', e);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader title="Event Tickets" searchValue={searchTerm} onSearchChange={setSearchTerm} placeholder="Search tickets..." />
      
      <div className="px-4 py-6">
        <Card className="mb-6 border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <CardContent className="p-6 text-center">
            <Plus className="h-6 w-6 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Create New Event Ticket</h3>
            <Button onClick={() => setCreateOpen(true)}>Create Ticket</Button>
          </CardContent>
        </Card>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Ticket</DialogTitle>
              <DialogDescription>Set up your event and ticket type</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div><Label>Event Title *</Label><Input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} /></div>
                <div><Label>Ticket Type *</Label><Input value={ticketType} onChange={(e) => setTicketType(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Price (₦) *</Label><Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></div>
                  <div><Label>Quantity *</Label><Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Start Time</Label><Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>
                  <div><Label>End Time</Label><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></div>
                </div>
              </div>
              <div className="space-y-4">
                <div><Label>Date *</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
                <div><Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Music", "Art", "Food", "Technology", "Sports"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Venue</Label><Input value={venue} onChange={(e) => setVenue(e.target.value)} /></div>
                  <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} /></div>
                </div>
                <ImageUpload
                  onUploadSuccess={(result) => { setUploadedImageUrl(result.secureUrl); setUploadedImagePublicId(result.publicId); }}
                  folder={CLOUDINARY_FOLDERS.EVENTS}
                  currentImage={uploadedImageUrl}
                  buttonText="📤 Upload Event Image"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleCreateTicket} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create'}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{ticket.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">{ticket.ticketType}</p>
                  </div>
                  <Badge variant={ticket.status === 'active' ? 'default' : 'secondary'}>{ticket.status}</Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div><p className="text-xs text-muted-foreground">Price</p><p className="font-medium">{ticket.price}</p></div>
                  <div><p className="text-xs text-muted-foreground">Sold</p><p className="font-medium">{ticket.sold}/{ticket.quantity}</p></div>
                  <div><p className="text-xs text-muted-foreground">Commission</p><p className="font-medium">{ticket.commission}</p></div>
                  <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{ticket.date}</p></div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEdit(ticket)}>Edit</Button>
                  <Button variant="outline" size="sm" onClick={() => openSales(ticket)}>Sales</Button>
                  <Button variant="outline" size="sm" onClick={() => { generateShareableLink(ticket.eventId); setShareDialogOpen(true); }}><Share2 className="h-4 w-4" /></Button>
                  <Button size="sm" onClick={() => handlePurchase(ticket)} disabled={isPurchasing}>Buy</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {generatedTicket && (
        <Dialog open={!!generatedTicket} onOpenChange={() => setGeneratedTicket(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Your E-ticket</DialogTitle></DialogHeader>
            <div className="flex flex-col items-center p-6 bg-muted rounded-lg">
              <QRCode value={generatedTicket.payload} size={180} />
              <p className="text-xs text-muted-foreground mt-3">Ticket ID: {generatedTicket.id}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Ticket</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Ticket Type</Label><Input value={editTicketType} onChange={(e) => setEditTicketType(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Price</Label><Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} /></div>
              <div><Label>Quantity</Label><Input type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} /></div>
            </div>
            <Button className="w-full" onClick={saveEdit} disabled={isUpdatingTicket}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Share Event</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg flex gap-2">
              <Input value={shareableLink} readOnly />
              <Button size="sm" onClick={() => { navigator.clipboard.writeText(shareableLink); toast({ title: "Copied!" }); }}><Copy className="h-4 w-4" /></Button>
            </div>
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCode value={shareableLink} size={150} />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={salesOpen} onOpenChange={setSalesOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Sales History</DialogTitle></DialogHeader>
          {salesLoading ? <p>Loading...</p> : (
            <div className="space-y-2">
              {sales.map((s: any) => (
                <div key={s.id} className="p-3 border rounded-lg flex justify-between">
                  <div><p className="text-sm font-medium">User: {s.userId}</p><p className="text-xs text-muted-foreground">{s.status}</p></div>
                  <div className="text-right"><p className="text-sm">₦{s.price}</p><p className="text-xs text-muted-foreground">Comm: ₦{s.commission}</p></div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTicketsPage;
