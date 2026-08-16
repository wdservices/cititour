/**
 * Mini-site catalogue — restaurants, hotels and shortlets that have a
 * CitiTour "mini website" (own page, gallery, menu / rooms, ordering).
 *
 * Every seeded entry is flagged `listedBy: "admin"` so the admin dashboard
 * can identify and remove them. Removals are stored in Firestore
 * (`mini_site_removals/{slug}`) so a delete in the dashboard also hides the
 * mini site inside the app.
 */

export type MiniSiteType = "restaurant" | "hotel" | "shortlet";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  section: string;
  image?: string;
  popular?: boolean;
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  beds: number;
  image?: string;
}

export interface MiniSite {
  slug: string;
  name: string;
  type: MiniSiteType;
  tagline: string;
  description: string;
  cover: string;
  gallery: string[];
  city: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website?: string;
  hours: string;
  rating: number;
  reviews: number;
  priceFrom: number;
  tags: string[];
  amenities: string[];
  menu?: MenuItem[];
  rooms?: RoomType[];
  /** Unified stay/property fields — shared by seeded mini sites and
   *  properties users list from the dashboard, so both render identically. */
  propertyType?: string;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  checkIn?: string;
  checkOut?: string;
  state?: string;
  priceUnit?: string;
  sellerType?: "individual" | "business";
  status?: string;
  hostName?: string;
  listedBy: "admin" | "user";
  listedOn: string;
  /** Firestore id when the mini site comes from a user listing. */
  sourceId?: string;
  sourceCollection?: "house_listings" | "marketplace";
}


