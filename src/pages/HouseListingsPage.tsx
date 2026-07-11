import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Plus, MapPin, Users, Bed, Bath, Wifi, Car, Star } from "lucide-react";
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
      if (!user?.id) return;
      try {
        const q = query(collection(db, "house_listings"), where("ownerId", "==", user.id));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as HouseListing[];
        setMyListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyListings();
  }, [user?.id]);

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
        price: `$${pricePerNight}/night`,
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
      setActiveTab("listings");
      // Reset form
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
      <div className="bg-gradient-primary text-white py-8">
        <div className="px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate('/explore')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">House Listings</h1>
                <p className="text-white/90">Manage your property rentals</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="hidden md:flex items-center gap-2"
              onClick={() => setActiveTab("add")}
            >
              <Plus className="h-4 w-4" />
              Add New Property
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="add">Add Property</TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Properties ({myListings.length})</h2>
              <Button className="md:hidden" onClick={() => setActiveTab("add")}>
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="space-y-4">
              {myListings.map((listing) => (
                <Card key={listing.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <Home className="h-16 w-16 text-primary opacity-50" />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-muted-foreground">{listing.type} • {listing.location}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {listing.guests} guests
                            </span>
                            <span className="flex items-center gap-1">
                              <Bed className="h-4 w-4" />
                              {listing.bedrooms} bedrooms
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="h-4 w-4" />
                              {listing.bathrooms} baths
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={listing.status === "Active" ? "bg-green-500" : "bg-yellow-500"}>
                            {listing.status}
                          </Badge>
                          <p className="text-lg font-bold text-primary mt-1">{listing.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {listing.rating} ({listing.reviews} reviews)
                          </span>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View</Button>
                          <Button size="sm">Manage</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Add Property Tab */}
          <TabsContent value="add" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
              <p className="text-muted-foreground mb-6">
                List your property for short-term rentals.
              </p>
            </div>

            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
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

              {/* Property Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
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
                      <Label htmlFor="pricePerNight">Price/Night *</Label>
                      <Input id="pricePerNight" type="number" placeholder="120" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
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
                      <p className="text-sm text-muted-foreground mb-2">
                        {uploadedImageUrls.length} photo(s) uploaded
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {uploadedImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                              <img
                                src={url}
                                alt={`Property photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
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

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
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
                          <span>{typeof amenity.icon === 'string' ? amenity.icon : null}</span>
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
                  <Button variant="outline">Save Draft</Button>
                  <Button className="bg-gradient-primary hover:opacity-90" onClick={handleSubmit} disabled={isSubmitting}>
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