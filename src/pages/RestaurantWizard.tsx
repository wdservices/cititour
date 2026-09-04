import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRegion } from "@/contexts/RegionContext";
import { useMyListings, useCreateDoc, useUpdateDoc } from "@/lib/useFirestore";
import {
  NIGERIAN_STATES,
  RESTAURANT_CUISINES,
  RESTAURANT_TYPES,
  RESTAURANT_PRICE_TIERS,
  RESTAURANT_AMENITIES,
  MENU_CATEGORIES,
  DIETARY_TAGS,
} from "@/lib/nigerianStates";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  MessageCircle,
  Mail,
  Upload,
  Check,
  Building2,
  Plus,
  Trash2,
  MapPin,
  UtensilsCrossed,
  Clock,
  Globe,
  Sparkles,
  Flame,
  ChefHat,
  CalendarCheck,
} from "lucide-react";

const STEPS = ["Details", "About", "Dining & Features", "Menu & Pricing", "Publish"];

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  portionSize: string;
  tags: string[];
  images: string[];
  imagePublicIds: string[];
}

function newMenuItem(defaultCategory = "Main Dishes"): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: defaultCategory,
    description: "",
    price: 0,
    portionSize: "Standard Portion",
    tags: [],
    images: [],
    imagePublicIds: [],
  };
}

