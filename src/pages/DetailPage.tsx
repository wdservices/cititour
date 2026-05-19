import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  ArrowLeft, Star, MapPin, Phone, Globe, MessageCircle, 
  Heart, Share2, Ticket, Loader2, Info, Layers, Clock, PhoneCall,
  MessageSquare, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";

type DetailData = {
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  price?: string;
  location?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  hours?: string;
  hasTickets?: boolean;
  tags?: string[];
  isOpen?: boolean;
};

const DetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract category from path: /others/abc → "others"
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const categorySlug = pathSegments[0] || "";

  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "businesses", id);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const raw = snap.data() as any;
          setData({
            title: raw.title || "Untitled",
            description: raw.description || "No description provided.",
            image: raw.image || "",
            images: raw.images || (raw.image ? [raw.image] : []),
            category: raw.category || categorySlug,
            rating: raw.rating,
            reviews: raw.reviews,
            price: raw.price,
            location: raw.location,
            address: raw.address || raw.location || "Address not provided",
            phone: raw.phone,
            email: raw.email,
            website: raw.website,
            whatsapp: raw.whatsapp || raw.phone,
            latitude: raw.latitude,
            longitude: raw.longitude,
            features: raw.features || raw.tags || [],
            hours: raw.hours || "9:00 AM - 5:00 PM (Mon-Fri)", // default mock hours if none
            hasTickets: raw.hasTickets || false,
            tags: raw.tags,
            isOpen: raw.isOpen !== undefined ? raw.isOpen : true, // default to open for UI demo
          });
        } else {
          setData(null);
        }
      } catch (err) {
        console.error("Error fetching detail:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, categorySlug]);

  const renderValue = (val: any): string => {
    if (val === null || val === undefined) return "";
    if (typeof val === "object") {
      if (val._lat !== undefined && val._long !== undefined) {
        return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
      }
      return JSON.stringify(val);
    }
    return String(val);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center px-4 py-4 max-w-7xl mx-auto w-full">
            <Button variant="ghost" size="icon" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Business not found</h2>
          <p className="text-muted-foreground mb-8 text-lg">This profile may have been removed or doesn't exist.</p>
          <Button onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} size="lg" className="rounded-xl px-8">Go Back</Button>
        </div>
      </div>
    );
  }

  const mainImage = data.images && data.images.length > 0 ? data.images[0] : data.image;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <SEO 
        title={`${renderValue(data.title)} | TourPH`}
        description={renderValue(data.description)}
      />

      {/* Mobile Back Button (Floating over Hero) */}
      <div className="lg:hidden absolute top-4 left-4 z-50">
        <Button variant="secondary" size="icon" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} className="rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border border-white/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
        
        {/* Desktop Back Button */}
        <div className="hidden lg:block mb-6">
          <Button variant="ghost" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} className="gap-2 pl-0 hover:bg-transparent hover:text-primary text-muted-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative sm:rounded-2xl overflow-hidden mb-8 lg:mb-12 shadow-2xl bg-card border border-border/50 sm:border-border">
          {/* Image Container */}
          <div className="relative h-[60vh] sm:h-96 md:h-[450px] w-full bg-muted">
            {mainImage ? (
              <img
                src={renderValue(mainImage)}
                alt={renderValue(data.title)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image available</div>
            )}
            {/* Overlay Gradient for text readability - strictly mimicking the HTML linear-gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/20 to-background/95"></div>
          </div>

          {/* Business Info Over Hero */}
          <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {data.isOpen !== undefined && (
                  <span className={`px-3 sm:px-4 py-1 sm:py-1.5 ${data.isOpen ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'} text-[10px] sm:text-xs font-bold rounded-full uppercase tracking-wider shadow-sm`}>
                    {data.isOpen ? "Open Now" : "Closed"}
                  </span>
                )}
                <span className="px-3 sm:px-4 py-1 sm:py-1.5 bg-card/60 text-foreground text-[10px] sm:text-xs font-bold rounded-full backdrop-blur-md border border-white/10 uppercase tracking-wider">
                  {renderValue(data.category)}
                </span>
              </div>
              
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight mb-2">
                  {renderValue(data.title)}
                </h1>
                <div className="flex items-center text-muted-foreground mt-1 sm:mt-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary shrink-0" />
                  <span className="text-sm sm:text-base lg:text-lg line-clamp-1">{renderValue(data.address)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto mt-4 md:mt-0">
              <Button 
                className="flex-1 md:flex-none h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl gap-2 shadow-[0_0_20px_rgba(192,193,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all"
                onClick={() => {
                  if(data.whatsapp) window.open(`https://wa.me/${renderValue(data.whatsapp).replace(/\D/g, "")}`, '_blank');
                  else if(data.phone) window.open(`tel:${renderValue(data.phone)}`, '_self');
                }}
              >
                <MessageSquare className="w-5 h-5" />
                Message Business
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-bold rounded-xl gap-2 bg-card/40 backdrop-blur-md border-border/50 hover:bg-card/80 active:scale-95 transition-all"
              >
                <FileText className="w-5 h-5" />
                Request Quote
              </Button>
            </div>
          </div>
        </section>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 sm:px-0">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* About Section */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                <Info className="h-5 w-5 text-primary" />
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                {renderValue(data.description)}
              </p>
            </div>

            {/* Features Section */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 sm:p-8 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
                <Layers className="h-5 w-5 text-primary" />
                Features & Tags
              </h2>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {data.features && data.features.length > 0 ? (
                  data.features.map((feature, index) => (
                    <span 
                      key={index} 
                      className={`px-4 py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-default ${
                        index === 0 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-card/80 text-muted-foreground border border-border/50 hover:border-border'
                      }`}
                    >
                      {renderValue(feature)}
                    </span>
                  ))
                ) : (
                  <span className="text-muted-foreground italic">No features listed.</span>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-6">
            
            {/* Operating Hours */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-primary" />
                Hours
              </h2>
              
              <div className="space-y-0 text-sm sm:text-base">
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Mon - Fri</span>
                  <span className="text-foreground font-medium">{renderValue(data.hours)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-border/50">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="text-muted-foreground italic">Closed</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="text-muted-foreground italic">Closed</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-foreground">
                <PhoneCall className="h-5 w-5 text-primary" />
                Contact Information
              </h2>
              
              {data.phone ? (
                <a 
                  href={`tel:${renderValue(data.phone)}`} 
                  className="flex items-center p-4 bg-card/80 rounded-xl border border-border/50 hover:bg-card hover:border-primary/30 transition-all group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Phone</p>
                    <p className="text-foreground font-bold text-lg">{renderValue(data.phone)}</p>
                  </div>
                </a>
              ) : (
                 <p className="text-muted-foreground italic">Phone number not available.</p>
              )}

              {/* Added Website if available to match the aesthetic pattern */}
              {data.website && (
                 <a 
                  href={renderValue(data.website)} 
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center p-4 bg-card/80 rounded-xl border border-border/50 hover:bg-card hover:border-primary/30 transition-all group shadow-sm mt-3"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">Website</p>
                    <p className="text-foreground font-bold text-base truncate">{renderValue(data.website)}</p>
                  </div>
                </a>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailPage;