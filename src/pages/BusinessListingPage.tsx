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
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const categories = [
  "Restaurant", "Hotel", "Event Venue", "Shopping", "Entertainment", 
  "Attraction", "Spa & Wellness", "Business Services", "Other"
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
    setIsSubmitting(true);
    try {
      // Auto-upload selected images to Cloudinary on submit
      if (imageFiles.length) {
        setIsUploadingImages(true);
        const results: Array<{ secureUrl: string; publicId: string }> = [];
        
        try {
          // Process each image one by one to handle errors individually
          for (let i = 0; i < Math.min(imageFiles.length, 10); i++) {
            const file = imageFiles[i];
            try {
              const result = await uploadImageToCloudinary(file, { 
                folder: "businesses" 
              });
              results.push({
                secureUrl: result.secureUrl,
                publicId: result.publicId
              });
              
              // Update state after each successful upload
              setUploadedImageUrls(prev => [...prev, result.secureUrl]);
              setUploadedPublicIds(prev => [...prev, result.publicId]);
              
            } catch (error) {
              console.error(`Failed to upload image ${i + 1}:`, error);
              // Continue with next image even if one fails
              toast({
                title: `Image ${i + 1} upload failed`,
                description: error instanceof Error ? error.message : 'Failed to upload image',
                variant: 'destructive',
              });
            }
          }
          
          if (results.length === 0) {
            throw new Error('Failed to upload any images. Please try again.');
          }
          
        } catch (error) {
          console.error('Error during image uploads:', error);
          throw error; // Re-throw to be caught by the outer try-catch
          
        } finally {
          setIsUploadingImages(false);
        }
      }
      const allImageUrls = [...uploadedImageUrls].slice(0, 10);
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
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Business Listing</h1>
              <p className="text-white/90">List your business on CititourNG</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-4xl mx-auto">
        {/* Business Information Form */}
        <div className="space-y-6">
          <Card className="bg-white border shadow-sm dark:bg-transparent dark:border-0 dark:shadow-none">
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
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="category">Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="bg-white border border-gray-200 shadow-sm dark:bg-background dark:border-input dark:shadow-none">
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
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://yourwebsite.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
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
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="hours">Operating Hours</Label>
                    <Input
                      id="hours"
                      placeholder="e.g., Mon-Fri: 9AM-5PM"
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                    />
                  </div>

                  <div>
                    <Label className="font-medium" htmlFor="priceRange">Price Range</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger className="bg-white border border-gray-200 shadow-sm dark:bg-background dark:border-input dark:shadow-none">
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
                      className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm dark:bg-transparent dark:border-0 dark:shadow-none">
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
                className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
              />
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm dark:bg-transparent dark:border-0 dark:shadow-none">
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
                  className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                />
                <p className="text-xs text-muted-foreground">
                  Add comma-separated tags to help people find your business. Examples: "breakfast", "wifi", "pet-friendly", "cashless".
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border shadow-sm dark:bg-transparent dark:border-0 dark:shadow-none">
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="font-medium" htmlFor="uploadFiles">Upload Image File(s)</Label>
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
                  className="bg-white border border-gray-200 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:border-primary dark:bg-background dark:border-input dark:shadow-none dark:focus-visible:ring-ring dark:focus-visible:border-input"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isUploadingImages ? "Uploading..." : "Images upload automatically on submit."}
                  </span>
                  {uploadedImageUrls.length > 0 && (
                    <span className="text-xs text-muted-foreground">{uploadedImageUrls.length} image(s) selected</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              * Required fields. Your listing will be reviewed within 24 hours.
            </p>
            <div className="space-x-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90" onClick={handleSubmit} disabled={isSubmitting}>
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