export default function RestaurantWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingRestaurantId = searchParams.get("restaurantId") || searchParams.get("businessId");
  const isEditing = !!editingRestaurantId;
  const { toast } = useToast();
  const { data: myListingsData } = useMyListings(user?.id || null);
  const myBusinesses = myListingsData?.businesses || [];
  const createBusiness = useCreateDoc("businesses");
  const updateBusiness = useUpdateDoc("businesses");

  // If editing, find existing business
  const existingRestaurant = isEditing
    ? myBusinesses.find((b: any) => b.id === editingRestaurantId)
    : null;

  const [step, setStep] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialized, setInitialized] = useState(false);

  const { state: regionState, locationName: regionCity, userAddress } = useRegion();

  // Step 0: Details
  const [parentBizId, setParentBizId] = useState("");
  const [title, setTitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [cuisine, setCuisine] = useState<string>("Nigerian / Local Delicacies");
  const [priceTier, setPriceTier] = useState<string>("₦₦");
  const [establishmentType, setEstablishmentType] = useState<string>("CASUAL EATERY");
  const [city, setCity] = useState(regionCity || "");
  const [state, setState] = useState(regionState || "");

  // Step 1: About, Location & Contact
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState(userAddress || regionCity || "");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imagePublicIds, setImagePublicIds] = useState<string[]>([]);
  const [logo, setLogo] = useState("");
  const [logoPublicId, setLogoPublicId] = useState("");
  const [openingTime, setOpeningTime] = useState("08:00");
  const [closingTime, setClosingTime] = useState("22:00");
  const [daysOpen, setDaysOpen] = useState("Monday - Sunday");

  // Step 2: Dining & Features
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "dine_in",
    "takeaway",
    "pos_cards",
    "ac",
  ]);
  const [seatingCapacity, setSeatingCapacity] = useState("50 Seats");
  const [allowReservations, setAllowReservations] = useState(true);
  const [reservationDeposit, setReservationDeposit] = useState(0);

  // Step 3: Menu & Pricing
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      ...newMenuItem("Main Dishes"),
      name: "Special Jollof Rice & Grilled Chicken",
      description: "Smoky firewood party jollof served with spiced fried plantain and peppered grilled chicken.",
      price: 4500,
      tags: ["bestseller"],
    },
    {
      ...newMenuItem("Soups & Swallows"),
      name: "Fisherman Soup / Native Soup",
      description: "Rich seafood medley with fresh fish, prawns, periwinkles and traditional spices.",
      price: 8000,
      tags: ["chef_special"],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Prefill from existing restaurant
  useEffect(() => {
    if (existingRestaurant && !initialized) {
      const r = existingRestaurant as any;
      setParentBizId(r.parentBizId || "");
      setTitle(r.title || "");
      setSlogan(r.slogan || "");
      setCuisine(r.cuisine || "Nigerian / Local Delicacies");
      setPriceTier(r.priceTier || "₦₦");
      setEstablishmentType(r.establishmentType || "CASUAL EATERY");
      setCity(r.city || "");
      setState(r.state || "");
      setDescription(r.description || "");
      setAddress(r.address || r.location || "");
      setPhone(r.phone || "");
      setWhatsapp(r.whatsapp || "");
      setEmail(r.contactEmail || r.email || "");
      setWebsite(r.website || "");
      setImages(r.images || (r.image ? [r.image] : []));
      setImagePublicIds(r.imagePublicIds || []);
      setLogo(r.logo || "");
      setLogoPublicId(r.logoPublicId || "");
      setOpeningTime(r.openingTime || "08:00");
      setClosingTime(r.closingTime || "22:00");
      setDaysOpen(r.daysOpen || "Monday - Sunday");
      setSelectedAmenities(r.diningFeatures || r.amenities || ["dine_in", "takeaway", "pos_cards"]);
      setSeatingCapacity(r.seatingCapacity || "50 Seats");
      setAllowReservations(r.allowReservations ?? true);
      setReservationDeposit(r.reservationDeposit || 0);

      if (r.menu && Array.isArray(r.menu) && r.menu.length > 0) {
        setMenuItems(
          r.menu.map((m: any) => ({
            id: m.id || crypto.randomUUID(),
            name: m.name || "",
            category: m.category || "Main Dishes",
            description: m.description || "",
            price: m.price || 0,
            portionSize: m.portionSize || "Standard Portion",
            tags: m.tags || [],
            images: m.images || (m.image ? [m.image] : []),
            imagePublicIds: m.imagePublicIds || [],
          }))
        );
      }
      setInitialized(true);
    }
  }, [existingRestaurant, initialized]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (title || description || phone || images.length > 0) setLastSaved(new Date());
    }, 120000);
    return () => clearInterval(timer);
  }, [title, description, phone, images]);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (isEditing && !initialized && !existingRestaurant) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#ea580c] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  const restaurantSlug = title
    ? title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+$/, "")
    : "your-restaurant";

  const totalDishes = menuItems.filter((m) => m.name.trim().length > 0).length;
  const pricedItems = menuItems.filter((m) => m.price > 0);
  const minPrice = pricedItems.length > 0 ? Math.min(...pricedItems.map((m) => m.price)) : 0;

  const canNext = () => {
    switch (step) {
      case 0:
        return title.trim().length > 0 && !!state && !!cuisine;
      case 1:
        return true;
      case 2:
        return true;
      case 3:
        return menuItems.some((m) => m.name.trim().length > 0 && m.price > 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const formatTimeAgo = (date: Date | null) => {
    if (!date) return "";
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 1) return "JUST NOW";
    if (mins < 60) return `${mins}M AGO`;
    return `${Math.floor(mins / 60)}H AGO`;
  };

  const formatTime = (t: string) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    return `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  const updateMenuItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const toggleItemTag = (id: string, tagId: string) => {
    setMenuItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const exists = m.tags.includes(tagId);
        return {
          ...m,
          tags: exists ? m.tags.filter((t) => t !== tagId) : [...m.tags, tagId],
        };
      })
    );
  };

  const addMenuItem = (category = "Main Dishes") => {
    setMenuItems((prev) => [...prev, newMenuItem(category)]);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems((prev) => (prev.length > 1 ? prev.filter((m) => m.id !== id) : prev));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      const fullLocation = [city, state, "Nigeria"].filter(Boolean).join(", ");
      const primaryImage = images[0] || "";
      const priceString = minPrice > 0 ? `from ₦${minPrice.toLocaleString()}` : priceTier;

      const openingHoursStr = `${formatTime(openingTime)} - ${formatTime(closingTime)}, ${daysOpen}`;

      const payload = {
        title: title.trim(),
        slogan: slogan.trim(),
        category: "Restaurant",
        type: "Restaurant",
        cuisine,
        priceTier,
        establishmentType,
        description: description.trim(),
        address: address.trim() || fullLocation,
        location: fullLocation,
        state,
        city,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        contactEmail: email.trim(),
        email: email.trim(),
        website: website.trim(),
        openingTime,
        closingTime,
        daysOpen,
        openingHours: openingHoursStr,
        diningFeatures: selectedAmenities,
        amenities: selectedAmenities,
        seatingCapacity: seatingCapacity.trim(),
        allowReservations,
        reservationDeposit,
        menu: menuItems
          .filter((m) => m.name.trim().length > 0)
          .map(({ id, ...rest }) => rest),
        price: priceString,
        priceNum: minPrice,
        image: primaryImage,
        images: images.length > 0 ? images : primaryImage ? [primaryImage] : [],
        imagePublicIds: imagePublicIds.length > 0 ? imagePublicIds : [],
        logo: logo || "",
        logoPublicId: logoPublicId || "",
        parentBizId: parentBizId || null,
        miniSiteActive: true,
        isOpen: true,
      };

      if (isEditing && editingRestaurantId) {
        await updateBusiness.mutateAsync({ id: editingRestaurantId, data: payload });
        toast({ title: "Restaurant updated!", description: "Your changes have been saved and published." });
      } else {
        await createBusiness.mutateAsync({
          ...payload,
          ownerId: user?.id || "",
          status: "Pending",
          rating: 0,
          reviewCount: 0,
        });
        toast({ title: "Restaurant listing created!", description: "Your restaurant mini-site is now live & pending review." });
      }
      navigate("/profile/dashboard?tab=listings");
    } catch (e: any) {
      toast({ title: "Failed to save restaurant", description: e.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            {myBusinesses.length > 0 && (
              <div>
                <Label className="text-[13px] font-medium text-foreground">Link to Existing Group / Brand (Optional)</Label>
                <Select value={parentBizId} onValueChange={setParentBizId}>
                  <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                    <SelectValue placeholder="Independent Restaurant (or choose parent brand)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="independent">Independent Restaurant (Stand-alone)</SelectItem>
                    {myBusinesses.map((b: any) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-[13px] font-medium text-foreground">Restaurant / Eatery Name *</Label>
              <Input
                className="mt-1.5 h-11 rounded-xl"
                placeholder="e.g. Terra Kulture Restaurant & Lounge"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-[13px] font-medium text-foreground">Tagline / Slogan</Label>
              <Input
                className="mt-1.5 h-11 rounded-xl"
                placeholder="e.g. Authentic Nigerian Delicacies & Fine Dining Experience"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-[13px] font-medium text-foreground">Primary Cuisine *</Label>
                <Select value={cuisine} onValueChange={setCuisine}>
                  <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESTAURANT_CUISINES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[13px] font-medium text-foreground">Price Tier</Label>
                <Select value={priceTier} onValueChange={setPriceTier}>
                  <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                    <SelectValue placeholder="Select price tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESTAURANT_PRICE_TIERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-[13px] font-medium text-foreground">Dining Style / Establishment Type</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {RESTAURANT_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setEstablishmentType(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      establishmentType === t
                        ? "border-[#ea580c] bg-[#ea580c] text-white shadow-sm"
                        : "border-gray-300 text-gray-600 hover:border-[#ea580c]/50 hover:bg-orange-50/50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-[13px] font-medium text-foreground">State *</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                    <SelectValue placeholder="Select Nigerian State" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIGERIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-[13px] font-medium text-foreground">City / Neighborhood *</Label>
                <Input
                  className="mt-1.5 h-11 rounded-xl"
                  placeholder="e.g. Victoria Island, Lekki, Ikeja"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-0">
            <div className="space-y-6">
              <div>
                <Label className="text-[13px] font-medium text-gray-500">About the Restaurant & Ambiance *</Label>
                <Textarea
                  className="mt-1.5 rounded-xl resize-none"
                  placeholder="Describe your culinary specialty, the dining experience, chef's vision, atmosphere, and special vibes..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-gray-500">Street Address & Landmark</Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    className="h-11 rounded-xl pl-10"
                    placeholder="e.g. Plot 1376 Tiamiyu Savage St, Victoria Island"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div>
              <h3 className="text-[15px] font-bold text-foreground mb-4">Contact & Orders</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Phone Number *</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="h-11 rounded-xl pl-10"
                      placeholder="+234 800 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">WhatsApp (For Orders & Bookings)</Label>
                  <div className="relative mt-1.5">
                    <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="h-11 rounded-xl pl-10"
                      placeholder="+234 800 000 0000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Business Email</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="h-11 rounded-xl pl-10"
                      placeholder="reservations@restaurant.ng"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Website / Instagram Link</Label>
                  <div className="relative mt-1.5">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      className="h-11 rounded-xl pl-10"
                      placeholder="https://instagram.com/myrestaurant"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div>
              <h3 className="text-[15px] font-bold text-foreground mb-4">Restaurant Logo / Brand Mark</h3>
              <MultiImageUpload
                onUploadSuccess={(r) => {
                  setLogo(r.secureUrl);
                  setLogoPublicId(r.publicId);
                }}
                onRemove={() => {
                  setLogo("");
                  setLogoPublicId("");
                }}
                folder={CLOUDINARY_FOLDERS.BUSINESSES}
                currentImages={logo ? [logo] : []}
                buttonText="Upload Restaurant Logo"
                placeholder="Upload your brand emblem or logo"
                maxImages={1}
              />
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Food & Ambiance Photos</h3>
                  <p className="text-[11px] text-gray-400">First photo will be your restaurant cover banner (Min 3 recommended)</p>
                </div>
                <span className="text-[11px] text-gray-400">Max 10 photos</span>
              </div>
              <MultiImageUpload
                onUploadSuccess={(r) => {
                  setImages((prev) => [...prev, r.secureUrl]);
                  setImagePublicIds((prev) => [...prev, r.publicId]);
                }}
                onRemove={(idx) => {
                  setImages((prev) => prev.filter((_, i) => i !== idx));
                  setImagePublicIds((prev) => prev.filter((_, i) => i !== idx));
                }}
                folder={CLOUDINARY_FOLDERS.BUSINESSES}
                currentImages={images}
                buttonText="Upload Food & Space Photos"
                placeholder="Drop photos of your dishes, dining hall, bar and lounge here"
                maxImages={10}
              />
              {images.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative w-[140px] h-[100px] rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-2 left-2 bg-[#ea580c] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          COVER
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div>
              <h3 className="text-[15px] font-bold text-foreground mb-4">Opening Hours & Schedule</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Opening Time</Label>
                  <Input
                    className="mt-1.5 h-11 rounded-xl"
                    type="time"
                    value={openingTime}
                    onChange={(e) => setOpeningTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Closing Time</Label>
                  <Input
                    className="mt-1.5 h-11 rounded-xl"
                    type="time"
                    value={closingTime}
                    onChange={(e) => setClosingTime(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Operating Days</Label>
                  <Input
                    className="mt-1.5 h-11 rounded-xl"
                    placeholder="e.g. Monday - Sunday"
                    value={daysOpen}
                    onChange={(e) => setDaysOpen(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-0">
            <div>
              <h3 className="text-[15px] font-bold text-foreground mb-1">Dining Features & Services</h3>
              <p className="text-[12px] text-gray-400 mb-4">
                Highlight what makes your restaurant special and how guests can enjoy your food.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {RESTAURANT_AMENITIES.map((a) => {
                  const isSelected = selectedAmenities.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() =>
                        setSelectedAmenities((prev) =>
                          prev.includes(a.id) ? prev.filter((x) => x !== a.id) : [...prev, a.id]
                        )
                      }
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                        isSelected
                          ? "border-[#ea580c] bg-orange-500/10 text-[#ea580c] font-semibold"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="text-base">{a.icon}</span> {a.label}
                      {isSelected && <Check className="w-4 h-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div>
              <h3 className="text-[15px] font-bold text-foreground mb-4">Seating & Table Reservations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Seating Capacity</Label>
                  <Input
                    className="mt-1.5 h-11 rounded-xl"
                    placeholder="e.g. 60 Seats / 18 Tables"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-[13px] font-medium text-gray-500">Table Reservation Policy</Label>
                  <Select
                    value={allowReservations ? "yes" : "no"}
                    onValueChange={(v) => setAllowReservations(v === "yes")}
                  >
                    <SelectTrigger className="mt-1.5 h-11 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Enable Online Table Reservations</SelectItem>
                      <SelectItem value="no">Walk-ins / Call-Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {allowReservations && (
                <div className="mt-4 p-4 rounded-xl bg-orange-50/70 border border-orange-200/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-orange-900">Minimum Reservation Deposit (Optional)</p>
                      <p className="text-[11px] text-orange-700/80 mt-0.5">
                        Charge a booking fee to secure tables, which can be applied to guest food bill.
                      </p>
                    </div>
                    <div className="w-36">
                      <Input
                        type="number"
                        placeholder="₦0 (Free)"
                        className="h-9 bg-white"
                        value={reservationDeposit || ""}
                        onChange={(e) => setReservationDeposit(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-0">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-[15px] font-bold text-foreground">Digital Menu & Signature Dishes</h3>
                  <p className="text-[12px] text-gray-400 mt-1">
                    Add signature meals, drinks, and appetizers so visitors can browse your food online.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addMenuItem("Main Dishes")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ea580c] text-white text-[12px] font-bold hover:bg-[#c2410c] transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Dish
                </button>
              </div>

              <div className="space-y-5">
                {menuItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 space-y-4 relative"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-gray-200/70">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[14px] font-bold text-foreground">
                          {item.name || `Dish ${idx + 1}`}
                        </span>
                      </div>
                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMenuItem(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove dish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <Label className="text-[12px] font-medium text-gray-500">Dish / Item Name *</Label>
                        <Input
                          className="mt-1 h-10 rounded-xl"
                          placeholder="e.g. Seafood Okro with Poundo Yam"
                          value={item.name}
                          onChange={(e) => updateMenuItem(item.id, "name", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label className="text-[12px] font-medium text-gray-500">Category *</Label>
                        <Select
                          value={item.category}
                          onValueChange={(v) => updateMenuItem(item.id, "category", v)}
                        >
                          <SelectTrigger className="mt-1 h-10 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {MENU_CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-[12px] font-medium text-gray-500">Description & Ingredients</Label>
                      <Textarea
                        className="mt-1 rounded-xl resize-none text-xs"
                        placeholder="Brief description of flavors, ingredients, sides included..."
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateMenuItem(item.id, "description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-[12px] font-medium text-gray-500">Price (₦) *</Label>
                        <Input
                          className="mt-1 h-10 rounded-xl"
                          type="number"
                          placeholder="e.g. 4500"
                          value={item.price || ""}
                          onChange={(e) =>
                            updateMenuItem(item.id, "price", parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <Label className="text-[12px] font-medium text-gray-500">Portion / Serving</Label>
                        <Input
                          className="mt-1 h-10 rounded-xl"
                          placeholder="e.g. Single Portion, Serves 2, Jumbo Platter"
                          value={item.portionSize}
                          onChange={(e) => updateMenuItem(item.id, "portionSize", e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Dietary Badges */}
                    <div>
                      <Label className="text-[12px] font-medium text-gray-500 block mb-1.5">Dietary & Highlight Badges</Label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIETARY_TAGS.map((tag) => {
                          const hasTag = item.tags.includes(tag.id);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleItemTag(item.id, tag.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
                                hasTag
                                  ? "border-orange-500 bg-orange-100 text-orange-900 font-bold"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dish Photo */}
                    <div>
                      <Label className="text-[12px] font-medium text-gray-500">Dish Photo (Optional, max 3)</Label>
                      <MultiImageUpload
                        onUploadSuccess={(r) => {
                          setMenuItems((prev) =>
                            prev.map((m) =>
                              m.id === item.id
                                ? {
                                    ...m,
                                    images: [...m.images, r.secureUrl],
                                    imagePublicIds: [...m.imagePublicIds, r.publicId],
                                  }
                                : m
                            )
                          );
                        }}
                        onRemove={(iIdx) => {
                          setMenuItems((prev) =>
                            prev.map((m) =>
                              m.id === item.id
                                ? {
                                    ...m,
                                    images: m.images.filter((_, i) => i !== iIdx),
                                    imagePublicIds: m.imagePublicIds.filter((_, i) => i !== iIdx),
                                  }
                                : m
                            )
                          );
                        }}
                        folder={CLOUDINARY_FOLDERS.BUSINESSES}
                        currentImages={item.images}
                        buttonText="Add Dish Photo"
                        placeholder="Upload mouth-watering photo of this dish"
                        maxImages={3}
                      />
                      {item.images.length > 0 && (
                        <div className="flex gap-2 mt-2">
                          {item.images.map((img, i) => (
                            <div
                              key={i}
                              className="relative w-[72px] h-[56px] rounded-lg overflow-hidden border border-gray-200"
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="my-8 border-t border-gray-200" />

            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/80">
              <p className="text-[12px] text-orange-900 font-medium">
                <strong>{totalDishes} Menu Item{totalDishes !== 1 ? "s" : ""} Added</strong> &middot; Starting from{" "}
                <strong>₦{minPrice.toLocaleString()}</strong> &middot; Categorized across{" "}
                {new Set(menuItems.map((m) => m.category)).size} food sections
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="flex gap-8">
            {/* Left: Checklist */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#ecfdf5] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div>
                  <h3 className="text-[17px] font-bold text-gray-900">Your Restaurant is Ready!</h3>
                  <p className="text-[13px] text-gray-500 mt-0.5">
                    Review your details below and publish your restaurant mini-site to welcome diners.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Restaurant Basics",
                    sub: `${title || "Restaurant"} · ${cuisine} · ${city || "City"}, ${state || "State"}`,
                    targetStep: 0,
                  },
                  {
                    label: "About & Operating Hours",
                    sub: `${formatTime(openingTime)} - ${formatTime(closingTime)} (${daysOpen}) · ${images.length} photos`,
                    targetStep: 1,
                  },
                  {
                    label: "Dining Features & Seating",
                    sub: `${selectedAmenities.length} dining amenities · ${seatingCapacity} · ${
                      allowReservations ? "Table booking active" : "Walk-in"
                    }`,
                    targetStep: 2,
                  },
                  {
                    label: "Digital Menu & Dishes",
                    sub: `${totalDishes} dishes listed · Starting from ₦${minPrice.toLocaleString()}`,
                    targetStep: 3,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#f8f9fa] hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#dcfce7] flex items-center justify-center">
                        <Check className="w-3 h-3 text-[#16a34a]" />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-gray-900">{item.label}</p>
                        <p className="text-[12px] text-gray-500">{item.sub}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStep(item.targetStep)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-[#ea580c] bg-[#ea580c]/10 hover:bg-[#ea580c]/20 transition-colors"
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Browser preview in checklist */}
            <div className="w-[320px] shrink-0 hidden xl:block">
              <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                <div className="bg-gray-100 px-3 py-2 space-y-1.5">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  </div>
                  <div className="bg-white rounded-md px-2.5 py-1 text-[9px] text-gray-400 truncate">
                    citivas.com/{restaurantSlug}
                  </div>
                </div>

                {/* Hero */}
                <div className="relative h-44 bg-gray-200">
                  {images[0] ? (
                    <img src={images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center">
                      <UtensilsCrossed className="w-7 h-7 text-orange-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-white/95 rounded-lg px-2 py-1 shadow">
                    {logo ? (
                      <img src={logo} alt="" className="h-5 w-5 object-contain rounded" />
                    ) : (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-[#ea580c] font-bold text-[7px] text-white">
                        {(title || "R")
                          .split(" ")
                          .map((w: string) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                    <span className="text-[9px] font-bold text-gray-800">{title || "Restaurant"}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="bg-[#ea580c] text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full">
                        {establishmentType}
                      </span>
                      <span className="bg-white/90 text-gray-800 text-[7px] font-bold px-1.5 py-0.5 rounded-full">
                        {priceTier}
                      </span>
                    </div>
                    <p className="text-white text-[12px] font-bold leading-tight">{title || "Restaurant Name"}</p>
                    <p className="text-white/70 text-[8px] mt-0.5">
                      {[city, state].filter(Boolean).join(", ") || "Location"} &middot; {cuisine}
                    </p>
                  </div>
                </div>

                {/* About + Key Facts */}
                <div className="px-3 py-3 text-center">
                  <p className="text-[7px] font-bold uppercase tracking-widest text-[#ea580c] mb-0.5">Welcome to</p>
                  <h4 className="text-[12px] font-extrabold text-gray-800 mb-1">{title || "Restaurant Name"}</h4>
                  <p className="text-[8px] text-gray-500 leading-[1.5] line-clamp-2 mb-3">
                    {description || slogan || "Authentic dining and hospitality in Nigeria."}
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { label: "Rating", value: "0 (0)" },
                      { label: "Cuisine", value: cuisine.split(" ")[0] },
                      { label: "Hours", value: `${formatTime(openingTime) || "08:00"}` },
                      { label: "From", value: minPrice > 0 ? `₦${minPrice.toLocaleString()}` : "₦0" },
                    ].map((f) => (
                      <div key={f.label} className="p-1 rounded-lg border border-gray-200 bg-white">
                        <p className="text-[6px] font-semibold uppercase tracking-wider text-gray-400">{f.label}</p>
                        <p className="text-[7px] font-bold text-gray-800 truncate">{f.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Dishes */}
                {menuItems.filter((m) => m.name).length > 0 && (
                  <div className="px-3 pb-2.5">
                    <h4 className="text-[10px] font-bold text-gray-800 mb-1.5">Signature Menu</h4>
                    <div className="space-y-1.5">
                      {menuItems
                        .filter((m) => m.name)
                        .slice(0, 2)
                        .map((dish) => (
                          <div key={dish.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-gray-50">
                            {dish.images[0] && (
                              <img src={dish.images[0]} alt="" className="w-10 h-8 object-cover rounded" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-semibold text-gray-700 truncate">{dish.name}</p>
                              <p className="text-[7px] text-gray-400 truncate">{dish.category}</p>
                            </div>
                            {dish.price > 0 && (
                              <p className="text-[8px] font-bold text-[#ea580c] whitespace-nowrap">
                                ₦{dish.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-3 py-3 bg-gray-900 text-white">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {logo ? (
                      <img src={logo} alt="" className="h-5 w-5 object-contain rounded bg-white/10 p-0.5" />
                    ) : (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded bg-[#ea580c] font-bold text-[7px] text-white">
                        {(title || "R")
                          .split(" ")
                          .map((w: string) => w[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                    )}
                    <span className="text-[10px] font-bold">{title || "Restaurant"}</span>
                  </div>
                  <p className="text-[7px] text-gray-400">
                    &copy; {new Date().getFullYear()} {title || "Restaurant"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ea580c] flex items-center justify-center mx-auto">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sign in to Access Restaurant Wizard</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            You need to be signed in with a Citivas account to create and manage restaurant storefronts, digital menus, and table reservations.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => navigate("/profile/dashboard?tab=listings")}
              className="px-5 py-2.5 rounded-full border border-gray-300 text-xs font-semibold text-gray-600 hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/auth?redirect=/restaurant-wizard")}
              className="px-5 py-2.5 rounded-full bg-[#ea580c] text-white text-xs font-bold hover:bg-[#c2410c]"
            >
              Sign In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 h-12 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/profile/dashboard?tab=listings")}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#ea580c] rounded-md flex items-center justify-center text-white">
              <UtensilsCrossed className="w-3.5 h-3.5" />
            </div>
            <span className="text-[13px] font-semibold text-gray-800">{title || "Restaurant Wizard"}</span>
          </div>
        </div>
        <span className="text-[11px] text-gray-400">Powered by Citivas Dining</span>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex justify-center overflow-y-auto pb-24">
          <div className="w-full max-w-[860px] px-8 py-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-0">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[22px] font-bold text-gray-800">
                  {isEditing ? `Edit ${STEPS[step]}` : `Step ${step + 1}: ${STEPS[step]}`}
                </h2>
                <span className="bg-[#ea580c] text-white text-[11px] font-bold px-3 py-1 rounded-full">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>
              <div className="w-full h-[3px] bg-gray-200 rounded-full mb-0 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-[#ea580c] rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center -mb-[1px]">
                {STEPS.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => i < step && setStep(i)}
                    className={`flex-1 py-4 text-[13px] font-medium transition-all border-b-[2.5px] ${
                      i === step
                        ? "border-b-[#ea580c] text-[#ea580c] font-bold"
                        : i < step
                        ? "border-b-transparent text-[#ea580c] cursor-pointer hover:opacity-80"
                        : "border-b-transparent text-gray-400"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 border-t-0 p-6">
              {renderStepContent()}
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="w-[480px] bg-white border-l border-gray-200 px-6 py-6 hidden lg:block shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-600" />
              <span className="text-[13px] font-bold text-gray-800">RESTAURANT PREVIEW</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div className="bg-gray-100 px-4 py-2.5 space-y-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <div className="bg-white rounded-md px-3 py-1.5 text-[10px] text-gray-400 truncate">
                citivas.com/{restaurantSlug}
              </div>
            </div>

            {/* Hero */}
            <div className="relative h-56 bg-gray-200">
              {images[0] ? (
                <img src={images[0]} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50 flex items-center justify-center">
                  <UtensilsCrossed className="w-9 h-9 text-orange-400/60" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

              {/* Logo + name */}
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/95 rounded-lg px-2.5 py-1.5 shadow">
                {logo ? (
                  <img src={logo} alt="" className="h-6 w-6 object-contain rounded" />
                ) : (
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded bg-[#ea580c] font-bold text-[8px] text-white">
                    {(title || "R")
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
                <span className="text-[10px] font-bold text-gray-800">{title || "Restaurant Name"}</span>
              </div>

              {/* Badges */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="bg-[#ea580c] text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                    {establishmentType}
                  </span>
                  <span className="bg-white/90 text-gray-800 text-[8px] font-bold px-2 py-0.5 rounded-full">
                    {priceTier}
                  </span>
                  <span className="bg-emerald-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                    Open Now
                  </span>
                </div>
                <h3 className="text-white text-[16px] font-bold leading-tight">{title || "The Chef's Table"}</h3>
                <p className="text-white/70 text-[10px] mt-0.5">
                  {[city, state].filter(Boolean).join(", ") || "Location"} &middot; {cuisine}
                </p>
              </div>
            </div>

            {/* About + Key Facts */}
            <div className="px-5 py-5 text-center">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#ea580c] mb-1">Welcome to</p>
              <h4 className="text-[16px] font-extrabold text-gray-800 mb-1">{title || "The Chef's Table"}</h4>
              {slogan && <p className="text-[11px] font-medium text-orange-600 mb-2 italic">"{slogan}"</p>}
              <p className="text-[11px] text-gray-500 leading-[1.7] line-clamp-3 mb-5">
                {description ||
                  "Experience rich culinary excellence with exquisite taste, fresh ingredients, and a warm dining atmosphere."}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: "Rating", value: "0 (0)" },
                  { label: "Cuisine", value: cuisine.split(" ")[0] },
                  {
                    label: "Hours",
                    value: `${formatTime(openingTime) || "08:00"} · ${formatTime(closingTime) || "22:00"}`,
                  },
                  { label: "Starting from", value: minPrice > 0 ? `₦${minPrice.toLocaleString()}` : "₦0" },
                ].map((f) => (
                  <div key={f.label} className="p-2 rounded-xl border border-gray-200 bg-white">
                    <p className="text-[7px] font-semibold uppercase tracking-wider text-gray-400">{f.label}</p>
                    <p className="text-[9px] font-bold text-gray-800 mt-0.5 truncate">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital Menu Highlights */}
            {menuItems.filter((m) => m.name).length > 0 && (
              <div className="px-5 pb-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#ea580c] mb-1 text-center">
                  Culinary Delights
                </p>
                <h4 className="text-[14px] font-extrabold text-gray-800 mb-3 text-center">Signature Dishes</h4>
                <div className="space-y-2.5">
                  {menuItems
                    .filter((m) => m.name)
                    .slice(0, 3)
                    .map((dish) => (
                      <div key={dish.id} className="rounded-xl border border-gray-200 overflow-hidden bg-white">
                        {dish.images[0] && (
                          <div className="h-28 bg-gray-100">
                            <img src={dish.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[12px] font-bold text-gray-800">{dish.name}</p>
                            {dish.price > 0 && (
                              <p className="text-[12px] font-bold text-[#ea580c]">₦{dish.price.toLocaleString()}</p>
                            )}
                          </div>
                          {dish.description && (
                            <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{dish.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100">
                            <span className="text-[9px] text-gray-400 font-medium">{dish.portionSize}</span>
                            <div className="flex gap-1">
                              {dish.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[8px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 font-bold"
                                >
                                  {DIETARY_TAGS.find((dt) => dt.id === t)?.label.split(" ")[0]}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {menuItems.filter((m) => m.name).length > 3 && (
                    <p className="text-[10px] text-gray-400 text-center">
                      +{menuItems.filter((m) => m.name).length - 3} more delicious dishes on menu
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Gallery — bento flex */}
            <div className="px-5 pb-4">
              <h4 className="text-[14px] font-extrabold text-gray-800 mb-3">Restaurant Gallery</h4>
              {images.length > 1 ? (
                <div className="space-y-2">
                  <div className="flex gap-2" style={{ height: "140px" }}>
                    <div className="flex-[3] overflow-hidden rounded-xl">
                      <img src={images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-[2] flex flex-col gap-2">
                      {images[1] && (
                        <div className="flex-1 overflow-hidden rounded-xl">
                          <img src={images[1]} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      {images[2] ? (
                        <div className="flex-1 overflow-hidden rounded-xl">
                          <img src={images[2]} alt="" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="flex-1" />
                      )}
                    </div>
                  </div>
                  {images.slice(3, 5).length > 0 && (
                    <div className="flex gap-2">
                      {images.slice(3, 5).map((img, i) => (
                        <div
                          key={i}
                          className="flex-1 overflow-hidden rounded-xl"
                          style={{ height: "90px" }}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2" style={{ height: "140px" }}>
                    <div className="flex-[3] rounded-xl bg-orange-50" />
                    <div className="flex-[2] flex flex-col gap-2">
                      <div className="flex-1 rounded-xl bg-orange-50" />
                      <div className="flex-1 rounded-xl bg-orange-50" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dining Amenities */}
            {selectedAmenities.length > 0 && (
              <div className="px-5 pb-4">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#ea580c] mb-1 text-center">
                  Dining Experience
                </p>
                <h4 className="text-[14px] font-extrabold text-gray-800 mb-3 text-center">Features & Services</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAmenities.slice(0, 4).map((aId) => {
                    const item = RESTAURANT_AMENITIES.find((x) => x.id === aId);
                    if (!item) return null;
                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 rounded-xl border border-gray-200 bg-white"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-[#ea580c]" />
                        </div>
                        <span className="text-[10px] font-medium text-gray-700">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
                {selectedAmenities.length > 4 && (
                  <p className="text-[10px] text-gray-400 text-center mt-2">
                    +{selectedAmenities.length - 4} more features
                  </p>
                )}
              </div>
            )}

            {/* Reservation / Order CTA Box */}
            <div className="px-5 pb-4">
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white text-center">
                <p className="text-xs font-bold">Reserve a Table / Call for Takeaway</p>
                <p className="text-[10px] text-white/80 mt-0.5">
                  {phone || "Call direct for instant reservation"}
                </p>
              </div>
            </div>

            {/* Contact */}
            {(phone || whatsapp || email || address) && (
              <div className="px-5 pb-4 border-t border-gray-100 pt-4">
                <h4 className="text-[14px] font-extrabold text-gray-800 mb-3">Location & Contact</h4>
                <div className="space-y-2 text-[11px]">
                  {address && (
                    <div className="flex items-start gap-2">
                      <span className="text-gray-400 font-medium w-16 shrink-0">Address</span>
                      <span className="text-gray-600">{address}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium w-16 shrink-0">Phone</span>
                      <span className="text-[#ea580c]">{phone}</span>
                    </div>
                  )}
                  {whatsapp && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium w-16 shrink-0">WhatsApp</span>
                      <span className="text-green-600">{whatsapp}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-medium w-16 shrink-0">Email</span>
                      <span className="text-gray-600">{email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-4 bg-gray-900 text-white">
              <div className="flex items-center gap-2 mb-3">
                {logo ? (
                  <img src={logo} alt="" className="h-7 w-7 object-contain rounded bg-white/10 p-0.5" />
                ) : (
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded bg-[#ea580c] font-bold text-[9px] text-white">
                    {(title || "R")
                      .split(" ")
                      .map((w: string) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
                <span className="text-[12px] font-bold">{title || "Restaurant"}</span>
              </div>
              <p className="text-[9px] text-gray-400">
                &copy; {new Date().getFullYear()} {title || "Restaurant"}. All rights reserved.
              </p>
              <p className="text-[8px] text-gray-500 mt-0.5">Powered by Citivas Dining & Hospitality</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-400">
              Public link will be: <span className="font-semibold text-gray-600">citivas.com/{restaurantSlug}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-[860px] mx-auto px-8 py-3.5 flex items-center justify-between">
          {step < STEPS.length - 1 ? (
            <>
              <button
                onClick={() => (step === 0 ? navigate("/profile/dashboard?tab=listings") : setStep(step - 1))}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              <div className="text-[11px] text-gray-400 font-medium tracking-wide">
                {lastSaved ? `AUTO-SAVED ${formatTimeAgo(lastSaved)}` : ""}
              </div>
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#ea580c] text-white text-[13px] font-bold hover:bg-[#c2410c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile/dashboard?tab=listings")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-300 text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Exit
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <span className="text-[12px] font-semibold text-gray-700">
                  Step {step + 1} of {STEPS.length}
                </span>
              </div>
              <button
                onClick={() => (termsAccepted ? handleSubmit() : setShowTermsModal(true))}
                disabled={isSubmitting || !canNext()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#ea580c] text-white text-[13px] font-bold hover:bg-[#c2410c] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting ? (
                  isEditing ? "Updating..." : "Publishing..."
                ) : (
                  <>
                    <Check className="w-4 h-4" /> {isEditing ? "Update Restaurant" : "Publish Restaurant"}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-4 flex items-center justify-between text-[11px] text-gray-400 mt-auto pb-16">
        <span>&copy; {new Date().getFullYear()} {title || "Restaurant"}. Powered by Citivas Dining.</span>
        <div className="flex gap-5">
          <a href="/privacy" className="hover:text-gray-600 transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-600 transition-colors">
            Terms of Service
          </a>
          <a href="/contact-support" className="hover:text-gray-600 transition-colors">
            Contact Support
          </a>
        </div>
      </div>

      {/* Terms & Conditions Modal */}
      {showTermsModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTermsModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg mx-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-bold text-gray-900">Restaurant Partner Terms</h2>
                <button
                  onClick={() => {
                    setShowTermsModal(false);
                    setTermsAccepted(false);
                  }}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-[13px] text-gray-500 mt-1">
                Please review and accept our dining partner terms before publishing.
              </p>
            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto text-[13px] text-gray-600 leading-relaxed space-y-4">
              <p>By listing your eatery on Citivas Dining, you agree to the following conditions:</p>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">1. Menu &amp; Pricing Accuracy</h4>
                <p>
                  You agree to keep dish prices, descriptions, and dietary information accurate and up to date. Prices
                  shown to customers on Citivas must reflect current in-restaurant pricing.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">2. Food Safety &amp; Hygiene</h4>
                <p>
                  You affirm that your establishment complies with state and federal food health and hygiene standards,
                  maintaining clean food preparation environments.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">3. Table Reservations &amp; Orders</h4>
                <p>
                  Restaurants must honor confirmed table reservations and pre-orders. Any cancellation must be
                  communicated promptly to guests via registered contact lines.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">4. Commissions &amp; Platform Fees</h4>
                <p>
                  Listing your restaurant is free. Digital table booking processing and promotional campaign fees (if
                  opted in) follow transparent platform payout terms.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">5. Customer Reviews</h4>
                <p>
                  Guests can leave authentic dining reviews and photos. Citivas moderates false or abusive reviews in
                  accordance with our community policies.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 space-y-4">
              <button
                onClick={() => setTermsAccepted(!termsAccepted)}
                className="flex items-center gap-3 text-left group"
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                    termsAccepted
                      ? "bg-[#16a34a] border-[#16a34a]"
                      : "border-gray-300 border-dashed group-hover:border-gray-400"
                  }`}
                >
                  {termsAccepted && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[13px] text-gray-700 font-medium">
                  I accept the Restaurant Partner Terms &amp; Conditions
                </span>
              </button>

              <button
                onClick={() => {
                  setShowTermsModal(false);
                  handleSubmit();
                }}
                disabled={!termsAccepted}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  termsAccepted
                    ? "bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-sm"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Publish Restaurant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