const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export const MINI_SITES: MiniSite[] = [
  {
    slug: "the-yellow-chilli-ph",
    name: "The Yellow Chilli",
    type: "restaurant",
    tagline: "Modern Nigerian kitchen • Port Harcourt",
    description:
      "A contemporary Nigerian kitchen plating heritage recipes with a fine-dining finish. Expect smoky jollof from the open fire pit, native soups simmered daily, and a grill counter that runs until midnight.",
    cover: u("1517248135467-4c7edcad34c4"),
    gallery: [u("1414235077428-338989a2e8c0"), u("1552566626-52f8b828add9"), u("1555396273-367ea4eb4db5")],
    city: "Port Harcourt, Rivers",
    address: "18 Olu Obasanjo Road, GRA Phase 2, Port Harcourt",
    phone: "+234 803 111 2233",
    whatsapp: "2348031112233",
    email: "hello@yellowchilliph.ng",
    website: "https://yellowchilliph.ng",
    hours: "Mon–Sun · 11:00 – 23:30",
    rating: 4.8,
    reviews: 412,
    priceFrom: 6500,
    tags: ["Nigerian", "Fine dining", "Delivery"],
    amenities: ["Air conditioned", "Private dining", "Card payments", "Parking", "Live band Fridays"],
    listedBy: "admin",
    listedOn: "2026-01-14",
    menu: [
      { id: "yc-1", name: "Smoky Party Jollof", description: "Firewood jollof rice, grilled chicken, fried plantain.", price: 7500, section: "Mains", popular: true, image: u("1604329760661-e71dc83f8f26", 600) },
      { id: "yc-2", name: "Native Ofada & Ayamase", description: "Ofada rice with green pepper designer stew and assorted meat.", price: 8200, section: "Mains", image: u("1516714435131-44d6b64dc6a2", 600) },
      { id: "yc-3", name: "Seafood Okra", description: "Prawns, periwinkle and snail in a light okra broth.", price: 11500, section: "Soups", popular: true, image: u("1547592180-85f173990554", 600) },
      { id: "yc-4", name: "Egusi Royale", description: "Melon seed soup, goat meat, stockfish. Served with pounded yam.", price: 9800, section: "Soups", image: u("1590301157890-4810ed352733", 600) },
      { id: "yc-5", name: "Peppered Snail", description: "Farm snail tossed in scotch bonnet and onion.", price: 6500, section: "Starters", image: u("1432139555190-58524dae6a55", 600) },
      { id: "yc-6", name: "Suya Spring Rolls", description: "Crisp rolls filled with spiced beef suya.", price: 4800, section: "Starters", image: u("1541014741259-de529411b96a", 600) },
      { id: "yc-7", name: "Chapman Classic", description: "House chapman with citrus and bitters.", price: 3200, section: "Drinks", image: u("1544145945-f90425340c7e", 600) },
      { id: "yc-8", name: "Zobo Spritz", description: "Chilled hibiscus with ginger and pineapple.", price: 2500, section: "Drinks", image: u("1497534446932-c925b458314e", 600) },
    ],
  },
  {
    slug: "kilimanjaro-grill-lagos",
    name: "Kilimanjaro Grill House",
    type: "restaurant",
    tagline: "Charcoal grill & lounge • Lekki",
    description:
      "A charcoal-first grill house on the Lekki strip. Every cut is fired over hardwood and finished with house rubs. Rooftop lounge upstairs, quiet courtyard downstairs.",
    cover: u("1555396273-367ea4eb4db5"),
    gallery: [u("1424847651672-bf20a4b0982b"), u("1466978913421-dad2ebd01d17"), u("1559339352-11d035aa65de")],
    city: "Lekki, Lagos",
    address: "12B Admiralty Way, Lekki Phase 1, Lagos",
    phone: "+234 810 445 9911",
    whatsapp: "2348104459911",
    email: "orders@kilimanjarogrill.ng",
    hours: "Daily · 12:00 – 01:00",
    rating: 4.6,
    reviews: 288,
    priceFrom: 8000,
    tags: ["Grill", "Lounge", "Late night"],
    amenities: ["Rooftop lounge", "Valet parking", "Shisha", "Card payments", "Reservations"],
    listedBy: "admin",
    listedOn: "2026-01-22",
    menu: [
      { id: "kg-1", name: "Full Rack Ribs", description: "Slow smoked pork ribs, house BBQ glaze, fries.", price: 18500, section: "Grill", popular: true, image: u("1544025162-d76694265947", 600) },
      { id: "kg-2", name: "Charcoal Ribeye", description: "300g ribeye, chimichurri, grilled corn.", price: 24000, section: "Grill", image: u("1546964124-0cce460f38ef", 600) },
      { id: "kg-3", name: "Whole Croaker", description: "Grilled croaker fish, pepper sauce, boiled yam.", price: 16000, section: "Grill", popular: true, image: u("1519708227418-c8fd9a32b7a2", 600) },
      { id: "kg-4", name: "Asun Bowl", description: "Smoked goat meat tossed in pepper and onion.", price: 9500, section: "Small plates", image: u("1432139555190-58524dae6a55", 600) },
      { id: "kg-5", name: "Loaded Yam Fries", description: "Yam fries, cheese sauce, suya dust.", price: 5500, section: "Small plates", image: u("1573080496219-bb080dd4f877", 600) },
      { id: "kg-6", name: "Palm Wine Sour", description: "Fresh palm wine, lime, bitters.", price: 4500, section: "Drinks", image: u("1514362545857-3bc16c4c7d1b", 600) },
    ],
  },
  {
    slug: "ile-iyan-abuja",
    name: "Ilé Iyan",
    type: "restaurant",
    tagline: "Pounded yam house • Wuse II",
    description:
      "A no-frills soup kitchen that has fed Abuja for eleven years. Mortar-pounded yam, twelve soups on rotation, and takeaway that leaves in under ten minutes.",
    cover: u("1590301157890-4810ed352733"),
    gallery: [u("1504674900247-0877df9cc836"), u("1476224203421-9ac39bcb3327"), u("1498837167922-ddd27525d352")],
    city: "Abuja, FCT",
    address: "7 Aminu Kano Crescent, Wuse II, Abuja",
    phone: "+234 907 220 8080",
    whatsapp: "2349072208080",
    email: "eat@ileiyan.ng",
    hours: "Mon–Sat · 09:00 – 21:00",
    rating: 4.9,
    reviews: 617,
    priceFrom: 4500,
    tags: ["Local", "Takeaway", "Budget friendly"],
    amenities: ["Takeaway", "Transfer payments", "Family sized portions", "Halal options"],
    listedBy: "admin",
    listedOn: "2026-02-03",
    menu: [
      { id: "ii-1", name: "Pounded Yam & Egusi", description: "Mortar-pounded yam with egusi and assorted meat.", price: 6500, section: "Swallow & Soup", popular: true, image: u("1604329760661-e71dc83f8f26", 600) },
      { id: "ii-2", name: "Amala & Ewedu", description: "Yam flour swallow, ewedu, gbegiri and buka stew.", price: 5800, section: "Swallow & Soup", image: u("1516714435131-44d6b64dc6a2", 600) },
      { id: "ii-3", name: "Banga Soup", description: "Palm fruit soup with catfish, served with starch.", price: 7200, section: "Swallow & Soup", popular: true, image: u("1547592180-85f173990554", 600) },
      { id: "ii-4", name: "Nkwobi", description: "Cow foot in spiced palm oil emulsion.", price: 6800, section: "Small chops", image: u("1432139555190-58524dae6a55", 600) },
      { id: "ii-5", name: "Moi Moi & Pap", description: "Steamed bean pudding with fermented corn pap.", price: 3500, section: "Breakfast", image: u("1565299624946-b28f40a0ae38", 600) },
      { id: "ii-6", name: "Kunu Aya", description: "Chilled tiger nut drink.", price: 1800, section: "Drinks", image: u("1497534446932-c925b458314e", 600) },
    ],
  },
  {
    slug: "cafe-neo-garden-city",
    name: "Café Neo Garden City",
    type: "restaurant",
    tagline: "Coffee, brunch & work-friendly • GRA",
    description:
      "Single-origin Nigerian coffee, all-day brunch and the fastest wifi in GRA. Built for laptop mornings and slow afternoons.",
    cover: u("1501339847302-ac426a4a7cbb"),
    gallery: [u("1445116572660-236099ec97a0"), u("1521017432531-fbd92d768814"), u("1554118811-1e0d58224f24")],
    city: "Port Harcourt, Rivers",
    address: "3 Evo Road, GRA Phase 2, Port Harcourt",
    phone: "+234 802 664 7788",
    whatsapp: "2348026647788",
    email: "hi@cafeneogc.ng",
    hours: "Daily · 07:00 – 22:00",
    rating: 4.5,
    reviews: 193,
    priceFrom: 2500,
    tags: ["Coffee", "Brunch", "Work friendly"],
    amenities: ["Free wifi", "Power backup", "Outdoor seating", "Card payments", "Pet friendly"],
    listedBy: "admin",
    listedOn: "2026-02-11",
    menu: [
      { id: "cn-1", name: "Flat White", description: "Double shot, silky micro-foam.", price: 2800, section: "Coffee", popular: true, image: u("1509042239860-f550ce710b93", 600) },
      { id: "cn-2", name: "Cold Brew Tonic", description: "18h cold brew over tonic and citrus.", price: 3400, section: "Coffee", image: u("1461023058943-07fcbe16d735", 600) },
      { id: "cn-3", name: "Akara Benedict", description: "Bean fritters, poached eggs, pepper hollandaise.", price: 6900, section: "Brunch", popular: true, image: u("1525351484163-7529414344d8", 600) },
      { id: "cn-4", name: "Avocado Toast", description: "Sourdough, smashed avocado, chilli oil.", price: 5600, section: "Brunch", image: u("1541519227354-08fa5d50c44d", 600) },
      { id: "cn-5", name: "Chin Chin Cheesecake", description: "Baked cheesecake with chin chin crumble.", price: 4200, section: "Bakery", image: u("1533134242443-d4fd215305ad", 600) },
    ],
  },
  {
    slug: "the-obelisk-hotel",
    name: "The Obelisk Hotel & Spa",
    type: "hotel",
    tagline: "Five-star city hotel • Old GRA",
    description:
      "A 96-room city hotel with a rooftop infinity pool, full-service spa and two restaurants. Ten minutes from Port Harcourt International.",
    cover: u("1566073771259-6a8506099945"),
    gallery: [u("1582719478250-c89cae4dc85b"), u("1596394516093-501ba68a0ba6"), u("1571003123894-1f0594d2b5d9")],
    city: "Port Harcourt, Rivers",
    address: "1 Forces Avenue, Old GRA, Port Harcourt",
    phone: "+234 700 626 3754",
    whatsapp: "2347006263754",
    email: "reservations@obeliskhotel.ng",
    website: "https://obeliskhotel.ng",
    hours: "Front desk · 24 hours",
    rating: 4.7,
    reviews: 934,
    priceFrom: 145000,
    tags: ["5 star", "Spa", "Pool"],
    amenities: ["Rooftop pool", "Spa & gym", "Airport shuttle", "Business centre", "24h room service", "Free wifi"],
    propertyType: "Hotel room",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    checkIn: "14:00",
    checkOut: "12:00",
    state: "Rivers",
    priceUnit: "night",
    sellerType: "business",
    status: "Published",
    hostName: "The Obelisk Hospitality Group",
    listedBy: "admin",
    listedOn: "2026-01-08",
    rooms: [
      { id: "ob-1", name: "Deluxe King", description: "32 sqm, king bed, city view, work desk.", price: 145000, capacity: 2, beds: 1, image: u("1590490360182-c33d57733427", 600) },
      { id: "ob-2", name: "Executive Suite", description: "58 sqm, separate lounge, lounge access.", price: 265000, capacity: 3, beds: 1, image: u("1618773928121-c32242e63f39", 600) },
      { id: "ob-3", name: "Family Room", description: "45 sqm, two queen beds, breakfast for four.", price: 198000, capacity: 4, beds: 2, image: u("1566665797739-1674de7a421a", 600) },
    ],
  },
  {
    slug: "harbour-point-shortlet",
    name: "Harbour Point Shortlets",
    type: "shortlet",
    tagline: "Serviced apartments • Trans Amadi",
    description:
      "Fully serviced one and two-bedroom apartments with 24-hour power, weekly housekeeping and secure parking. Minimum stay: two nights.",
    cover: u("1600596542815-ffad4c1539a9"),
    gallery: [u("1600607687939-ce8a6c25118c"), u("1600566753086-00f18fb6b3ea"), u("1600585154340-be6161a56a0c")],
    city: "Port Harcourt, Rivers",
    address: "Plot 44 Trans Amadi Industrial Layout, Port Harcourt",
    phone: "+234 806 900 4412",
    whatsapp: "2348069004412",
    email: "stay@harbourpoint.ng",
    hours: "Check-in 14:00 · Check-out 12:00",
    rating: 4.6,
    reviews: 271,
    priceFrom: 68000,
    tags: ["Shortlet", "24h power", "Self check-in"],
    amenities: ["24h power", "Self check-in", "Washer & dryer", "Netflix", "Secure parking", "Housekeeping"],
    propertyType: "Serviced apartment",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    checkIn: "14:00",
    checkOut: "12:00",
    state: "Rivers",
    priceUnit: "night",
    sellerType: "business",
    status: "Published",
    hostName: "Harbour Point Facilities Ltd",
    listedBy: "admin",
    listedOn: "2026-02-01",
    rooms: [
      { id: "hp-1", name: "One Bedroom Deluxe", description: "Open-plan living, fitted kitchen, balcony.", price: 68000, capacity: 2, beds: 1, image: u("1502672260266-1c1ef2d93688", 600) },
      { id: "hp-2", name: "Two Bedroom Premium", description: "Two ensuite rooms, dining space, study nook.", price: 112000, capacity: 4, beds: 2, image: u("1560448204-e02f11c3d0e2", 600) },
    ],
  },
  {
    slug: "aurora-suites-lagos",
    name: "Aurora Suites",
    type: "hotel",
    tagline: "Boutique business hotel • Victoria Island",
    description:
      "Forty-two rooms built for working travellers: soundproofed suites, meeting pods by the hour and a bistro that opens at six.",
    cover: u("1611892440504-42a792e24d32"),
    gallery: [u("1445019980597-93fa8acb246c"), u("1631049307264-da0ec9d70304"), u("1578683010236-d716f9a3f461")],
    city: "Victoria Island, Lagos",
    address: "22 Adeola Odeku Street, Victoria Island, Lagos",
    phone: "+234 809 553 1200",
    whatsapp: "2348095531200",
    email: "book@aurorasuites.ng",
    hours: "Front desk · 24 hours",
    rating: 4.4,
    reviews: 508,
    priceFrom: 132000,
    tags: ["Business", "Boutique", "Bistro"],
    amenities: ["Meeting pods", "Bistro", "Gym", "Laundry", "Free wifi", "Airport pickup"],
    propertyType: "Hotel room",
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    checkIn: "15:00",
    checkOut: "11:00",
    state: "Lagos",
    priceUnit: "night",
    sellerType: "business",
    status: "Published",
    hostName: "Aurora Hospitality",
    listedBy: "admin",
    listedOn: "2026-01-29",
    rooms: [
      { id: "as-1", name: "Studio Queen", description: "28 sqm, queen bed, rain shower.", price: 132000, capacity: 2, beds: 1, image: u("1590490360182-c33d57733427", 600) },
      { id: "as-2", name: "Corner Suite", description: "48 sqm, corner windows, lounge chair.", price: 212000, capacity: 2, beds: 1, image: u("1618773928121-c32242e63f39", 600) },
    ],
  },
  {
    slug: "the-nest-shortlet-abuja",
    name: "The Nest Apartments",
    type: "shortlet",
    tagline: "Designer shortlets • Jabi",
    description:
      "Three architect-furnished apartments overlooking Jabi Lake. Rooftop terrace, private chef on request, and a concierge who answers on the first ring.",
    cover: u("1502672260266-1c1ef2d93688"),
    gallery: [u("1560448204-e02f11c3d0e2"), u("1522708323590-d24dbb6b0267"), u("1493809842364-78817add7ffb")],
    city: "Jabi, Abuja",
    address: "9 Lake Crescent, Jabi District, Abuja",
    phone: "+234 811 700 9090",
    whatsapp: "2348117009090",
    email: "concierge@thenest.ng",
    hours: "Check-in 15:00 · Check-out 11:00",
    rating: 4.9,
    reviews: 148,
    priceFrom: 95000,
    tags: ["Designer", "Lake view", "Concierge"],
    amenities: ["Lake view", "Rooftop terrace", "Private chef", "24h power", "Concierge", "Gated estate"],
    propertyType: "Shortlet apartment",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    checkIn: "15:00",
    checkOut: "11:00",
    state: "FCT",
    priceUnit: "night",
    sellerType: "business",
    status: "Published",
    hostName: "The Nest Concierge",
    listedBy: "admin",
    listedOn: "2026-02-16",
    rooms: [
      { id: "tn-1", name: "Lakeview One Bed", description: "Floor-to-ceiling windows, king bed.", price: 95000, capacity: 2, beds: 1, image: u("1522708323590-d24dbb6b0267", 600) },
      { id: "tn-2", name: "Penthouse Two Bed", description: "Top floor, private terrace, outdoor dining.", price: 175000, capacity: 4, beds: 2, image: u("1493809842364-78817add7ffb", 600) },
    ],
  },
];

