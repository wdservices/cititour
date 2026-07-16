import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import SEO from "@/components/SEO";
import { uploadImageToCloudinary, CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import ImageUpload from "@/components/ImageUpload";
import { X } from "lucide-react";
import StampIcon from "@/components/StampIcon";
import { logActivity } from "@/lib/activityLog";

const categories = [
  "Restaurant", "Hotel", "Event Venue", "Shopping", "Entertainment", 
  "Attraction", "Spa & Wellness", "Business Services", "Fun", "Lifestyle", "Other"
];

const BusinessListingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [uploadedPublicIds, setUploadedPublicIds] = useState<string[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  const handleSubmit = async () => {
    // Basic validation
    if (!user?.id) {
      toast({ title: "Sign in required", description: "Please sign in to submit a listing.", variant: "destructive" });
      navigate("/auth?force=true");
      return;
    }
    if (!businessName || !category || !phone || !address || !email || !description) {
      toast({ title: "Missing required fields", description: "Please fill all required fields marked with *.", variant: "destructive" });
      return;
    }
    
    if (uploadedImageUrls.length === 0) {
      toast({ title: "Images Required", description: "Please upload at least one business image.", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      const allImageUrls = uploadedImageUrls.slice(0, 10);
      const primaryImageUrl = allImageUrls[0] || "";

      const tags = tagsRaw
        .split(/,|\n|;/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 20);

      const searchKeywords = Array.from(new Set([
        businessName.toLowerCase(),
        category.toLowerCase(),
        ...tags,
      ]));

      const docData = {
        title: businessName,
        description,
        image: primaryImageUrl,
        images: allImageUrls,
        imagePublicIds: uploadedPublicIds,
        category, // keep exact casing used across pages
        rating: 0,
        price: priceRange || "",
        location: address,
        phone,
        website: website || "",
        isOpen: true,
        ownerId: user.id,
        plan: "Basic Listing",
        contactEmail: email,
        hours: hours || "",
        tags,
        searchKeywords,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "businesses"), docData);
      toast({ title: "Listing submitted", description: "Your business has been submitted for review." });
      if (user) {
        logActivity({ userId: user.id, userEmail: user.email, userName: user.name, action: "create_listing", targetType: "business", targetName: businessName, details: "Created business: " + businessName });
      }
      navigate("/explore");
    } catch (err: any) {
      console.error("Submit listing failed:", err);
      toast({ title: "Failed to submit", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="List Your Business | CititourNG"
        description="Submit your business to CititourNG to reach travelers and locals across Nigeria."
        keywords={["list business", "CititourNG", "Nigeria", "submit listing", "discover", "marketing"]}
        canonicalUrl={`${window.location.origin}/business-listing`}
      />
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="px-4 py-8 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-muted mb-4"
            onClick={() => navigate("/explore")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 group">
            <StampIcon icon={Building2} tone="primary" size="md" />
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Business</span>
              <h1 className="font-display text-3xl font-extrabold">Business Listing</h1>
              <p className="text-muted-foreground">List your business on CitiTour</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Business Information Form */}
        <div className="space-y-6">
          <Card className="bg-card border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="font-medium" htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-background border border-border">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="font-medium" htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      placeholder="Enter your business address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="hours">Operating Hours</Label>
                    <Input
                      id="hours"
                      placeholder="e.g., Mon-Fri: 9AM-5PM"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="priceRange">Price Range</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="bg-background border border-border">
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="$">$ - Budget Friendly</SelectItem>
                        <SelectItem value="$$">$$ - Moderate</SelectItem>
                        <SelectItem value="$$$">$$$ - Expensive</SelectItem>
                        <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="email">Contact Email *</Label>
                    <Input
                      id="email"
                      placeholder="contact@yourbusiness.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background border border-border"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Business Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="font-medium" htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your business, services, and what makes it unique..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background border border-border"
              />
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="font-medium" htmlFor="tags">Tags (optional)</Label>
              <div className="space-y-2">
                <Input
                  id="tags"
                  placeholder="e.g., italian, seafood, family-friendly"
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  className="bg-background border border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Add comma-separated tags to help people find your business. Examples: "breakfast", "wifi", "pet-friendly", "cashless".
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-soft">
            <CardHeader>
              <CardTitle>Business Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onUploadSuccess={(result) => {
                  setUploadedImageUrls(prev => [...prev, result.secureUrl]);
                  setUploadedPublicIds(prev => [...prev, result.publicId]);
                }}
                folder={CLOUDINARY_FOLDERS.BUSINESS}
                currentImage={uploadedImageUrls[0]}
                buttonText="📤 Upload Business Photos"
                placeholder="Upload business photos, logo, or menu"
                disabled={isSubmitting}
              />
              
              {uploadedImageUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {uploadedImageUrls.length} image(s) uploaded
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedImageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Business image ${index + 1}`}
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
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              * Required fields. Your listing will be reviewed within 24 hours.
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')}>
                Cancel
              </Button>
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Listing"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessListingPage;