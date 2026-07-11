import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, Calendar, MapPin, Share2, Copy, QrCode, Filter, Settings, 
  Search, Edit3, User, BarChart, Trash2, Home, Compass, Bookmark, 
  Users, Bell, HelpCircle, ArrowUpRight, TrendingUp, CheckCircle, 
  Star, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/contexts/WalletContext";
import { db } from "@/lib/firebase";
import { uploadImageToCloudinary, CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { addDoc, collection, serverTimestamp, getDocs, updateDoc, doc, query, where, deleteDoc } from "firebase/firestore";
import QRCode from "react-qr-code";
import ImageUpload from "@/components/ImageUpload";
import SEO from "@/components/SEO";

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
  location?: string;
};

const EventTicketsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'attendees'>('overview');
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [listings, setListings] = useState<TicketItem[]>([]);
  const [allSales, setAllSales] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [ticketTiers, setTicketTiers] = useState([{ name: '', price: '', quantity: '' }]);
  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [category, setCategory] = useState("Music");
  const [description, setDescription] = useState("");
  const [venue, setVenue] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  const [editOpen, setEditOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<TicketItem | null>(null);
  const [isUpdatingTicket, setIsUpdatingTicket] = useState(false);
  const [editTicketType, setEditTicketType] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive' | 'draft'>('active');
  
  const [salesOpen, setSalesOpen] = useState(false);
  const [sales, setSales] = useState<any[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);
  
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareableLink, setShareableLink] = useState<string>("");

  const filteredTickets = listings.filter(ticket =>
    ticket.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticketType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!user) return;
    const loadTickets = async () => {
      try {
        // Query by organizerId (direct event ticket creations)
        const eventsSnap1 = await getDocs(
          query(
            collection(db, 'businesses'), 
            where('organizerId', '==', user.id)
          )
        );

        // Query by ownerId (event creations from business listings)
        const eventsSnap2 = await getDocs(
          query(
            collection(db, 'businesses'), 
            where('ownerId', '==', user.id)
          )
        );

        const mergedDocsMap = new Map();
        eventsSnap1.docs.forEach(doc => mergedDocsMap.set(doc.id, doc));
        eventsSnap2.docs.forEach(doc => mergedDocsMap.set(doc.id, doc));

        const eventDocs = Array.from(mergedDocsMap.values()).filter((doc: any) => {
          const cat = doc.data().category;
          return cat === 'Event' || cat === 'Events';
        });

        const items: TicketItem[] = [];

        for (const eventDoc of eventDocs) {
          const eventData: any = eventDoc.data();
          const eventId = eventDoc.id;
          
          const eventTitle = String(eventData.title || eventData.businessName || 'Untitled Event');
          const imageUrl = eventData.imageUrl || (eventData.images && eventData.images[0]);
          
          let date = '';
          if (eventData.startDate) {
            if (typeof eventData.startDate === 'string') {
              date = eventData.startDate.slice(0, 10);
            } else if (eventData.startDate.toDate) {
              date = eventData.startDate.toDate().toISOString().slice(0, 10);
            }
          }
          const location = eventData.location || eventData.venue || 'TBA';
          
          const ticketsSnap = await getDocs(collection(db, 'businesses', eventId, 'tickets'));
          
          if (ticketsSnap.empty) {
            items.push({
              id: 'no-tickets-' + eventId,
              eventId,
              eventTitle,
              ticketType: 'General Admission',
              price: '₦0',
              quantity: 0,
              sold: 0,
              commission: '₦0.00',
              status: eventData.isActive ? 'active' : 'inactive',
              date,
              imageUrl,
              location,
            });
          } else {
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
                location,
              });
            }
          }
        }
        setListings(items);

        // Load all sales/bookings globally for these tickets
        const salesItems: any[] = [];
        for (const item of items) {
          if (item.id.startsWith('no-tickets-')) continue;
          try {
            const qSales = query(collection(db, 'tickets'), where('ticketId', '==', item.id));
            const salesSnap = await getDocs(qSales);
            salesSnap.docs.forEach(d => {
              const data = d.data();
              let timestampDate = 'TBA';
              if (data.createdAt) {
                if (typeof data.createdAt === 'string') {
                  timestampDate = data.createdAt.slice(0, 10);
                } else if (data.createdAt.toDate) {
                  timestampDate = data.createdAt.toDate().toISOString().slice(0, 10);
                }
              }
              salesItems.push({
                id: d.id,
                eventTitle: item.eventTitle,
                ticketType: item.ticketType,
                userId: data.userId || 'Anonymous Buyer',
                status: data.status || 'Confirmed',
                price: data.price || 0,
                commission: data.commission || 0,
                date: timestampDate,
              });
            });
          } catch (err) {
            console.error("Error loading sales for ticket " + item.id, err);
          }
        }
        setAllSales(salesItems);
      } catch (e) {
        console.error('Failed to load tickets', e);
      }
    };
    loadTickets();
  }, [user]);

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
      await updateDoc(doc(db, 'businesses', activeTicket.eventId, 'tickets', activeTicket.id), {
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
      toast({ title: "Updated", description: "Ticket details saved successfully." });
    } catch (e) {
      console.error('Update failed', e);
      toast({ title: "Error", description: "Failed to update ticket.", variant: "destructive" });
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
      const eventRef = await addDoc(collection(db, 'businesses'), {
        organizerId: user.id,
        title: eventTitle,
        description,
        category: "Event",
        tags: [category],
        venue,
        address,
        location,
        startDate: new Date(date).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : new Date(date).toISOString(),
        imageUrl: uploadedImageUrl,
        imagePublicId: uploadedImagePublicId,
        createdAt: serverTimestamp(),
        isActive: true,
      });
      
      await Promise.all(ticketTiers.map(async (tier) => {
        const priceNumber = Number(tier.price) || 0;
        const quantityNumber = Number(tier.quantity) || 0;
        const commission = Number((priceNumber * COMMISSION_RATE).toFixed(2));
        
        return addDoc(collection(db, 'businesses', eventRef.id, 'tickets'), {
          eventId: eventRef.id,
          ticketType: tier.name,
          price: priceNumber,
          quantity: quantityNumber,
          sold: 0,
          available: quantityNumber,
          commission,
          status: 'active',
          createdAt: serverTimestamp(),
        });
      }));

      generateShareableLink(eventRef.id);
      setShareDialogOpen(true);
      setCreateOpen(false);
      
      toast({ title: "Success", description: "Event and ticket created successfully!" });
    } catch (e) {
      console.error('Create failed', e);
      toast({ title: "Error", description: "Failed to create event.", variant: "destructive" });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also remove it from the public listings.")) return;
    try {
      await deleteDoc(doc(db, 'businesses', eventId));
      setListings(prev => prev.filter(t => t.eventId !== eventId));
      toast({ title: "Deleted", description: "Event has been deleted successfully." });
    } catch (e) {
      console.error("Delete failed", e);
      toast({ title: "Error", description: "Failed to delete event.", variant: "destructive" });
    }
  };

  // Dynamic Statistics Calculations
  const totalRevenue = listings.reduce((acc, ticket) => {
    const price = Number(ticket.price.replace(/[^0-9.]/g, '')) || 0;
    return acc + (price * ticket.sold);
  }, 0);

  const totalTicketsSold = listings.reduce((acc, ticket) => acc + ticket.sold, 0);
  const totalCapacity = listings.reduce((acc, ticket) => acc + ticket.quantity, 0);
  const capacityPercent = totalCapacity > 0 ? Math.round((totalTicketsSold / totalCapacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden px-4 md:px-12 py-8 pb-16">
      
      <SEO title="Event Tickets | TourPH" description="Manage your event registrations and listings." />

      {/* Page Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pt-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Analytics Dashboard</h2>
          {/* Theme-compliant Navigation Tabs */}
          <nav className="flex gap-6 mt-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`text-sm font-bold relative pb-1 transition-all ${activeTab === 'overview' ? 'text-primary after:content-[""] after:absolute after:-bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`text-sm font-bold relative pb-1 transition-all ${activeTab === 'revenue' ? 'text-primary after:content-[""] after:absolute after:-bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setActiveTab('attendees')}
              className={`text-sm font-bold relative pb-1 transition-all ${activeTab === 'attendees' ? 'text-primary after:content-[""] after:absolute after:-bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:bg-primary after:rounded-full' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Attendance
            </button>
          </nav>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-card border border-border rounded-full py-2.5 pl-10 pr-4 w-full md:w-64 text-sm text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all" 
              placeholder="Search events..." 
              type="text"
            />
          </div>
          <button 
            onClick={() => setCreateOpen(true)}
            className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-all flex items-center gap-2 shadow-md shadow-primary/20 shrink-0"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Analytics Header Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">TOTAL REVENUE</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">₦{totalRevenue.toLocaleString()}</h3>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
            <ArrowUpRight className="w-4 h-4" />
            <span>Real-time earnings</span>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">TICKETS SOLD</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <QrCode className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">{totalTicketsSold}</h3>
          <div className="w-full bg-muted h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${capacityPercent}%` }}></div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">{capacityPercent}% of total capacity</p>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">TOTAL ATTENDEES</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">{totalTicketsSold}</h3>
          <div className="flex items-center gap-1 text-emerald-500 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>100% check-in rate</span>
          </div>
        </div>

        <div className="bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
          <div className="flex justify-between items-start">
            <span className="text-muted-foreground text-[11px] font-bold uppercase tracking-wider">AVERAGE RATING</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Star className="w-4 h-4 text-primary" />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-foreground">4.8<span className="text-sm text-muted-foreground/60">/5</span></h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4].map(i => <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />)}
            <Star className="w-3.5 h-3.5 text-primary" />
          </div>
        </div>
      </section>

      {/* TABS VIEWPORT */}
      {activeTab === 'overview' && (
        <>
          {/* Sales Trends & Inventory */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fadeIn">
            
            {/* Sales Trends Chart */}
            <div className="lg:col-span-2 bg-card text-card-foreground border border-border rounded-3xl p-8 flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-xl font-bold text-foreground">Sales Trends</h4>
                  <p className="text-muted-foreground text-sm">Revenue growth metrics</p>
                </div>
                <Badge variant="outline" className="border-border px-3 py-1 bg-background text-foreground">Real-time Data</Badge>
              </div>
              
              <div className="relative h-64 w-full bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-border flex items-end px-4 pb-4 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 1000 300">
                  <path d="M0,280 Q50,260 100,270 T200,220 T300,240 T400,150 T500,180 T600,100 T700,120 T800,50 T900,80 T1000,30" fill="none" stroke="currentColor" className="text-primary" strokeLinecap="round" strokeWidth="4"></path>
                  <path d="M0,280 Q50,260 100,270 T200,220 T300,240 T400,150 T500,180 T600,100 T700,120 T800,50 T900,80 T1000,30 L1000,300 L0,300 Z" fill="url(#gradient)" opacity="0.15"></path>
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "var(--primary)", stopOpacity: 1 }}></stop>
                      <stop offset="100%" style={{ stopColor: "var(--primary)", stopOpacity: 0 }}></stop>
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute top-10 left-[70%] bg-primary text-primary-foreground px-3 py-1 rounded-lg text-xs font-black shadow-lg animate-pulse">
                  Peak Velocity
                </div>
              </div>
              <div className="flex justify-between mt-4 text-xs text-muted-foreground/60 px-2 font-semibold">
                <span>Phase 1</span>
                <span>Phase 2</span>
                <span>Phase 3</span>
                <span>Phase 4</span>
              </div>
            </div>

            {/* Ticket Tier Breakdown */}
            <div className="bg-card text-card-foreground border border-border rounded-3xl p-8 flex flex-col justify-between shadow-sm">
              <div>
                <h4 className="text-xl font-bold text-foreground mb-6">Inventory Status</h4>
                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-1">
                  {listings.length > 0 ? (
                    listings.slice(0, 4).map((ticket) => {
                      const priceNum = Number(ticket.price.replace(/[^0-9.]/g, '')) || 0;
                      const sold = ticket.sold;
                      const total = ticket.quantity;
                      const remaining = Math.max(0, total - sold);
                      const percent = total > 0 ? Math.round((sold / total) * 100) : 0;
                      return (
                        <div key={ticket.id} className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-foreground truncate max-w-[150px]">{ticket.ticketType}</span>
                            <span className="text-xs text-muted-foreground max-w-[100px] truncate">{ticket.eventTitle}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-primary font-bold">₦{priceNum.toLocaleString()}</span>
                            <span className="text-muted-foreground">{percent}% sold</span>
                          </div>
                          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                            <div className="bg-primary h-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[11px] text-muted-foreground/60">
                            <span>Sold: {sold}</span>
                            <span>{remaining} remaining</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-muted-foreground/40 text-sm">No ticket configurations setup yet.</div>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setCreateOpen(true)}
                className="w-full mt-6 border border-primary text-primary py-3 rounded-xl font-bold hover:bg-primary/10 transition-all text-sm"
              >
                Add Ticket Class
              </button>
            </div>
          </section>

          {/* Active Events List */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-2xl font-bold text-foreground">My Active Events</h4>
              <div className="flex gap-4">
                <button className="text-muted-foreground flex items-center gap-2 hover:text-foreground text-sm font-semibold transition-all">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const isPlaceholder = ticket.id.startsWith('no-tickets-');
                  return (
                    <div key={ticket.id} className="bg-card text-card-foreground border border-border rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-6 hover:bg-accent/40 transition-all duration-300 group shadow-sm">
                      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-muted/60 flex items-center justify-center border border-border">
                        {ticket.imageUrl ? (
                          <img src={ticket.imageUrl} alt={ticket.eventTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <Calendar className="w-8 h-8 text-muted-foreground/40" />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${ticket.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                            {ticket.status === 'active' ? 'Live' : 'Draft'}
                          </span>
                          <h5 className="font-bold text-foreground text-lg">{ticket.eventTitle}</h5>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                          <MapPin className="w-4 h-4 shrink-0 text-primary" />
                          {ticket.date ? `${ticket.date} • 8:00 PM` : 'TBA'} • {ticket.location || 'TBA'}
                        </p>
                        <div className="flex flex-wrap items-center gap-6 mt-3 text-xs text-muted-foreground">
                          <span>Class: <strong className="text-foreground">{ticket.ticketType}</strong></span>
                          <span>Price: <strong className="text-primary">{ticket.price}</strong></span>
                          <span>Sold: <strong className="text-amber-500">{ticket.sold}</strong></span>
                          <span>Commission: <strong className="text-muted-foreground/80">{ticket.commission}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t border-border md:border-none pt-4 md:pt-0">
                        <button 
                          onClick={() => openSales(ticket)}
                          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <BarChart className="w-4 h-4" />
                          Analytics
                        </button>
                        {!isPlaceholder && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEdit(ticket); }}
                            className="p-2 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteEvent(ticket.eventId); }}
                          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed border-border">
                  <Info className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="text-muted-foreground text-sm">No events found matching your search.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === 'revenue' && (
        <section className="bg-card text-card-foreground border border-border rounded-3xl p-8 mb-12 animate-fadeIn shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-2xl font-bold text-foreground">Event Revenue Ledger</h4>
              <p className="text-muted-foreground text-sm">Detailed financial breakdowns by event and ticket class</p>
            </div>
            <Badge variant="outline" className="border-border px-3 py-1 bg-background text-primary">
              Financial Ledger
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Event Details</th>
                  <th className="py-4 px-4">Ticket Tier Class</th>
                  <th className="py-4 px-4 text-right">Unit Price</th>
                  <th className="py-4 px-4 text-right">Tickets Sold</th>
                  <th className="py-4 px-4 text-right">Gross Revenue</th>
                  <th className="py-4 px-4 text-right">Commission (7%)</th>
                  <th className="py-4 px-4 text-right text-emerald-500">Net Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {listings.length > 0 ? (
                  listings.map((ticket) => {
                    const priceVal = Number(ticket.price.replace(/[^0-9.]/g, '')) || 0;
                    const gross = priceVal * ticket.sold;
                    const commission = gross * COMMISSION_RATE;
                    const net = gross - commission;
                    return (
                      <tr key={ticket.id} className="hover:bg-accent/40 transition-colors">
                        <td className="py-4 px-4 font-bold text-foreground">{ticket.eventTitle}</td>
                        <td className="py-4 px-4 text-muted-foreground">{ticket.ticketType}</td>
                        <td className="py-4 px-4 text-right text-primary font-semibold">₦{priceVal.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-muted-foreground">{ticket.sold}</td>
                        <td className="py-4 px-4 text-right text-foreground font-bold">₦{gross.toLocaleString()}</td>
                        <td className="py-4 px-4 text-right text-muted-foreground/60">₦{commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="py-4 px-4 text-right text-emerald-500 font-extrabold">₦{net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-muted-foreground/40">No active ticket configurations found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'attendees' && (
        <section className="bg-card text-card-foreground border border-border rounded-3xl p-8 mb-12 animate-fadeIn shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-2xl font-bold text-foreground">Registration Directory</h4>
              <p className="text-muted-foreground text-sm">Attendee logs and check-in confirmation records</p>
            </div>
            <Badge variant="outline" className="border-border px-3 py-1 bg-background text-emerald-500">
              {allSales.length} Attendees
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Attendee Account ID</th>
                  <th className="py-4 px-4">Curated Event</th>
                  <th className="py-4 px-4">Ticket Class</th>
                  <th className="py-4 px-4 text-right">Price Paid</th>
                  <th className="py-4 px-4">Registration Status</th>
                  <th className="py-4 px-4 text-right">Transaction Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {allSales.length > 0 ? (
                  allSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-accent/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-foreground flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                          {sale.userId.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[120px]">{sale.userId}</span>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{sale.eventTitle}</td>
                      <td className="py-4 px-4 text-muted-foreground">{sale.ticketType}</td>
                      <td className="py-4 px-4 text-right text-primary font-semibold">₦{Number(sale.price).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                          {sale.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-muted-foreground/60">{sale.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-muted-foreground/40">No registration records logged yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* CREATE EVENT DIALOG */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">Create Curated Event</DialogTitle>
            <DialogDescription className="text-muted-foreground">Setup your elite concierge experience, tickets, and tiers.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Event Title *</Label>
                <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-bold uppercase tracking-wider text-foreground">Ticket Tiers *</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 rounded-lg border-primary text-primary hover:bg-primary/10"
                    onClick={() => setTicketTiers([...ticketTiers, { name: '', price: '', quantity: '' }])}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Tier
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {ticketTiers.map((tier, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3 relative">
                      {ticketTiers.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-red-500"
                          onClick={() => setTicketTiers(ticketTiers.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tier Name (e.g., VIP) *</Label>
                        <Input 
                          className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-lg h-9" 
                          value={tier.name} 
                          placeholder="Regular, VIP, etc."
                          onChange={(e) => {
                            const newTiers = [...ticketTiers];
                            newTiers[index].name = e.target.value;
                            setTicketTiers(newTiers);
                          }} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price (₦) *</Label>
                          <Input 
                            className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-lg h-9" 
                            type="number" 
                            value={tier.price} 
                            placeholder="0"
                            onChange={(e) => {
                              const newTiers = [...ticketTiers];
                              newTiers[index].price = e.target.value;
                              setTicketTiers(newTiers);
                            }} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantity *</Label>
                          <Input 
                            className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-lg h-9" 
                            type="number" 
                            value={tier.quantity} 
                            placeholder="100"
                            onChange={(e) => {
                              const newTiers = [...ticketTiers];
                              newTiers[index].quantity = e.target.value;
                              setTicketTiers(newTiers);
                            }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Time</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Time</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Date *</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Date *</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    {["Music", "Art", "Food", "Technology", "Sports"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" value={venue} onChange={(e) => setVenue(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</Label>
                  <Input className="bg-background border-border text-foreground focus-visible:ring-primary/30 rounded-xl" value={location} onChange={(e) => setLocation(e.target.value)} />
                </div>
              </div>

              <div className="pt-2">
                <ImageUpload
                  onUploadSuccess={(result) => { setUploadedImageUrl(result.secureUrl); setUploadedImagePublicId(result.publicId); }}
                  folder={CLOUDINARY_FOLDERS.EVENTS}
                  currentImage={uploadedImageUrl}
                  buttonText="📤 Upload Event Cover"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" className="px-6 rounded-xl border-border hover:bg-accent text-foreground" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button className="px-8 rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20" onClick={handleCreateTicket} disabled={isCreating}>{isCreating ? 'Creating...' : 'Create Ticket'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* EDIT TICKET DIALOG */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-card border-border text-foreground rounded-2xl shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-foreground">Edit Ticket Settings</DialogTitle></DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ticket Type</Label>
              <Input className="bg-background border-border text-foreground rounded-xl" value={editTicketType} onChange={(e) => setEditTicketType(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price</Label>
                <Input className="bg-background border-border text-foreground rounded-xl" type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                <Input className="bg-background border-border text-foreground rounded-xl" type="number" value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</Label>
                <Select value={editStatus} onValueChange={(val: any) => setEditStatus(val)}>
                  <SelectTrigger className="bg-background border-border text-foreground rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="active">Active (Published)</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1 rounded-xl border-border text-foreground hover:bg-accent" onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button className="flex-1 rounded-xl bg-primary text-primary-foreground font-bold" onClick={saveEdit} disabled={isUpdatingTicket}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SALES / ATTENDEES ANALYTICS DIALOG */}
      <Dialog open={salesOpen} onOpenChange={setSalesOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto bg-card border-border text-foreground rounded-2xl shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-foreground">Analytics & Sales</DialogTitle></DialogHeader>
          {salesLoading ? (
            <div className="py-10 text-center animate-pulse text-muted-foreground">Loading analytics...</div>
          ) : (
            <div className="space-y-3 py-4">
              {sales.length > 0 ? sales.map((s: any) => (
                <div key={s.id} className="p-4 border border-border bg-muted/40 rounded-xl flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold truncate max-w-[150px]">{s.userId}</p>
                      <Badge variant="outline" className="mt-1 text-[9px] uppercase border-emerald-500/20 text-emerald-500">{s.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-bold text-foreground">₦{Number(s.price).toLocaleString()}</p>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mt-1">Comm: ₦{Number(s.commission || 0).toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10 text-muted-foreground/40">No ticket sales yet.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* SHARE EVENT DIALOG */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-card border-border text-foreground rounded-2xl shadow-2xl">
          <DialogHeader><DialogTitle className="text-xl font-bold text-foreground">Share Event Link</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4">
            <div className="p-2 bg-background border border-border rounded-xl flex gap-2">
              <Input className="border-none focus-visible:ring-0 bg-transparent text-foreground" value={shareableLink} readOnly />
              <Button size="icon" className="rounded-lg bg-primary hover:opacity-90 text-primary-foreground" onClick={() => { navigator.clipboard.writeText(shareableLink); toast({ title: "Copied!", description: "Link copied to clipboard." }); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl mx-auto w-max border border-border">
              <QRCode value={shareableLink} size={180} />
            </div>
            <p className="text-center text-sm text-muted-foreground">Scan this QR code or copy the link to share your event.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTicketsPage;