export const getMiniSite = (slug?: string) =>
  MINI_SITES.find((s) => s.slug === slug);

/**
 * Tolerant slug matching so a mini site opens whether the link used the
 * stored slug, a name-only slug (e.g. `asemi-shortlets`) or the raw doc id.
 */
export const findMiniSite = <T extends { slug: string; name: string; id?: string }>(
  sites: T[],
  slug?: string
): T | undefined => {
  if (!slug) return undefined;
  const key = slug.toLowerCase();
  return (
    sites.find((s) => s.slug.toLowerCase() === key) ??
    sites.find((s) => slugifyName(s.name) === key) ??
    sites.find((s) => s.slug.toLowerCase().startsWith(key) || key.startsWith(s.slug.toLowerCase())) ??
    sites.find((s) => (s as any).id === slug)
  );
};


export const formatNaira = (value: number) =>
  `₦${value.toLocaleString("en-NG")}`;

export const MINI_SITE_TYPE_LABEL: Record<MiniSiteType, string> = {
  restaurant: "Restaurant",
  hotel: "Hotel",
  shortlet: "Shortlet",
};

export const slugifyName = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "listing";

/** Slug used for user-listed properties: readable name + short doc id. */
export const propertySlug = (title: string, id: string) =>
  `${slugifyName(title)}-${id.slice(0, 6)}`;

