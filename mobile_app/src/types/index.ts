// Type definitions for mobile app

export interface Business {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  rating?: number;
  reviews?: number;
  price?: string;
  location?: string;
  address?: string;
  phone?: string;
  website?: string;
  whatsapp?: string;
  latitude?: number;
  longitude?: number;
  isOpen?: boolean;
  hours?: string;
  features?: string[];
  isVerified?: boolean;
  tags?: string[];
  ownerId: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  isActive?: boolean;
  createdAt?: any;
  isFeatured?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  tags?: string[];
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime?: string;
  location: string;
  venue?: string;
  address?: string;
  ticketTypes: TicketTier[];
  capacity?: number;
  ticketsSold?: number;
  status?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  organizer?: string;
  organizerId: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  createdAt?: any;
}

export interface TicketTier {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  sold?: number;
  description?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  category: string;
  price: number;
  promoPrice?: number;
  currency?: string;
  location?: string;
  city?: string;
  state?: string;
  phone?: string;
  whatsapp?: string;
  ownerId: string;
  badge?: string;
  badgeColor?: string;
  rating?: number;
  reviews?: number;
  isActive?: boolean;
  createdAt?: any;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  image: string;
  images?: string[];
  propertyType: string;
  price: number;
  currency?: string;
  location: string;
  city?: string;
  state?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  amenities?: string[];
  ownerId: string;
  isActive?: boolean;
  isFeatured?: boolean;
  createdAt?: any;
}

export interface TicketOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  ownerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  ticketTier: string;
  quantity: number;
  amount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  createdAt: any;
}

export interface Review {
  id: string;
  targetId: string;
  targetType: 'business' | 'product' | 'event' | 'property';
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phone?: string;
  location?: string
  favorites?: string[];
  walletBalance?: number;
  isVerified?: boolean;
  createdAt?: any;
}

export interface NigerianState {
  name: string;
  cities: string[];
}

export const NIGERIAN_STATES: NigerianState[] = [
  { name: 'Abia', cities: ['Aba', 'Umuahia', 'Ohafia', 'Arochukwu'] },
  { name: 'Adamawa', cities: ['Yola', 'Mubi', 'Jimeta', 'Numan'] },
  { name: 'Akwa Ibom', cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Abak'] },
  { name: 'Anambra', cities: ['Awka', 'Onitsha', 'Nnewi', 'Nkwerre'] },
  { name: 'Bauchi', cities: ['Bauchi', 'Azare', 'Misau', "Jama'are"] },
  { name: 'Bayelsa', cities: ['Yenagoa', 'Brass', 'Ogbia', 'Sagbama'] },
  { name: 'Benue', cities: ['Makurdi', 'Gboko', 'Otukpo', 'Vandeikya'] },
  { name: 'Borno', cities: ['Maiduguri', 'Biu', 'Bama', 'Gwoza'] },
  { name: 'Cross River', cities: ['Calabar', 'Ogoja', 'Ikom', 'Obudu'] },
  { name: 'Delta', cities: ['Asaba', 'Warri', 'Sapele', 'Agbor'] },
  { name: 'Ebonyi', cities: ['Abakaliki', 'Afikpo', 'Onueke', 'Uburu'] },
  { name: 'Edo', cities: ['Benin City', 'Ekpoma', 'Auchi', 'Uromi'] },
  { name: 'Ekiti', cities: ['Ado Ekiti', 'Ikere Ekiti', 'Ijero Ekiti', 'Oye Ekiti'] },
  { name: 'Enugu', cities: ['Enugu', 'Nsukka', 'Oji River', 'Udi'] },
  { name: 'FCT (Abuja)', cities: ['Abuja', 'Gwagwalada', 'Kuje', 'Bwari'] },
  { name: 'Gombe', cities: ['Gombe', 'Bajoga', 'Kaltungo', "Dukku"] },
  { name: 'Imo', cities: ['Owerri', 'Orlu', 'Okigwe', 'Mbaise'] },
  { name: 'Jigawa', cities: ['Dutse', 'Hadejia', 'Gumel', 'Kazaure'] },
  { name: 'Kaduna', cities: ['Kaduna', 'Zaria', 'Kafanchan', 'Kachia'] },
  { name: 'Kano', cities: ['Kano', 'Wudil', 'Bichi', 'Rano'] },
  { name: 'Katsina', cities: ['Katsina', 'Funtua', 'Daura', 'Malumfashi'] },
  { name: 'Kebbi', cities: ['Birnin Kebbi', 'Argungu', 'Yauri', 'Zuru'] },
  { name: 'Kogi', cities: ['Lokoja', 'Okene', 'Kabba', 'Idah'] },
  { name: 'Kwara', cities: ['Ilorin', 'Offa', 'Omu-Aran', 'Lafiagi'] },
  { name: 'Lagos', cities: ['Lagos', 'Ikeja', 'Badagry', 'Epe', 'Ikorodu'] },
  { name: 'Nasarawa', cities: ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa'] },
  { name: 'Niger', cities: ['Minna', 'Bida', 'Kontagora', 'Suleja'] },
  { name: 'Ogun', cities: ['Abeokuta', 'Ijebu Ode', 'Sagamu', 'Ifo'] },
  { name: 'Ondo', cities: ['Akure', 'Ondo', 'Okitipupa', 'Owo'] },
  { name: 'Osun', cities: ['Osogbo', 'Ile Ife', 'Ilesa', 'Ede'] },
  { name: 'Oyo', cities: ['Ibadan', 'Oyo', 'Ogbomoso', 'Saki'] },
  { name: 'Plateau', cities: ['Jos', 'Barkin Ladi', 'Pankshin', 'Shendam'] },
  { name: 'Rivers', cities: ['Port Harcourt', 'Bonny', 'Degema', 'Ahoada'] },
  { name: 'Sokoto', cities: ['Sokoto', 'Wurno', 'Isa', 'Gwadabawa'] },
  { name: 'Taraba', cities: ['Jalingo', 'Bali', 'Gashaka', 'Sardauna'] },
  { name: 'Yobe', cities: ['Damaturu', 'Potiskum', 'Nguru', 'Gashua'] },
  { name: 'Zamfara', cities: ['Gusau', 'Kaura Namoda', 'Maradun', 'Anka'] },
] as const;

export type NigerianState = (typeof NIGERIAN_STATES)[number]['name'];

export const BUSINESS_CATEGORIES = [
  'Restaurant', 'Hotel', 'Shopping', 'Attraction', 'Fun Places', 'Airbnb', 'Lifestyle', 'Others',
  'Event Venue', 'Entertainment', 'Spa & Wellness', 'Business Services',
] as const;

export const PROPERTY_TYPES = [
  'Apartment', 'House', 'Land', 'Commercial', 'Shortlet', 'Hostel',
] as const;

export const EVENT_CATEGORIES = [
  'Food & Drink', 'Technology', 'Music & Entertainment', 'Arts & Culture',
  'Business', 'Sports & Recreation', 'General',
] as const;

export const MARKETPLACE_CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Vehicles', 'Property', 'Health & Beauty', 'Sports', 'Books', 'Other',
] as const;