export const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT (Abuja)",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number];

export const STATE_CITIES: Record<NigerianState, string[]> = {
  Abia: ["Aba", "Umuahia", "Ohafia", "Arochukwu"],
  "Adamawa": ["Yola", "Mubi", "Jimeta", "Numan"],
  "Akwa Ibom": ["Uyo", "Eket", "Ikot Ekpene", "Abak"],
  Anambra: ["Awka", "Onitsha", "Nnewi", "Nkwerre"],
  Bauchi: ["Bauchi", "Azare", "Misau", "Jama'are"],
  Bayelsa: ["Yenagoa", "Brass", "Ogbia", "Sagbama"],
  Benue: ["Makurdi", "Gboko", "Otukpo", "Vandeikya"],
  Borno: ["Maiduguri", "Biu", "Bama", "Damboa"],
  "Cross River": ["Calabar", "Ogoja", "Ikom", "Ugep"],
  Delta: ["Warri", "Sapele", "Asaba", "Ughelli"],
  Ebonyi: ["Abakaliki", "Afikpo", "Onueke", "Ishieke"],
  Edo: ["Benin City", "Auchi", "Ekpoma", "Igarra"],
  Ekiti: ["Ado-Ekiti", "Ikere-Ekiti", "Oye-Ekiti", "Iworoko"],
  Enugu: ["Enugu", "Nsukka", "Oji River", "Agbani"],
  "FCT (Abuja)": ["Garki", "Wuse", "Maitama", "Jabi", "Lugbe", "Kubwa", "Gwarinpa", "Life Camp"],
  Gombe: ["Gombe", "Bajoga", "Kaltungo", "Deba"],
  Imo: ["Owerri", "Orlu", "Okigwe", "Mbaise"],
  Jigawa: ["Dutse", "Hadejia", "Kazaure", "Gumel"],
  Kaduna: ["Kaduna", "Zaria", "Kafanchan", "Saminaka"],
  Kano: ["Kano", "Rano", "Gaya", "Dambatta"],
  Katsina: ["Katsina", "Daura", "Funtua", "Malumfashi"],
  Kebbi: ["Birnin Kebbi", "Argungu", "Yauri", "Zuru"],
  Kogi: ["Lokoja", "Okene", "Kabba", "Idah"],
  Kwara: ["Ilorin", "Offa", "Omu-Aran", "Patigi"],
  Lagos: ["Lagos Island", "Ikeja", "Lekki", "Ikoyi", "Victoria Island", "Surulere", "Yaba", "Ajah", "Maryland", "Ikorodu", "Badagry"],
  Nasarawa: ["Lafia", "Akwanga", "Keffi", "Nasarawa"],
  Niger: ["Minna", "Bida", "Kontagora", "Suleja"],
  Ogun: ["Abeokuta", "Ijebu-Ode", "Sango Ota", "Ilaro"],
  Ondo: ["Akure", "Ondo City", "Owo", "Ikare"],
  Osun: ["Osogbo", "Ile-Ife", "Ilesa", "Ede"],
  Oyo: ["Ibadan", "Oyo", "Ogbomoso", "Iseyin"],
  Plateau: ["Jos", "Bukuru", "Shendam", "Pankshin"],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny", "Trans Amadi", "GRA Phase 2", "GRA Phase 3", "D/Line"],
  Sokoto: ["Sokoto", "Tambuwal", "Gwadabawa", "Illela"],
  Taraba: ["Jalingo", "Wukari", "Bali", "Gembu"],
  Yobe: ["Damaturu", "Potiskum", "Gujba", "Nguru"],
  Zamfara: ["Gusau", "Kaura Namoda", "Talata Mafara", "Anka"],
};

export const BUSINESS_CATEGORIES = [
  "Restaurant",
  "Hotel",
  "Bakery",
  "Tech",
  "Salon",
  "Fashion",
  "Fitness",
  "Pharmacy",
  "Supermarket",
  "Auto Repair",
  "Event Venue",
  "Entertainment",
  "Business Services",
  "Other",
] as const;

export const PROPERTY_TYPES = [
  "Shortlet",
  "Apartment",
  "House",
  "Land",
  "Villa",
  "Studio",
  "Commercial",
  "Other",
] as const;

export type PropertySubType = "rent" | "shortlet" | "hotel" | "land" | "commercial";

export const PROPERTY_SUB_TYPES: { value: PropertySubType; label: string; icon: string; desc: string }[] = [
  { value: "rent", label: "For Rent", icon: "🏠", desc: "Long-term lease — apartment, house, duplex" },
  { value: "shortlet", label: "Short-let / Airbnb", icon: "🌙", desc: "Nightly or weekly stays" },
  { value: "hotel", label: "Hotel / Serviced Apt", icon: "🏨", desc: "Room-based with multiple room types" },
  { value: "land", label: "Land", icon: "📐", desc: "Plots for sale or lease" },
  { value: "commercial", label: "Commercial", icon: "🏪", desc: "Offices, shops, warehouses" },
];

export const RENT_BILLING_PERIODS = ["Monthly", "Quarterly", "Annually"] as const;
export const FURNISHING_OPTIONS = ["Unfurnished", "Part-furnished", "Fully Furnished"] as const;
export const LAND_TITLE_TYPES = [
  "C of O (Certificate of Occupancy)", "Governor's Consent", "Excision",
  "Gazette", "Survey Plan", "Deed of Assignment", "Other",
] as const;
export const LAND_SIZE_UNITS = ["sqm", "acres", "plots", "hectares"] as const;
export const COMMERCIAL_USAGES = ["Office", "Retail", "Warehouse", "Event Space", "Hospitality", "Other"] as const;
export const PROPERTY_AMENITIES = [
  { id: "wifi", label: "WiFi", icon: "📶" },
  { id: "parking", label: "Parking", icon: "🚗" },
  { id: "pool", label: "Swimming Pool", icon: "🏊" },
  { id: "kitchen", label: "Full Kitchen", icon: "🍳" },
  { id: "gym", label: "Gym / Fitness", icon: "💪" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "ac", label: "Air Conditioning", icon: "❄️" },
  { id: "tv", label: "Smart TV", icon: "📺" },
  { id: "generator", label: "Generator", icon: "⚡" },
  { id: "security", label: "24/7 Security", icon: "🔒" },
  { id: "water", label: "Water Supply", icon: "💧" },
  { id: "restaurant", label: "Restaurant", icon: "🍽️" },
  { id: "breakfast", label: "Breakfast Included", icon: "🥐" },
  { id: "room_service", label: "Room Service", icon: "🛎️" },
  { id: "spa", label: "Spa", icon: "💆" },
] as const;

export const EVENT_CATEGORIES = [
  "Food & Drink",
  "Technology",
  "Music & Entertainment",
  "Arts & Culture",
  "Business",
  "Sports & Recreation",
  "Fashion",
  "Education",
  "Other",
] as const;

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Vehicles",
  "Property",
  "Beauty",
  "Sports",
  "Other",
] as const;