const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const str = (v: unknown, fallback = "") =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

/**
 * Maps a Firestore `house_listings` document onto the exact same MiniSite
 * shape the seeded catalogue uses, so a user-created shortlet (e.g. Asemi)
 * and a seeded mini site render with identical fields on `/m/:slug`.
 */
export function propertyDocToMiniSite(id: string, raw: Record<string, any>): MiniSite {
  const name = str(raw.title, "Untitled property");
  const propertyType = str(raw.type ?? raw.propertyType, "Shortlet apartment");
  const city = str(raw.city) || str(raw.location, "Nigeria");
  const state = str(raw.state);
  const cover = str(raw.image ?? raw.imageUrl, "/placeholder.svg");
  const gallery: string[] = Array.isArray(raw.gallery) && raw.gallery.length
    ? raw.gallery.filter((g: unknown) => typeof g === "string")
    : [cover];
  const price = num(raw.pricePerNight ?? raw.priceFrom ?? raw.price);
  const amenities: string[] = Array.isArray(raw.amenities) && raw.amenities.length
    ? raw.amenities
    : ["24h power", "Self check-in", "Free wifi", "Secure parking"];
  const bedrooms = num(raw.bedrooms, 1);
  const bathrooms = num(raw.bathrooms, 1);
  const guests = num(raw.guests, bedrooms * 2);

  return {
    slug: str(raw.slug) || propertySlug(name, id),
    name,
    type: /hotel/i.test(propertyType) ? "hotel" : "shortlet",
    tagline: str(raw.tagline, `${propertyType} • ${[city, state].filter(Boolean).join(", ")}`),
    description: str(
      raw.description,
      `${name} is a ${propertyType.toLowerCase()} in ${city}. Contact the host for availability, rates and check-in details.`
    ),
    cover,
    gallery,
    city: [city, state].filter(Boolean).join(", "),
    address: str(raw.address) || [city, state].filter(Boolean).join(", "),
    phone: str(raw.phone, "+234 000 000 0000"),
    whatsapp: str(raw.whatsapp) || str(raw.phone).replace(/\D/g, ""),
    email: str(raw.email, "hello@cititour.ng"),
    website: str(raw.website) || undefined,
    hours: `Check-in ${str(raw.checkIn, "14:00")} · Check-out ${str(raw.checkOut, "12:00")}`,
    rating: num(raw.rating, 0),
    reviews: num(raw.reviews, 0),
    priceFrom: price,
    tags: Array.isArray(raw.tags) && raw.tags.length ? raw.tags : [propertyType, city].filter(Boolean),
    amenities,
    rooms: [
      {
        id: `${id}-unit`,
        name: `${bedrooms} bedroom ${propertyType.toLowerCase()}`,
        description: `${bedrooms} bedroom · ${bathrooms} bathroom · sleeps ${guests}.`,
        price,
        capacity: guests,
        beds: bedrooms,
        image: cover,
      },
    ],
    propertyType,
    guests,
    bedrooms,
    bathrooms,
    checkIn: str(raw.checkIn, "14:00"),
    checkOut: str(raw.checkOut, "12:00"),
    state,
    priceUnit: str(raw.priceUnit, "night"),
    sellerType: raw.sellerType === "business" ? "business" : "individual",
    status: str(raw.status, "Published"),
    hostName: str(raw.hostName ?? raw.ownerName, "CitiTour host"),
    listedBy: "user",
    listedOn:
      typeof raw.createdAt?.toDate === "function"
        ? raw.createdAt.toDate().toISOString()
        : str(raw.listedOn, new Date().toISOString()),
    sourceId: id,
    sourceCollection: "house_listings",
  };
}

