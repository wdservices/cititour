import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Plus, MapPin, Users, Bed, Bath, Star, Heart, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ImageUpload";
import { logActivity } from "@/lib/activityLog";

interface HouseListing {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  type: string;
  price: string;
  pricePerNight?: number;
  rating: number;
  reviews?: number;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  status: string;
  ownerId: string;
}

const mockListings: HouseListing[] = [
  {
    id: "mock-1",
    title: "Luxury Oceanview Penthouse",
    description: "Stunning 3-bedroom penthouse with panoramic ocean views, modern interiors, and private rooftop terrace in Victoria Island.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    images: [],
    type: "Penthouse",
    price: "₦120,000/night",
    pricePerNight: 120000,
    rating: 4.9,
    reviews: 47,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    location: "Victoria Island, Lagos",
    status: "Active",
    ownerId: "mock",
  },
  {
    id: "mock-2",
    title: "Modern Lekki Studio Apartment",
    description: "Sleek and cozy studio apartment in the heart of Lekki Phase 1. Perfect for business travelers and short stays.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    images: [],
    type: "Studio",
    price: "₦45,000/night",
    pricePerNight: 45000,
    rating: 4.6,
    reviews: 82,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    location: "Lekki Phase 1, Lagos",
    status: "Active",
    ownerId: "mock",
  },
  {
    id: "mock-3",
    title: "Ikoyi Villa with Private Pool",
    description: "Exquisite 5-bedroom villa with swimming pool, home cinema, and smart home systems. Ideal for family retreats.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    images: [],
    type: "Villa",
    price: "₦350,000/night",
    pricePerNight: 350000,
    rating: 5.0,
    reviews: 19,
    guests: 10,
    bedrooms: 5,
    bathrooms: 5,
    location: "Ikoyi, Lagos",
    status: "Active",
    ownerId: "mock",
  },
  {
    id: "mock-4",
    title: "Cozy Island Loft",
    description: "A beautifully designed loft space with exposed brick, industrial chic decor, and city skyline views.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    images: [],
    type: "Loft",
    price: "₦65,000/night",
    pricePerNight: 65000,
    rating: 4.7,
    reviews: 34,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    location: "Lekki, Lagos",
    status: "Active",
    ownerId: "mock",
  },
  {
    id: "mock-5",
    title: "Port Harcourt Executive Flat",
    description: "Premium 2-bedroom flat in GRA with 24/7 power, water, and security. Close to business districts.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    images: [],
    type: "Apartment",
    price: "₦55,000/night",
    pricePerNight: 55000,
    rating: 4.5,
    reviews: 61,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    location: "GRA, Port Harcourt",
    status: "Active",
    ownerId: "mock",
  },
  {
    id: "mock-6",
    title: "Waterfront Townhouse",
    description: "Elegant 4-bedroom townhouse on the Lagos lagoon with private dock access and lush gardens.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    images: [],
    type: "Townhouse",
    price: "₦200,000/night",
    pricePerNight: 200000,
    rating: 4.8,
    reviews: 28,
    guests: 8,
    bedrooms: 4,
    bathrooms: 4,
    location: "Banana Island, Lagos",
    status: "Active",
    ownerId: "mock",
  },
];

const propertyTypes = [
  "Apartment", "House", "Villa", "Condo", "Studio", "Loft", "Townhouse"
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "kitchen", label: "Full Kitchen", icon: "🍳" },
  { id: "gym", label: "Gym/Fitness", icon: "💪" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "petfriendly", label: "Pet Friendly", icon: "🐕" },
  { id: "balcony", label: "Balcony/Terrace", icon: "🌿" }
];

const HouseListingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [myListings, setMyListings] = useState<HouseListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state
  const [propertyTitle, setPropertyTitle] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [guests, setGuests] = useState("1");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [pricePerNight, setPricePerNight] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedPublicIds, setUploadedPublicIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user?.id) {
        setMyListings(mockListings);
        setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, "house_listings"), where("ownerId", "==", user.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as HouseListing[];
        setMyListings(data.length > 0 ? data : mockListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
        setMyListings(mockListings);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, [user?.id]);

  const filteredListings = myListings.filter((listing) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      listing.title.toLowerCase().includes(q) ||
      listing.type.toLowerCase().includes(q) ||
      listing.location.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    if (!propertyTitle || !propertyType || !address || !description || !pricePerNight || uploadedImageUrls.length === 0) {
      toast({ title: "Please fill all required fields and upload images", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const docData = {
        title: propertyTitle,
        type: propertyType,
        location: address,
        description,
        guests: parseInt(guests),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        pricePerNight: parseFloat(pricePerNight),
        price: `₦${pricePerNight}/night`,
        amenities: selectedAmenities,
        image: uploadedImageUrls[0],
        images: uploadedImageUrls,
        imagePublicIds: uploadedPublicIds,
        ownerId: user.id,
        status: "Pending",
        rating: 0,
        reviews: 0,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "house_listings"), docData);
      setMyListings(prev => [{ id: docRef.id, ...docData } as HouseListing, ...prev]);
      toast({ title: "Listing submitted successfully!" });
      if (user) {
        logActivity({ userId: user.id, userEmail: user.email, userName: user.name, action: "create_listing", targetType: "property", targetName: propertyTitle, details: "Created property: " + propertyTitle });
      }
      setActiveTab("listings");
      setPropertyTitle("");
      setAddress("");
      setDescription("");
      setUploadedImageUrls([]);
      setUploadedPublicIds([]);
    } catch (err) {
      console.error("Submit listing failed:", err);
      toast({ title: "Failed to submit listing", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4 -ml-2"
            onClick={() => navigate('/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Home className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold">House Listings</h1>
                <p className="text-white/80 mt-1">Find your perfect short-term stay</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg hidden md:flex items-center gap-2"
              onClick={() => setActiveTab("add")}
            >
              <Plus className="h-4 w-4" />
              Add Property
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
              <TabsTrigger value="listings" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Browse Listings
              </TabsTrigger>
              <TabsTrigger value="add" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Add Property
              </TabsTrigger>
            </TabsList>

            {activeTab === "listings" && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-card/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50 focus-within:border-primary/50 transition-all">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search properties..."
                    className="bg-transparent border-none focus:outline-none focus:ring-0 text-foreground text-sm w-48 placeholder:text-muted-foreground/70"
                  />
                </div>
                <div className="flex bg-card border border-border/50 rounded-lg p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition-all ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition-all ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-card/40 rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted/60" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-muted/60 rounded w-3/4" />
                      <div className="h-3 bg-muted/40 rounded w-full" />
                      <div className="h-3 bg-muted/40 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="group bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Home className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <button className="absolute top-3 right-3 p-2 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <div className="absolute top-3 left-3">
                        <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm ${
                          listing.status === "Active"
                            ? "bg-green-500/90 text-white"
                            : "bg-yellow-500/90 text-white"
                        }`}>
                          {listing.status}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-white font-display font-bold text-lg drop-shadow-lg">
                          {listing.price}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-display font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {listing.title}
                        </h3>
                        {listing.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="text-yellow-400 fill-yellow-400 w-3.5 h-3.5" />
                            <span className="font-bold text-foreground text-sm">{listing.rating}</span>
                            <span className="text-muted-foreground text-xs">({listing.reviews})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center text-muted-foreground mb-3">
                        <MapPin className="text-primary w-3.5 h-3.5 mr-1.5 shrink-0" />
                        <span className="text-xs line-clamp-1">{listing.location}</span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/50">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {listing.guests}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5" />
                          {listing.bedrooms} bed{listing.bedrooms > 1 ? "s" : ""}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="w-3.5 h-3.5" />
                          {listing.bathrooms} bath{listing.bathrooms > 1 ? "s" : ""}
                        </span>
                        <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-primary">
                          {listing.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="group bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/5 cursor-pointer flex flex-col md:flex-row"
                  >
                    <div className="md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                      {listing.image ? (
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Home className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      <div className="absolute top-3 left-3">
                        <Badge className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                          listing.status === "Active"
                            ? "bg-green-500 text-white"
                            : "bg-yellow-500 text-white"
                        }`}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                            {listing.title}
                          </h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="text-yellow-400 fill-yellow-400 w-4 h-4" />
                            <span className="font-bold text-foreground">{listing.rating}</span>
                            <span className="text-muted-foreground text-xs">({listing.reviews})</span>
                          </div>
                        </div>
                        <div className="flex items-center text-muted-foreground mb-3">
                          <MapPin className="text-primary w-4 h-4 mr-1.5 shrink-0" />
                          <span className="text-sm">{listing.location}</span>
                        </div>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{listing.description}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <div className="flex items-center gap-5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{listing.guests} guests</span>
                          <span className="flex items-center gap-1.5"><Bed className="w-4 h-4" />{listing.bedrooms} bed</span>
                          <span className="flex items-center gap-1.5"><Bath className="w-4 h-4" />{listing.bathrooms} bath</span>
                        </div>
                        <span className="text-xl font-display font-extrabold text-primary">{listing.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredListings.length === 0 && !loading && (
              <div className="text-center py-20 bg-card/30 rounded-2xl border border-border/50 border-dashed">
                <p className="text-4xl mb-3">🏠</p>
                <p className="text-muted-foreground text-lg">No properties found matching your search.</p>
              </div>
            )}
          </TabsContent>

          {/* Add Property Tab */}
          <TabsContent value="add" className="space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold mb-2">Add New Property</h2>
              <p className="text-muted-foreground">List your property for short-term rentals.</p>
            </div>

            <div className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyTitle">Property Title *</Label>
                      <Input id="propertyTitle" placeholder="Enter property title" />
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase()}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input id="address" placeholder="Enter full address" />
                  </div>
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property, neighborhood, and what makes it special..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="guests">Max Guests *</Label>
                      <Input id="guests" type="number" placeholder="4" />
                    </div>
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Input id="bedrooms" type="number" placeholder="2" />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <Input id="bathrooms" type="number" placeholder="1" />
                    </div>
                    <div>
                      <Label htmlFor="pricePerNight">Price/Night (₦) *</Label>
                      <Input id="pricePerNight" type="number" placeholder="12000" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Images</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUpload
                    onUploadSuccess={(result) => {
                      setUploadedImageUrls(prev => [...prev, result.secureUrl]);
                      setUploadedPublicIds(prev => [...prev, result.publicId]);
                    }}
                    folder={CLOUDINARY_FOLDERS.PROPERTIES}
                    currentImage={uploadedImageUrls[0]}
                    buttonText="📤 Upload Property Photos"
                    placeholder="Upload property photos, rooms, and amenities"
                    disabled={isSubmitting}
                  />
                  {uploadedImageUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">{uploadedImageUrls.length} photo(s) uploaded</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <img src={url} alt={`Property photo ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                              onClick={() => {
                                setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
                                setUploadedPublicIds(prev => prev.filter((_, i) => i !== index));
                              }}
                              disabled={isSubmitting}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Amenities</CardTitle>
                  <CardDescription>Select all amenities available at your property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {amenities.map((amenity) => (
                      <div key={amenity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={() => toggleAmenity(amenity.id)}
                        />
                        <Label htmlFor={amenity.id} className="flex items-center gap-2 cursor-pointer">
                          <span>{amenity.icon}</span>
                          {amenity.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-between pt-6">
                <p className="text-sm text-muted-foreground">
                  Property listings are reviewed within 24 hours.
                </p>
                <div className="space-x-4">
                  <Button variant="outline" className="rounded-xl">Save Draft</Button>
                  <Button className="bg-primary hover:opacity-90 rounded-xl font-bold" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HouseListingsPage;
