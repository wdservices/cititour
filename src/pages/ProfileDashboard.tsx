import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, Building2, ShoppingBag, Home, Calendar, Megaphone,
  Plus, LayoutDashboard, MapPin, Trash2, Edit3, Ticket, Store,
  ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, getDocs, getDoc, query, where, addDoc, deleteDoc, updateDoc, doc, serverTimestamp } from "firebase/firestore";
import ImageUpload from "@/components/ImageUpload";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { getMockImage } from "@/lib/mockImages";
import {
  NIGERIAN_STATES, STATE_CITIES, BUSINESS_CATEGORIES,
  PROPERTY_TYPES, EVENT_CATEGORIES, type NigerianState,
} from "@/lib/nigerianStates";

interface ListingItem {
  id: string;
  title: string;
  image: string;
  category?: string;
  type?: string;
  location?: string;
  price?: string;
  status?: string;
}

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const initialTab = searchParams.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [listingsTab, setListingsTab] = useState<"businesses" | "products" | "properties">("businesses");

  // Wizard state
  const [createOpen, setCreateOpen] = useState(searchParams.get("action") === "create");
  const [wizardStep, setWizardStep] = useState(1);
  const [listingType, setListingType] = useState<"business" | "product" | "property" | "event" | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Delete confirmation ──
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string; title: string } | null>(null);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0); // 0=closed, 1=first confirm, 2=second confirm
  const [deleting, setDeleting] = useState(false);

  // ── Edit mode ──
  const [editTarget, setEditTarget] = useState<{ id: string; type: string; data: any } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  // ── Edit form fields ──
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editState, setEditState] = useState<NigerianState | "">("");
  const [editCity, setEditCity] = useState("");
  const [editStreetAddress, setEditStreetAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editImagePublicId, setEditImagePublicId] = useState("");

  // ── Shared form fields ──
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedState, setSelectedState] = useState<NigerianState | "">("");
  const [selectedCity, setSelectedCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState("");

  // ── Business-specific ──
  const [bizCategory, setBizCategory] = useState("");

  // ── Product-specific ──
  const [listAsBizId, setListAsBizId] = useState("individual");
  const [productPrice, setProductPrice] = useState("");
  const [promoPrice, setPromoPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");

  // ── Property-specific ──
  const [propListAsBizId, setPropListAsBizId] = useState("individual");
  const [propertyType, setPropertyType] = useState("");
  const [propertyPrice, setPropertyPrice] = useState("");

  // ── Event-specific ──
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventStartTime, setEventStartTime] = useState("");
  const [eventEndTime, setEventEndTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [ticketTypes, setTicketTypes] = useState<{ name: string; price: string; quantity: string }[]>([
    { name: "Regular", price: "0", quantity: "100" },
  ]);

  // ── User's businesses (for product/property linking) ──
  const [myBusinesses, setMyBusinesses] = useState<ListingItem[]>([]);
  const [myProducts, setMyProducts] = useState<ListingItem[]>([]);
  const [myProperties, setMyProperties] = useState<ListingItem[]>([]);
  const [myEvents, setMyEvents] = useState<ListingItem[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  // ── Inherited state from selected business ──
  const selectedBiz = myBusinesses.find((b) => b.id === listAsBizId);
  const selectedPropBiz = myBusinesses.find((b) => b.id === propListAsBizId);
  const inheritState = selectedBiz?.location?.split(", ").pop() || "";
  const inheritPropState = selectedPropBiz?.location?.split(", ").pop() || "";

  useEffect(() => {
    if (!user?.id) return;
    const loadListings = async () => {
      setLoadingListings(true);
      try {
        const bizSnap = await getDocs(query(collection(db, "businesses"), where("ownerId", "==", user.id)));
        const businesses = bizSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        setMyBusinesses(businesses.filter((b: any) => b.category !== "Event" && b.category !== "Events"));
        setMyEvents(businesses.filter((b: any) => b.category === "Event" || b.category === "Events"));

        const prodSnap = await getDocs(query(collection(db, "marketplace"), where("ownerId", "==", user.id)));
        setMyProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));

        const propSnap = await getDocs(query(collection(db, "house_listings"), where("ownerId", "==", user.id)));
        setMyProperties(propSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
      } catch (err) {
        console.error("Error loading listings:", err);
      } finally {
        setLoadingListings(false);
      }
    };
    loadListings();
  }, [user?.id]);

  const resetWizard = () => {
    setCreateOpen(false);
    setWizardStep(1);
    setListingType("");
    setTitle("");
    setDescription("");
    setSelectedState("");
    setSelectedCity("");
    setStreetAddress("");
    setPhone("");
    setUploadedImageUrl("");
    setUploadedImagePublicId("");
    setBizCategory("");
    setListAsBizId("individual");
    setProductPrice("");
    setPromoPrice("");
    setProductCategory("");
    setPropListAsBizId("individual");
    setPropertyType("");
    setPropertyPrice("");
    setEventStartDate("");
    setEventEndDate("");
    setEventStartTime("");
    setEventEndTime("");
    setEventVenue("");
    setEventLocation("");
    setEventCategory("");
    setTicketTypes([{ name: "Regular", price: "0", quantity: "100" }]);
  };

  const resolveState = (override?: string): string => {
    if (override) return override;
    return selectedState;
  };

  // ── CREATE HANDLERS ──

  const handleCreateBusiness = async () => {
    if (!user?.id) { navigate("/auth"); return; }
    if (!title || !selectedState || !bizCategory) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const fullLocation = [selectedCity, selectedState].filter(Boolean).join(", ");
      await addDoc(collection(db, "businesses"), {
        title,
        description,
        category: bizCategory,
        location: fullLocation,
        state: selectedState,
        city: selectedCity,
        streetAddress,
        phone,
        image: uploadedImageUrl || getMockImage(bizCategory),
        ownerId: user.id,
        isOpen: true,
        rating: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Business registered!" });
      resetWizard();
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to create business", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!user?.id) { navigate("/auth"); return; }
    if (!title) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const isLinkedToBiz = listAsBizId !== "individual" && selectedBiz;
      const bizState = isLinkedToBiz ? selectedBiz.location?.split(", ").pop() : "";
      const state = isLinkedToBiz ? bizState : selectedState;
      const city = isLinkedToBiz ? selectedBiz.location?.split(", ").shift() : selectedCity;
      const fullLocation = [city, state].filter(Boolean).join(", ");

      await addDoc(collection(db, "marketplace"), {
        title,
        description,
        category: productCategory || "Other",
        price: productPrice ? `₦${productPrice}` : "",
        promoPrice: promoPrice ? `₦${promoPrice}` : "",
        regularPrice: productPrice,
        location: fullLocation,
        state,
        city,
        businessId: listAsBizId === "individual" ? null : listAsBizId,
        sellerType: listAsBizId === "individual" ? "individual" : "business",
        image: uploadedImageUrl || getMockImage(productCategory),
        ownerId: user.id,
        condition: "new",
        createdAt: serverTimestamp(),
      });
      toast({ title: "Product listed!" });
      resetWizard();
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to list product", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateProperty = async () => {
    if (!user?.id) { navigate("/auth"); return; }
    if (!title || !propertyType) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const isLinkedToBiz = propListAsBizId !== "individual" && selectedPropBiz;
      const bizState = isLinkedToBiz ? selectedPropBiz.location?.split(", ").pop() : "";
      const state = isLinkedToBiz ? bizState : selectedState;
      const city = isLinkedToBiz ? selectedPropBiz.location?.split(", ").shift() : selectedCity;
      const fullLocation = [city, state].filter(Boolean).join(", ");

      await addDoc(collection(db, "house_listings"), {
        title,
        description,
        type: propertyType,
        pricePerNight: parseFloat(propertyPrice) || 0,
        price: propertyPrice ? `₦${propertyPrice}/night` : "",
        location: fullLocation,
        state,
        city,
        businessId: propListAsBizId === "individual" ? null : propListAsBizId,
        sellerType: propListAsBizId === "individual" ? "individual" : "business",
        image: uploadedImageUrl || getMockImage("Airbnb"),
        ownerId: user.id,
        guests: 1,
        bedrooms: 1,
        bathrooms: 1,
        status: "Pending",
        rating: 0,
        reviews: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Property listed!" });
      resetWizard();
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to list property", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEvent = async () => {
    if (!user?.id) { navigate("/auth"); return; }
    if (!title || !selectedState || !eventStartDate) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    try {
      const fullLocation = [eventVenue, eventLocation, selectedCity, selectedState].filter(Boolean).join(", ");
      const validTickets = ticketTypes.filter((t) => t.name.trim());
      await addDoc(collection(db, "businesses"), {
        title,
        description,
        category: "Event",
        tags: [eventCategory || "General"],
        location: fullLocation,
        state: selectedState,
        city: selectedCity,
        venue: eventVenue,
        eventLocation,
        startDate: eventStartDate,
        endDate: eventEndDate || eventStartDate,
        startTime: eventStartTime,
        endTime: eventEndTime,
        ticketTypes: validTickets,
        image: uploadedImageUrl || getMockImage("Event"),
        ownerId: user.id,
        isActive: true,
        rating: 0,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Event created!" });
      resetWizard();
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to create event", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const reloadListings = async () => {
    if (!user?.id) return;
    const bizSnap = await getDocs(query(collection(db, "businesses"), where("ownerId", "==", user.id)));
    const businesses = bizSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    setMyBusinesses(businesses.filter((b: any) => b.category !== "Event" && b.category !== "Events"));
    setMyEvents(businesses.filter((b: any) => b.category === "Event" || b.category === "Events"));
    const prodSnap = await getDocs(query(collection(db, "marketplace"), where("ownerId", "==", user.id)));
    setMyProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
    const propSnap = await getDocs(query(collection(db, "house_listings"), where("ownerId", "==", user.id)));
    setMyProperties(propSnap.docs.map(d => ({ id: d.id, ...d.data() } as any)));
  };

  const getCollectionForType = (type: string) => {
    switch (type) {
      case "business": return "businesses";
      case "event": return "businesses";
      case "product": return "marketplace";
      case "property": return "house_listings";
      default: return "businesses";
    }
  };

  const handleDeleteClick = (id: string, type: string, title: string) => {
    setDeleteTarget({ id, type, title });
    setDeleteStep(1);
  };

  const confirmDeleteStep1 = () => {
    setDeleteStep(2);
  };

  const confirmDeleteStep2 = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const collectionName = getCollectionForType(deleteTarget.type);
      await deleteDoc(doc(db, collectionName, deleteTarget.id));
      toast({ title: `"${deleteTarget.title}" deleted.` });
      setDeleteTarget(null);
      setDeleteStep(0);
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to delete listing", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
    setDeleteStep(0);
  };

  const handleEditClick = async (item: ListingItem, type: string) => {
    const collectionName = getCollectionForType(type);
    try {
      const snap = await getDoc(doc(db, collectionName, item.id));
      if (!snap.exists()) {
        toast({ title: "Listing not found", variant: "destructive" });
        return;
      }
      const raw = snap.data() as any;
      setEditTarget({ id: item.id, type, data: raw });
      setEditTitle(raw.title || "");
      setEditDescription(raw.description || "");
      setEditCategory(raw.category || "");
      setEditState((raw.state as NigerianState) || "");
      setEditCity(raw.city || "");
      setEditStreetAddress(raw.streetAddress || "");
      setEditPhone(raw.phone || "");
      setEditImageUrl(raw.image || "");
      setEditImagePublicId(raw.imagePublicId || "");
      setEditOpen(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load listing", variant: "destructive" });
    }
  };

  const handleUpdateListing = async () => {
    if (!editTarget || !editTitle.trim()) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }
    setEditSaving(true);
    try {
      const collectionName = getCollectionForType(editTarget.type);
      const fullLocation = [editCity, editState].filter(Boolean).join(", ");
      const updateData: any = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        category: editCategory,
        state: editState,
        city: editCity,
        streetAddress: editStreetAddress.trim(),
        phone: editPhone.trim(),
        image: editImageUrl,
        location: fullLocation,
      };
      await updateDoc(doc(db, collectionName, editTarget.id), updateData);
      toast({ title: "Listing updated!" });
      setEditOpen(false);
      setEditTarget(null);
      reloadListings();
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to update listing", variant: "destructive" });
    } finally {
      setEditSaving(false);
    }
  };

  // ── WIZARD FORMS ──

  const renderBusinessForm = () => (
    <div className="space-y-4 py-2">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Business Name *</Label>
        <Input className="mt-1.5" placeholder="e.g. Glokakes Bakehouse" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category *</Label>
        <Select value={bizCategory} onValueChange={setBizCategory}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {BUSINESS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State *</Label>
        <Select value={selectedState} onValueChange={(v) => { setSelectedState(v as NigerianState); setSelectedCity(""); }}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
          <SelectContent>
            {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      {selectedState && (
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City / Area</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select area" /></SelectTrigger>
            <SelectContent>
              {(STATE_CITIES[selectedState] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Street Address</Label>
        <Input className="mt-1.5" placeholder="e.g. 15 Admiralty Way, Lekki Phase 1" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number *</Label>
        <Input className="mt-1.5" placeholder="+234 801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About / Description *</Label>
        <Textarea className="mt-1.5" placeholder="Tell people about your business..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
        <ImageUpload
          onUploadSuccess={(r) => { setUploadedImageUrl(r.secureUrl); setUploadedImagePublicId(r.publicId); }}
          folder={CLOUDINARY_FOLDERS.BUSINESSES}
          currentImage={uploadedImageUrl}
          buttonText="Upload Cover"
        />
      </div>
    </div>
  );

  const renderProductForm = () => (
    <div className="space-y-4 py-2">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">List as *</Label>
        <Select value={listAsBizId} onValueChange={setListAsBizId}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select business or list individually" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual Seller</SelectItem>
            {myBusinesses.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {listAsBizId !== "individual" && inheritState && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs text-primary font-medium">
          Location inherited from {selectedBiz?.title}: {selectedBiz?.location}
        </div>
      )}

      {listAsBizId === "individual" && (
        <>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State *</Label>
            <Select value={selectedState} onValueChange={(v) => { setSelectedState(v as NigerianState); setSelectedCity(""); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {selectedState && (
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City / Area</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {(STATE_CITIES[selectedState] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product / Service Title *</Label>
        <Input className="mt-1.5" placeholder="e.g. Brand New iPhone 15 Pro" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
        <Select value={productCategory} onValueChange={setProductCategory}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
          <SelectContent>
            {["Electronics", "Fashion", "Home", "Vehicles", "Property", "Beauty", "Sports", "Other"].map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Regular Price (₦) *</Label>
          <Input className="mt-1.5" placeholder="e.g. 150000" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
        </div>
        <div>
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Promo Price (₦) <span className="text-muted-foreground/60 normal-case">(optional)</span></Label>
          <Input className="mt-1.5" placeholder="e.g. 120000" value={promoPrice} onChange={(e) => setPromoPrice(e.target.value)} />
        </div>
      </div>
      {promoPrice && productPrice && (
        <p className="text-xs text-muted-foreground">
          UI will show: <span className="line-through text-destructive">₦{productPrice}</span> <span className="font-bold text-primary">₦{promoPrice}</span>
        </p>
      )}
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description *</Label>
        <Textarea className="mt-1.5" placeholder="Describe your product..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
        <ImageUpload
          onUploadSuccess={(r) => { setUploadedImageUrl(r.secureUrl); setUploadedImagePublicId(r.publicId); }}
          folder={CLOUDINARY_FOLDERS.MARKETPLACE}
          currentImage={uploadedImageUrl}
          buttonText="Upload Image"
        />
      </div>
    </div>
  );

  const renderPropertyForm = () => (
    <div className="space-y-4 py-2">
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">List as *</Label>
        <Select value={propListAsBizId} onValueChange={setPropListAsBizId}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select business or list individually" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual Seller</SelectItem>
            {myBusinesses.map((b) => (
              <SelectItem key={b.id} value={b.id}>{b.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {propListAsBizId !== "individual" && inheritPropState && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2 text-xs text-primary font-medium">
          Location inherited from {selectedPropBiz?.title}: {selectedPropBiz?.location}
        </div>
      )}

      {propListAsBizId === "individual" && (
        <>
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State *</Label>
            <Select value={selectedState} onValueChange={(v) => { setSelectedState(v as NigerianState); setSelectedCity(""); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {selectedState && (
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City / Area</Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {(STATE_CITIES[selectedState] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property Title *</Label>
        <Input className="mt-1.5" placeholder="e.g. Modern 2-Bedroom in GRA" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property Type *</Label>
        <Select value={propertyType} onValueChange={setPropertyType}>
          <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
          <SelectContent>
            {PROPERTY_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (₦) *</Label>
        <Input className="mt-1.5" placeholder="e.g. 50000" value={propertyPrice} onChange={(e) => setPropertyPrice(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description *</Label>
        <Textarea className="mt-1.5" placeholder="Describe your property..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
        <ImageUpload
          onUploadSuccess={(r) => { setUploadedImageUrl(r.secureUrl); setUploadedImagePublicId(r.publicId); }}
          folder={CLOUDINARY_FOLDERS.BUSINESSES}
          currentImage={uploadedImageUrl}
          buttonText="Upload Image"
        />
      </div>
    </div>
  );

  const renderEventForm = () => (
    <div className="py-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ── Left Column: Title, Ticket Tiers, Times ── */}
        <div className="space-y-4">
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Event Title *</Label>
            <Input className="mt-1.5" placeholder="e.g. Lagos Food & Wine Festival" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Ticket Tiers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ticket Tiers *</Label>
              <button
                onClick={() => setTicketTypes([...ticketTypes, { name: "", price: "0", quantity: "100" }])}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Tier
              </button>
            </div>
            <div className="space-y-3">
              {ticketTypes.map((ticket, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-3 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tier {i + 1}</span>
                    {ticketTypes.length > 1 && (
                      <button
                        onClick={() => setTicketTypes(ticketTypes.filter((_, j) => j !== i))}
                        className="text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tier Name (e.g., VIP) *</Label>
                    <Input
                      className="mt-1"
                      placeholder="Regular, VIP, etc."
                      value={ticket.name}
                      onChange={(e) => {
                        const updated = [...ticketTypes];
                        updated[i].name = e.target.value;
                        setTicketTypes(updated);
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Price (₦) *</Label>
                      <Input
                        className="mt-1"
                        placeholder="0"
                        type="number"
                        value={ticket.price}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i].price = e.target.value;
                          setTicketTypes(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quantity *</Label>
                      <Input
                        className="mt-1"
                        placeholder="100"
                        type="number"
                        value={ticket.quantity}
                        onChange={(e) => {
                          const updated = [...ticketTypes];
                          updated[i].quantity = e.target.value;
                          setTicketTypes(updated);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Start & End Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Time</Label>
              <Input className="mt-1.5" type="time" value={eventStartTime} onChange={(e) => setEventStartTime(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Time</Label>
              <Input className="mt-1.5" type="time" value={eventEndTime} onChange={(e) => setEventEndTime(e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Right Column: Dates, Category, Venue, Location, Image ── */}
        <div className="space-y-4">
          {/* Start & End Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Start Date *</Label>
              <Input className="mt-1.5" type="date" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">End Date *</Label>
              <Input className="mt-1.5" type="date" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
            <Select value={eventCategory} onValueChange={setEventCategory}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Venue</Label>
              <Input className="mt-1.5" placeholder="e.g. Eko Atlantic" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Location</Label>
              <Input className="mt-1.5" placeholder="e.g. Victoria Island, Lagos" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State *</Label>
            <Select value={selectedState} onValueChange={(v) => { setSelectedState(v as NigerianState); setSelectedCity(""); }}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Event Banner</Label>
            <ImageUpload
              onUploadSuccess={(r) => { setUploadedImageUrl(r.secureUrl); setUploadedImagePublicId(r.publicId); }}
              folder={CLOUDINARY_FOLDERS.BUSINESSES}
              currentImage={uploadedImageUrl}
              buttonText="Upload Event Cover"
            />
          </div>
        </div>
      </div>

      {/* Description (full width below columns) */}
      <div className="mt-4">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description *</Label>
        <Textarea className="mt-1.5" placeholder="Describe your event..." rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
    </div>
  );

  const getSubmitHandler = () => {
    switch (listingType) {
      case "business": return handleCreateBusiness;
      case "product": return handleCreateProduct;
      case "property": return handleCreateProperty;
      case "event": return handleCreateEvent;
      default: return () => {};
    }
  };

  const ListingCard = ({ item, type }: { item: ListingItem; type: string }) => (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-md group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image || getMockImage(item.category || item.type)}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.status && (
          <Badge className={`absolute top-3 left-3 text-[9px] font-bold uppercase tracking-wider ${
            item.status === "Active" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
          }`}>
            {item.status}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-sm text-foreground truncate mb-1">{item.title}</h3>
        {item.location && (
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          {item.price && <span className="font-bold text-sm text-primary">{item.price}</span>}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => handleEditClick(item, type)}
              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteClick(item.id, type, item.title)}
              className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-primary/80 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" className="text-white hover:bg-white/20 mb-4 -ml-2" onClick={() => navigate("/explore")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-extrabold">My Dashboard</h1>
                <p className="text-white/80 mt-1">Manage your listings and activity</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 font-bold shadow-lg flex items-center gap-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> Create New
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-card border border-border/50 p-1 rounded-xl mb-8 w-fit">
            <TabsTrigger value="overview" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4">Overview</TabsTrigger>
            <TabsTrigger value="listings" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4">My Listings</TabsTrigger>
            <TabsTrigger value="events" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4">My Events</TabsTrigger>
            <TabsTrigger value="ads" className="rounded-lg font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4">Ad Manager</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Building2, label: "Businesses", count: myBusinesses.length, color: "primary" },
                { icon: ShoppingBag, label: "Products", count: myProducts.length, color: "accent" },
                { icon: Home, label: "Properties", count: myProperties.length, color: "success" },
                { icon: Calendar, label: "Events", count: myEvents.length, color: "primary" },
              ].map((stat) => (
                <Card key={stat.label} className="border-border/50">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-${stat.color}/10 flex items-center justify-center`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                    </div>
                    <p className="text-2xl font-extrabold">{stat.count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/50">
              <CardContent className="p-5">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Building2, label: "Register Business", type: "business" },
                    { icon: ShoppingBag, label: "Post Product", type: "product" },
                    { icon: Home, label: "List Property", type: "property" },
                    { icon: Calendar, label: "Create Event", type: "event" },
                  ].map((action) => (
                    <button
                      key={action.type}
                      onClick={() => { setListingType(action.type as any); setWizardStep(2); setCreateOpen(true); }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <action.icon className="w-6 h-6 text-primary" />
                      <span className="text-xs font-bold text-muted-foreground">{action.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Listings */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex items-center justify-between">
              <Tabs value={listingsTab} onValueChange={(v) => setListingsTab(v as any)} className="w-fit">
                <TabsList className="bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger value="businesses" className="rounded-md text-xs font-semibold px-3">Businesses ({myBusinesses.length})</TabsTrigger>
                  <TabsTrigger value="products" className="rounded-md text-xs font-semibold px-3">Products ({myProducts.length})</TabsTrigger>
                  <TabsTrigger value="properties" className="rounded-md text-xs font-semibold px-3">Properties ({myProperties.length})</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button size="sm" className="rounded-xl font-bold" onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Create New
              </Button>
            </div>
            {loadingListings ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-muted/60" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted/60 rounded w-3/4" />
                      <div className="h-3 bg-muted/40 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listingsTab === "businesses" && myBusinesses.map(item => <ListingCard key={item.id} item={item} type="business" />)}
                {listingsTab === "products" && myProducts.map(item => <ListingCard key={item.id} item={item} type="product" />)}
                {listingsTab === "properties" && myProperties.map(item => <ListingCard key={item.id} item={item} type="property" />)}
                {((listingsTab === "businesses" && myBusinesses.length === 0) ||
                  (listingsTab === "products" && myProducts.length === 0) ||
                  (listingsTab === "properties" && myProperties.length === 0)) && (
                  <div className="col-span-full text-center py-16 bg-card/30 rounded-2xl border border-dashed border-border">
                    <p className="text-muted-foreground mb-3">No {listingsTab} yet</p>
                    <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)}>
                      <Plus className="w-4 h-4 mr-1" /> Create Your First
                    </Button>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* My Events */}
          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">My Events ({myEvents.length})</h3>
              <Button size="sm" className="rounded-xl font-bold" onClick={() => { setListingType("event"); setWizardStep(2); setCreateOpen(true); }}>
                <Plus className="w-4 h-4 mr-1" /> Create Event
              </Button>
            </div>
            {myEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myEvents.map(item => <ListingCard key={item.id} item={item} type="event" />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-card/30 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground mb-3">No events yet</p>
                <Button size="sm" variant="outline" onClick={() => { setListingType("event"); setWizardStep(2); setCreateOpen(true); }}>
                  <Plus className="w-4 h-4 mr-1" /> Create Your First Event
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Ad Manager */}
          <TabsContent value="ads" className="space-y-6">
            <div className="text-center py-16 bg-card/30 rounded-2xl border border-dashed border-border">
              <Megaphone className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <h3 className="text-lg font-bold mb-2">Ad Manager</h3>
              <p className="text-muted-foreground text-sm mb-4">Promote your listings to reach more people</p>
              <Button onClick={() => navigate("/run-ads")}>
                <Megaphone className="w-4 h-4 mr-2" /> Start Advertising
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Create Listing Wizard Dialog ── */}
      <Dialog open={createOpen} onOpenChange={(open) => { if (!open) resetWizard(); else setCreateOpen(true); }}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl">
          {wizardStep === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">What are you listing today?</DialogTitle>
                <DialogDescription>Choose a listing type to get started</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 gap-3 py-4">
                {[
                  { type: "business" as const, icon: Store, title: "Register Business", desc: "Register your shop, brand, or service agency" },
                  { type: "product" as const, icon: ShoppingBag, title: "Post a Product/Service", desc: "Sell a physical item, deal, package, or service" },
                  { type: "property" as const, icon: Home, title: "List a Property", desc: "List a shortlet, apartment, land, or house" },
                  { type: "event" as const, icon: Calendar, title: "Create an Event", desc: "Publish a concert, festival, or meetup" },
                ].map((opt) => (
                  <button
                    key={opt.type}
                    onClick={() => { setListingType(opt.type); setWizardStep(2); }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <opt.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-foreground">{opt.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {listingType === "business" && "Register Business"}
                  {listingType === "product" && "Post a Product/Service"}
                  {listingType === "property" && "List a Property"}
                  {listingType === "event" && "Create an Event"}
                </DialogTitle>
                <DialogDescription>All fields with * are required</DialogDescription>
              </DialogHeader>

              {listingType === "business" && renderBusinessForm()}
              {listingType === "product" && renderProductForm()}
              {listingType === "property" && renderPropertyForm()}
              {listingType === "event" && renderEventForm()}

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setWizardStep(1)}>Back</Button>
                <Button className="flex-1 rounded-xl font-bold" onClick={getSubmitHandler()} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creating...</span>
                  ) : (
                    "Create Listing"
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation: Step 1 ── */}
      <Dialog open={deleteStep === 1} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Delete "{deleteTarget?.title}"?</DialogTitle>
            <DialogDescription>
              This action can be undone, but the listing will be removed from public view immediately.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={confirmDeleteStep1}>
              Yes, Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation: Step 2 (final) ── */}
      <Dialog open={deleteStep === 2} onOpenChange={(open) => { if (!open) cancelDelete(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-destructive">Final Confirmation</DialogTitle>
            <DialogDescription>
              Are you absolutely sure? This will permanently delete <strong>"{deleteTarget?.title}"</strong>. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" className="flex-1 rounded-xl font-bold" onClick={confirmDeleteStep2} disabled={deleting}>
              {deleting ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</span>
              ) : (
                "Delete Permanently"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Edit Dialog ── */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editTarget?.type === "business" && "Edit Business"}
              {editTarget?.type === "product" && "Edit Product"}
              {editTarget?.type === "property" && "Edit Property"}
              {editTarget?.type === "event" && "Edit Event"}
            </DialogTitle>
            <DialogDescription>Update your listing details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title *</Label>
              <Input className="mt-1.5" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>

            {editTarget?.type === "business" && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {BUSINESS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editTarget?.type === "property" && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Property Type</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</Label>
              <Select value={editState} onValueChange={(v) => { setEditState(v as NigerianState); setEditCity(""); }}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {editState && (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City / Area</Label>
                <Select value={editCity} onValueChange={setEditCity}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>
                    {(STATE_CITIES[editState] || []).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address</Label>
              <Input className="mt-1.5" value={editStreetAddress} onChange={(e) => setEditStreetAddress(e.target.value)} />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone</Label>
              <Input className="mt-1.5" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
              <Textarea className="mt-1.5" rows={3} value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cover Image</Label>
              <ImageUpload
                onUploadSuccess={(r) => { setEditImageUrl(r.secureUrl); setEditImagePublicId(r.publicId); }}
                folder={CLOUDINARY_FOLDERS.BUSINESSES}
                currentImage={editImageUrl}
                buttonText="Change Cover"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button className="flex-1 rounded-xl font-bold" onClick={handleUpdateListing} disabled={editSaving}>
              {editSaving ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileDashboard;
