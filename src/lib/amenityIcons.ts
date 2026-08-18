import {
  Wifi, Car, Dumbbell, Shield, Waves, CalendarClock, Utensils, Coffee,
  Wind, Zap, WashingMachine, Tv, Sparkles, ConciergeBell, Eye, Trees,
  ChefHat, ParkingSquare, GlassWater, Music, Baby, Dog, Snowflake,
  Shirt, KeyRound, Headphones, Building2, Bath, ShowerHead,
  BedDouble, Armchair, Lamp, Refrigerator, Mic, PartyPopper, Users,
  Briefcase, Phone, Mail, Globe, MapPin, Clock, Star, Heart,
  Camera, Gem, Crown, CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface AmenityInfo {
  icon: LucideIcon;
  label: string;
  description: string;
}

const AMENITY_MAP: Record<string, AmenityInfo> = {
  // Connectivity
  "free wifi": { icon: Wifi, label: "Free Wi-Fi", description: "High-speed internet throughout the property" },
  "wifi": { icon: Wifi, label: "Wi-Fi", description: "Wireless internet access" },
  "fast wifi": { icon: Wifi, label: "Fast Wi-Fi", description: "High-speed wireless internet" },

  // Parking
  "parking": { icon: ParkingSquare, label: "Parking", description: "On-site parking available" },
  "secure parking": { icon: ParkingSquare, label: "Secure Parking", description: "Gated parking with 24/7 surveillance" },
  "valet parking": { icon: Car, label: "Valet Parking", description: "Complimentary valet parking service" },
  "free parking": { icon: ParkingSquare, label: "Free Parking", description: "Complimentary on-site parking" },

  // Fitness & Wellness
  "gym": { icon: Dumbbell, label: "Fitness Center", description: "24/7 access with modern equipment" },
  "spa & gym": { icon: Dumbbell, label: "Spa & Gym", description: "Full-service spa and fitness center" },
  "spa": { icon: Sparkles, label: "Spa Services", description: "Relaxing treatments and massages" },
  "fitness center": { icon: Dumbbell, label: "Fitness Center", description: "State-of-the-art gym facilities" },

  // Pool
  "pool": { icon: Waves, label: "Swimming Pool", description: "Outdoor pool with poolside service" },
  "rooftop pool": { icon: Waves, label: "Rooftop Pool", description: "Infinity pool with panoramic views" },
  "swimming pool": { icon: Waves, label: "Swimming Pool", description: "Temperature-controlled swimming pool" },

  // Security
  "24/7 security": { icon: Shield, label: "24/7 Security", description: "Professional security services" },
  "security": { icon: Shield, label: "Security", description: "Round-the-clock security coverage" },
  "gated estate": { icon: Shield, label: "Gated Estate", description: "Secure gated community" },

  // Power
  "24h power": { icon: Zap, label: "24-Hour Power", description: "Uninterrupted power supply" },
  "power backup": { icon: Zap, label: "Power Backup", description: "Backup generator for outages" },
  "constant power": { icon: Zap, label: "Constant Power", description: "24/7 electricity supply" },

  // Dining
  "restaurant": { icon: Utensils, label: "Restaurant", description: "On-site dining with diverse menu" },
  "breakfast": { icon: Coffee, label: "Breakfast Included", description: "Complimentary breakfast each morning" },
  "room service": { icon: ConciergeBell, label: "Room Service", description: "24-hour in-room dining" },
  "24h room service": { icon: ConciergeBell, label: "24h Room Service", description: "Round-the-clock in-room dining" },
  "kitchen": { icon: Refrigerator, label: "Full Kitchen", description: "Equipped kitchen with appliances" },
  "private chef": { icon: ChefHat, label: "Private Chef", description: "Personal chef available on request" },
  "bar": { icon: GlassWater, label: "Bar & Lounge", description: "Full-service bar with craft cocktails" },
  "bistro": { icon: Coffee, label: "Bistro", description: "Casual dining from early morning" },

  // Entertainment
  "netflix": { icon: Tv, label: "Netflix", description: "Smart TV with Netflix streaming" },
  "tv": { icon: Tv, label: "Smart TV", description: "Flat-screen TV with cable channels" },
  "live band fridays": { icon: Music, label: "Live Music", description: "Live band performances on Fridays" },
  "shisha": { icon: Coffee, label: "Shisha Lounge", description: "Premium shisha flavors available" },

  // Comfort
  "air conditioned": { icon: Snowflake, label: "Air Conditioning", description: "Climate-controlled rooms" },
  "air conditioning": { icon: Snowflake, label: "Air Conditioning", description: "Full air conditioning throughout" },
  "laundry": { icon: Shirt, label: "Laundry Service", description: "Professional laundry and dry cleaning" },
  "washer & dryer": { icon: WashingMachine, label: "Washer & Dryer", description: "In-unit laundry appliances" },
  "housekeeping": { icon: Sparkles, label: "Housekeeping", description: "Daily professional housekeeping" },

  // Business
  "business centre": { icon: Briefcase, label: "Business Center", description: "Meeting rooms and office facilities" },
  "meeting pods": { icon: Briefcase, label: "Meeting Pods", description: "Private meeting spaces by the hour" },
  "co-working": { icon: Briefcase, label: "Co-Working Space", description: "Dedicated workspace with fast Wi-Fi" },

  // Services
  "airport shuttle": { icon: Car, label: "Airport Shuttle", description: "Complimentary airport transfers" },
  "airport pickup": { icon: Car, label: "Airport Pickup", description: "Airport pick-up service available" },
  "concierge": { icon: ConciergeBell, label: "Concierge", description: "Personal concierge assistance" },
  "self check-in": { icon: KeyRound, label: "Self Check-in", description: "Keyless self check-in available" },
  "front desk": { icon: ConciergeBell, label: "24h Front Desk", description: "Reception open around the clock" },

  // Views & Location
  "lake view": { icon: Eye, label: "Lake View", description: "Scenic views of the lake" },
  "city view": { icon: Building2, label: "City View", description: "Panoramic city skyline views" },
  "rooftop terrace": { icon: Trees, label: "Rooftop Terrace", description: "Open-air rooftop with seating" },
  "outdoor seating": { icon: Trees, label: "Outdoor Seating", description: "Al fresco dining area" },
  "garden": { icon: Trees, label: "Garden", description: "Landscaped garden area" },

  // Family
  "family friendly": { icon: Baby, label: "Family Friendly", description: "Facilities for children and families" },
  "kids play area": { icon: Baby, label: "Kids Play Area", description: "Dedicated children's play zone" },
  "pet friendly": { icon: Dog, label: "Pet Friendly", description: "Pets welcome at the property" },

  // Payments
  "card payments": { icon: CreditCard, label: "Card Payments", description: "Accepts debit and credit cards" },
  "transfer payments": { icon: Phone, label: "Transfer Payments", description: "Bank transfer accepted" },

  // Food-specific
  "takeaway": { icon: Utensils, label: "Takeaway", description: "Order and pick up to go" },
  "delivery": { icon: Car, label: "Delivery", description: "Home delivery available" },
  "halal options": { icon: Utensils, label: "Halal Options", description: "Halal-certified menu items" },
  "family sized portions": { icon: Users, label: "Family Portions", description: "Large portions for sharing" },
  "reservations": { icon: CalendarClock, label: "Reservations", description: "Book your table in advance" },
  "private dining": { icon: Utensils, label: "Private Dining", description: "Exclusive private dining rooms" },

  // Misc
  "elevator": { icon: Building2, label: "Elevator", description: " elevator access to all floors" },
  "wheelchair accessible": { icon: Building2, label: "Accessible", description: "Wheelchair accessible facilities" },
};

// Alias for card payments
const CreditCardIcon = CreditCard;

/**
 * Get icon info for an amenity string. Tries exact match first,
 * then partial match against the map keys.
 */
export function getAmenityInfo(amenity: string): AmenityInfo {
  const lower = amenity.toLowerCase().trim();

  // Exact match
  if (AMENITY_MAP[lower]) return AMENITY_MAP[lower];

  // Partial match - check if any key is contained in the amenity string
  for (const [key, info] of Object.entries(AMENITY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return info;
  }

  // Fallback: return the amenity as-is with a generic icon
  return {
    icon: Sparkles,
    label: amenity,
    description: amenity,
  };
}