/** Convert a marketplace listing (property/shortlet/hotel) to MiniSite shape. */
export function marketplaceDocToMiniSite(id: string, raw: Record<string, any>): MiniSite {
  const name = str(raw.title, "Untitled property");
  const category = str(raw.category, "Property").toLowerCase();
  const isProperty = /property|shortlet|hotel|apartment|house|real.estate/i.test(category);
  const propertyType = isProperty ? str(raw.category, "Shortlet apartment") : "Shortlet apartment";
  const city = str(raw.city) || str(raw.location, "Nigeria");
  const state = str(raw.state);
  const cover = str(raw.image, "/placeholder.svg");
  const gallery: string[] = Array.isArray(raw.images) && raw.images.length
    ? raw.images.filter((g: unknown) => typeof g === "string")
    : [cover];
  const price = num(raw.pricePerNight ?? raw.priceFrom ?? raw.price);
  const amenities: string[] = Array.isArray(raw.amenities) && raw.amenities.length
    ? raw.amenities
    : ["24h power", "Self check-in", "Free wifi", "Secure parking"];
  const bedrooms = num(raw.bedrooms, 1);
  const bathrooms = num(raw.bathrooms, 1);
  const guests = num(raw.guests, bedrooms * 2);

  return {
    slug: str(raw.slug) || propertySlug(name, id),
    name,
    type: /hotel/i.test(propertyType) ? "hotel" : "shortlet",
    tagline: str(raw.tagline, `${propertyType} • ${[city, state].filter(Boolean).join(", ")}`),
    description: str(
      raw.description,
      `${name} is a ${propertyType.toLowerCase()} in ${city}. Contact the host for availability, rates and check-in details.`
    ),
    cover,
    gallery,
    city: [city, state].filter(Boolean).join(", "),
    address: str(raw.address) || [city, state].filter(Boolean).join(", "),
    phone: str(raw.phone, "+234 000 000 0000"),
    whatsapp: str(raw.whatsapp) || str(raw.phone).replace(/\D/g, ""),
    email: str(raw.email, "hello@cititour.ng"),
    website: str(raw.website) || undefined,
    hours: `Check-in ${str(raw.checkIn, "14:00")} · Check-out ${str(raw.checkOut, "12:00")}`,
    rating: num(raw.rating, 0),
    reviews: num(raw.reviews, 0),
    priceFrom: price,
    tags: Array.isArray(raw.tags) && raw.tags.length ? raw.tags : [propertyType, city].filter(Boolean),
    amenities,
    rooms: [
      {
        id: `${id}-unit`,
        name: `${bedrooms} bedroom ${propertyType.toLowerCase()}`,
        description: `${bedrooms} bedroom · ${bathrooms} bathroom · sleeps ${guests}.`,
        price,
        capacity: guests,
        beds: bedrooms,
        image: cover,
      },
    ],
    propertyType,
    guests,
    bedrooms,
    bathrooms,
    checkIn: str(raw.checkIn, "14:00"),
    checkOut: str(raw.checkOut, "12:00"),
    state,
    priceUnit: str(raw.priceUnit, "night"),
    sellerType: raw.sellerType === "business" ? "business" : "individual",
    status: str(raw.status, "Published"),
    hostName: str(raw.hostName ?? raw.ownerName, "CitiTour host"),
    listedBy: "user",
    listedOn:
      typeof raw.createdAt?.toDate === "function"
        ? raw.createdAt.toDate().toISOString()
        : str(raw.listedOn, new Date().toISOString()),
    sourceId: id,
    sourceCollection: "marketplace",
  };
}
