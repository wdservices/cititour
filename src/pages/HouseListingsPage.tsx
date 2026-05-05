import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home, Plus, MapPin, Users, Bed, Bath, Wifi, Car, Star, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";

const propertyTypes = [
  "Apartment", "House", "Villa", "Condo", "Studio", "Loft", "Townhouse"
];

const amenities = [
  { id: "wifi", label: "WiFi", icon: Wifi },
  { id: "parking", label: "Parking", icon: Car },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "kitchen", label: "Full Kitchen", icon: "🍳" },
  { id: "gym", label: "Gym/Fitness", icon: "💪" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "petfriendly", label: "Pet Friendly", icon: "🐕" },
  { id: "balcony", label: "Balcony/Terrace", icon: "🌿" }
];

const myListings = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    type: "Apartment",
    price: "$120/night",
    rating: 4.9,
    reviews: 127,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    location: "Downtown Garden City",
    status: "Active",
    bookings: 15
  },
  {
    id: "2", 
    title: "Cozy Garden Villa",
    type: "Villa",
    price: "$250/night",
    rating: 4.8,
    reviews: 89,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    location: "Garden City Suburbs",
    status: "Active",
    bookings: 8
  }
];

const HouseListingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("listings");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedPublicIds, setUploadedPublicIds] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (imageFiles.length) {
        setIsUploadingImages(true);
        const results: Array<{ secureUrl: string; publicId: string }> = [];
        for (const file of imageFiles.slice(0, 10)) {
          const { secureUrl, publicId } = await uploadImageToCloudinary(file, { folder: "house_listings" });
          results.push({ secureUrl, publicId });
        }
        setUploadedImageUrls((prev) => [...prev, ...results.map((r) => r.secureUrl)]);
        setUploadedPublicIds((prev) => [...prev, ...results.map((r) => r.publicId)]);
        setIsUploadingImages(false);
        toast({ title: "Images uploaded", description: `${results.length} image(s) uploaded successfully.` });
      }
      // TODO: Wire up actual property submission (e.g., Firestore) here.
      console.log("House listing submitted with images:", uploadedImageUrls);
    } catch (err) {
      console.error("Submit listing failed:", err);
      toast({ title: "Upload failed", description: `${(err as Error)?.message || "Unable to upload images."}` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-8">
        <div className="px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate(-1)}
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="listings">My Listings</TabsTrigger>
            <TabsTrigger value="add">Add Property</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
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
                    <div className="md:w-1/3 h-48 md:h-auto bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
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
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {listing.bookings} bookings this month
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
                List your property for short-term rentals. Earn 85% of booking fees.
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
                  <Label htmlFor="uploadFiles">Upload Image File(s)</Label>
                  <div className="space-y-2 mb-4">
                    <Input
                      id="uploadFiles"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        setImageFiles(files as File[]);
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {isUploadingImages ? "Uploading..." : "Images upload automatically on submit."}
                      </span>
                      {uploadedImageUrls.length > 0 && (
                        <span className="text-xs text-muted-foreground">{uploadedImageUrls.length} image(s) selected</span>
                      )}
                    </div>
                    {uploadedImageUrls.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {uploadedImageUrls.map((url) => (
                          <img key={url} src={url} alt="Uploaded" className="w-full h-24 object-cover rounded" />
                        ))}
                      </div>
                    )}
                  </div>
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
                  <Button className="bg-gradient-primary hover:opacity-90" onClick={handleSubmit} disabled={isSubmitting || isUploadingImages}>
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">$3,420</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">4.8</p>
                  <p className="text-sm text-muted-foreground">Avg Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-sm text-muted-foreground">Occupancy</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((booking) => (
                    <div key={booking} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Modern Downtown Apartment</p>
                        <p className="text-sm text-muted-foreground">
                          Guest: John Doe • Check-in: Dec 25, 2024 • 3 nights
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-1">Confirmed</Badge>
                        <p className="font-semibold">$360</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HouseListingsPage;