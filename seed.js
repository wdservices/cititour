/**
 * Citivas Database Seed Script
 * Populates a fresh Firestore database with realistic nested business structures,
 * browse/search index collections, sample users, wallets, admin users, and app settings.
 *
 * Requirements:
 * - serviceAccountKey.json in the same directory (or GOOGLE_APPLICATION_CREDENTIALS)
 * - Run with: node seed.js
 */

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Locate and initialize Firebase Admin SDK
const keyPath = path.resolve(__dirname, 'serviceAccountKey.json');

if (!fs.existsSync(keyPath) && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('\n❌ ERROR: serviceAccountKey.json not found!');
  console.error(`Expected service account file at: ${keyPath}`);
  console.error('\nPlease download your private service account key from:');
  console.error('Firebase Console -> Project Settings -> Service Accounts -> "Generate new private key"');
  console.error('Save it as "serviceAccountKey.json" in this directory, then rerun: node seed.js\n');
  process.exit(1);
}

const serviceAccount = fs.existsSync(keyPath)
  ? JSON.parse(fs.readFileSync(keyPath, 'utf8'))
  : undefined;

initializeApp({
  credential: serviceAccount ? cert(serviceAccount) : applicationDefault()
});

const db = getFirestore();
const serverTimestamp = FieldValue.serverTimestamp;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

// Counters for final reporting - pure business subcollections only
const stats = {
  businesses: 0,
  properties: 0,
  rooms: 0,
  restaurants: 0,
  menuItems: 0,
  products: 0,
  events: 0,
  ticketTypes: 0,
  users: 0,
  wallets: 0,
  transactions: 0,
  admin_users: 0,
  app_settings: 0,
  // Legacy top-level collections (mirror writes so dashboard / listing pages have data)
  house_listings: 0,
  marketplace: 0,
  top_level_events: 0,
};

// Known Nigerian state → lat/lon for realistic GIS seeds
const STATE_COORDS = {
  'Lagos':          { lat: 6.5244,  lon: 3.3792 },
  'Abuja':          { lat: 9.0579,  lon: 7.4951 },
  'Port Harcourt':  { lat: 4.8156,  lon: 7.0498 },
  'Kaduna':         { lat: 10.5105, lon: 7.4166 },
  'Owerri':         { lat: 5.4832,  lon: 7.0335 },
  'Kano':           { lat: 12.0022, lon: 8.5911 },
  'Rivers':         { lat: 4.8156,  lon: 7.0498 },
  'FCT (Abuja)':    { lat: 9.0579,  lon: 7.4951 },
};

// High-quality sample stock photos
const SAMPLE_PHOTOS = {
  shortletLagos: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80'
  ],
  shortletAbuja: [
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80'
  ],
  shortletBeach: [
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80'
  ],
  rent: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
  ],
  land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80'
  ],
  commercial: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
  ],
  restaurantBole: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
  ],
  restaurantGrill: [
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80'
  ],
  foodStarters: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
  foodMains: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  foodDrinks: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
  foodDessert: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80',
  electronics: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80'
  ],
  fashion: [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
  ],
  home: [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
  ],
  vehicles: [
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
  ],
  events: [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
  ]
};

async function seedDatabase() {
  console.log('====================================================');
  console.log('🚀 STARTING CITIVAS FIRESTORE SEED SCRIPT');
  console.log('Project ID:', serviceAccount?.project_id || '(detected default)');
  console.log('====================================================\n');

  // =========================================================================
  // 1. APP SETTINGS
  // =========================================================================
  console.log('⚙️  Creating App Platform Settings...');
  const appSettingsRef = db.collection('app_settings').doc('platform_defaults');
  await appSettingsRef.set({
    withdrawalFeePercent: 0.015,
    ticketCommissionRate: 0.07,
    bookingCommissionRate: 0.07,
    supportEmail: 'support@citivas.ng',
    supportPhone: '+234 800 CITIVAS',
    currency: 'NGN',
    minWithdrawalAmount: 2000,
    maintenanceMode: false,
    createdAt: serverTimestamp()
  });
  stats.app_settings++;
  console.log('   ✓ app_settings/platform_defaults created.');

  // =========================================================================
  // 2. USERS & WALLETS
  // =========================================================================
  console.log('\n👥 Creating Sample Users & Wallets...');
  const sampleUsersData = [
    {
      name: 'Chinedu Okonkwo',
      email: 'chinedu.okonkwo@example.com',
      balance: 145000,
      transactions: [
        { type: 'credit', amount: 200000, description: 'Direct Wallet Funding via Paystack', method: 'card', status: 'successful' },
        { type: 'debit', amount: 55000, description: 'Booking payment for Victoria Island Suite', method: 'wallet', status: 'successful' }
      ]
    },
    {
      name: 'Amina Bello',
      email: 'amina.bello@example.com',
      balance: 82500,
      transactions: [
        { type: 'credit', amount: 100000, description: 'Bank Transfer Top-up', method: 'transfer', status: 'successful' },
        { type: 'debit', amount: 17500, description: 'Afrobeats Night VIP Ticket Purchase', method: 'wallet', status: 'successful' }
      ]
    },
    {
      name: 'Babajide Adeleke',
      email: 'babajide.adeleke@example.com',
      balance: 310000,
      transactions: [
        { type: 'credit', amount: 350000, description: 'Online Deposit', method: 'card', status: 'successful' },
        { type: 'debit', amount: 40000, description: 'Dinner Reservation and Bole Order', method: 'wallet', status: 'successful' }
      ]
    },
    {
      name: 'Ngozi Eze',
      email: 'ngozi.eze@example.com',
      balance: 45000,
      transactions: [
        { type: 'credit', amount: 50000, description: 'Promo bonus credit', method: 'system', status: 'successful' },
        { type: 'debit', amount: 5000, description: 'Listing promotion fee', method: 'wallet', status: 'successful' }
      ]
    }
  ];

  const createdUserIds = [];

  for (const u of sampleUsersData) {
    const userRef = db.collection('users').doc();
    const userId = userRef.id;
    createdUserIds.push(userId);

    await userRef.set({
      name: u.name,
      email: u.email,
      createdAt: serverTimestamp(),
      lastSeenAt: serverTimestamp()
    });
    stats.users++;

    // Wallet
    const walletRef = db.collection('wallets').doc(userId);
    await walletRef.set({
      userId: userId,
      balance: u.balance,
      createdAt: serverTimestamp()
    });
    stats.wallets++;

    // Wallet Transactions
    for (const tx of u.transactions) {
      const txRef = walletRef.collection('transactions').doc();
      await txRef.set({
        userId: userId,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        method: tx.method,
        status: tx.status,
        createdAt: serverTimestamp()
      });
      stats.transactions++;
    }
  }
  console.log(`   ✓ Created ${stats.users} users, ${stats.wallets} wallets with ${stats.transactions} transactions.`);

  // =========================================================================
  // 3. ADMIN USERS
  // =========================================================================
  console.log('\n🛡️  Creating Sample Admin User...');
  const adminRef = db.collection('admin_users').doc();
  await adminRef.set({
    uid: adminRef.id,
    email: 'Spellz49@gmail.com',
    displayName: 'Citivas Super Administrator',
    role: 'admin',
    createdAt: serverTimestamp()
  });
  stats.admin_users++;
  console.log(`   ✓ Admin user document created: Spellz49@gmail.com (id: ${adminRef.id})`);

  // =========================================================================
  // 4. BUSINESSES & NESTED STRUCTURES
  // =========================================================================
  console.log('\n🏢 Creating 10 Sample Businesses across Nigeria...');

  const businessesSeed = [
    // 1. Hotel - Lagos
    {
      businessName: 'Eko Grand Suites & Apartments',
      category: 'Hotel',
      description: 'Luxury serviced apartments and boutique shortlets in the heart of Victoria Island Lagos.',
      address: '14 Karimu Kotun Street, Victoria Island',
      state: 'Lagos',
      city: 'Lagos',
      contactPhone: '+234 803 219 4001',
      contactEmail: 'reservations@ekogrand.ng',
      logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      verified: true,
      properties: [
        {
          type: 'shortlet',
          title: 'The Diplomatic Penthouse with Sea View',
          description: 'Spacious 3-bedroom luxury penthouse overlooking Atlantic coastline with round-the-clock concierge and private elevator.',
          address: '14 Karimu Kotun Street, Victoria Island',
          state: 'Lagos',
          city: 'Lagos',
          price: 180000,
          pricePerNight: 180000,
          photos: SAMPLE_PHOTOS.shortletLagos,
          guestsCapacity: 6,
          bedrooms: 3,
          bathrooms: 3.5,
          minimumStayNights: 2,
          amenities: ['High-speed Wi-Fi', '24/7 Power Supply', 'Swimming Pool', 'Gym', 'Chef on Demand', 'Covered Parking'],
          rooms: [
            { name: 'Presidential Master Suite', pricePerNight: 90000, totalRooms: 1, maxGuests: 2 },
            { name: 'Executive Ocean View Room', pricePerNight: 55000, totalRooms: 2, maxGuests: 2 }
          ]
        },
        {
          type: 'shortlet',
          title: 'Urban Studio Suite - Victoria Island',
          description: 'Contemporary, ultra-clean studio ideal for business consultants and solo travelers with workstation.',
          address: '14 Karimu Kotun Street, Victoria Island',
          state: 'Lagos',
          city: 'Lagos',
          price: 65000,
          pricePerNight: 65000,
          photos: SAMPLE_PHOTOS.shortletLagos,
          guestsCapacity: 2,
          bedrooms: 1,
          bathrooms: 1,
          minimumStayNights: 1,
          amenities: ['Wi-Fi', '24/7 Electricity', 'Smart TV', 'Kitchenette', 'Gym Access'],
          rooms: [
            { name: 'Standard Studio Room', pricePerNight: 65000, totalRooms: 3, maxGuests: 2 }
          ]
        }
      ]
    },

    // 2. Hotel - Abuja
    {
      businessName: 'Zuma View Luxury Residences',
      category: 'Hotel',
      description: 'Exclusive executive shortlets and diplomatic residences in the serene hills of Maitama Abuja.',
      address: '8 Rhine Street, off IBB Way, Maitama',
      state: 'Abuja',
      city: 'Abuja',
      contactPhone: '+234 809 110 5522',
      contactEmail: 'stay@zumaview.com.ng',
      logoUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=400&q=80',
      verified: true,
      properties: [
        {
          type: 'shortlet',
          title: 'Royal Maitama 4-Bed Executive Villa',
          description: 'Fully furnished private residence with private pool, landscaped gardens, and round-the-clock armed security.',
          address: '8 Rhine Street, Maitama',
          state: 'Abuja',
          city: 'Abuja',
          price: 320000,
          pricePerNight: 320000,
          photos: SAMPLE_PHOTOS.shortletAbuja,
          guestsCapacity: 8,
          bedrooms: 4,
          bathrooms: 4.5,
          minimumStayNights: 2,
          amenities: ['Olympic Pool', 'Backup Generators', 'Fiber Internet', 'Security Patrol', 'Private Chef'],
          rooms: [
            { name: 'Royal King Suite', pricePerNight: 120000, totalRooms: 2, maxGuests: 2 },
            { name: 'Deluxe Queen Suite', pricePerNight: 80000, totalRooms: 2, maxGuests: 2 }
          ]
        }
      ]
    },

    // 3. Hotel - Port Harcourt
    {
      businessName: 'Atlantic Oasis Waterfront Haven',
      category: 'Hotel',
      description: 'Boutique waterfront hospitality sanctuary along Peter Odili corridor in Port Harcourt.',
      address: '22 Trans-Amadi Extension, Peter Odili Road',
      state: 'Port Harcourt',
      city: 'Port Harcourt',
      contactPhone: '+234 802 770 9182',
      contactEmail: 'bookings@atlanticoasis.ng',
      logoUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=400&q=80',
      verified: true,
      properties: [
        {
          type: 'shortlet',
          title: 'Waterfront 2-Bedroom Serviced Haven',
          description: 'Serene river-view serviced apartment with tranquil ambiance and high-speed satellite connectivity.',
          address: '22 Trans-Amadi Extension, Peter Odili Road',
          state: 'Port Harcourt',
          city: 'Port Harcourt',
          price: 75000,
          pricePerNight: 75000,
          photos: SAMPLE_PHOTOS.shortletBeach,
          guestsCapacity: 4,
          bedrooms: 2,
          bathrooms: 2,
          minimumStayNights: 1,
          amenities: ['Waterfront View', 'Full Kitchen', 'Starlink Internet', '24/7 Security', 'In-house Laundry'],
          rooms: [
            { name: 'Master Riverview Bedroom', pricePerNight: 45000, totalRooms: 1, maxGuests: 2 },
            { name: 'Standard Guest Bedroom', pricePerNight: 35000, totalRooms: 1, maxGuests: 2 }
          ]
        }
      ]
    },

    // 4. Restaurant - Port Harcourt
    {
      businessName: 'Bole & Fish Palace Old GRA',
      category: 'Restaurant',
      description: 'The premier culinary destination for authentic Port Harcourt roasted plantain, charcoal grilled fish, and spicy utazi sauce.',
      address: '5 Tombia Street, Old GRA',
      state: 'Port Harcourt',
      city: 'Port Harcourt',
      contactPhone: '+234 814 332 9901',
      contactEmail: 'orders@bolepalaceph.com',
      logoUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
      verified: true,
      restaurants: [
        {
          title: 'Bole & Fish Palace flagship Lounge',
          description: 'Indoor rustic diner and open-air wooden garden lounge serving traditional Niger-Delta grilled specialties.',
          cuisineType: 'Niger-Delta / Nigerian Grills',
          address: '5 Tombia Street, Old GRA',
          state: 'Port Harcourt',
          city: 'Port Harcourt',
          acceptsReservations: true,
          photos: SAMPLE_PHOTOS.restaurantBole,
          openingHours: {
            Monday: '11:00 AM - 11:00 PM',
            Tuesday: '11:00 AM - 11:00 PM',
            Wednesday: '11:00 AM - 11:00 PM',
            Thursday: '11:00 AM - 11:30 PM',
            Friday: '11:00 AM - 01:00 AM',
            Saturday: '12:00 PM - 01:00 AM',
            Sunday: '01:00 PM - 11:00 PM'
          },
          menu: [
            { name: 'Spicy Peppered Gizzard & Plantain Skewers', description: 'Tender chicken gizzard marinated in scotch bonnet chili with roasted plantain cubes', price: 4500, category: 'Starters', photoUrl: SAMPLE_PHOTOS.foodStarters },
            { name: 'The Original PH Bole & Croaker Platter', description: 'Whole charcoal-grilled yellow croaker fish, roasted sweet plantain, spicy palm oil sauce & utazi garnish', price: 12500, category: 'Mains', photoUrl: SAMPLE_PHOTOS.foodMains },
            { name: 'Jumbo Catfish Point-and-Kill Peppersoup', description: 'Fresh catfish cooked in aromatic indigenous delta peppersoup herbs with yam cubes', price: 11000, category: 'Mains', photoUrl: SAMPLE_PHOTOS.foodMains },
            { name: 'Signature Zobo Bliss with Ginger & Cloves', description: 'Chilled organic hibiscus brew infused with fresh pineapples, ginger, and mint', price: 2500, category: 'Drinks', photoUrl: SAMPLE_PHOTOS.foodDrinks },
            { name: 'Warm Puff-Puff with Honey Cinnamon Glaze', description: 'Four golden fluffy Nigerian fried dough balls dusted with cinnamon and organic honey', price: 3000, category: 'Desserts', photoUrl: SAMPLE_PHOTOS.foodDessert }
          ]
        }
      ]
    },

    // 5. Restaurant - Abuja
    {
      businessName: 'Suya Central & Grill Lounge',
      category: 'Restaurant',
      description: 'Artisanal Northern Nigerian beef suya, kiln-roasted lamb shank, and modern Afro-fusion dining.',
      address: 'Plot 41 Adetokunbo Ademola Crescent, Wuse 2',
      state: 'Abuja',
      city: 'Abuja',
      contactPhone: '+234 818 901 2345',
      contactEmail: 'reservations@suyacentral.ng',
      logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80',
      verified: true,
      restaurants: [
        {
          title: 'Suya Central Wuse 2 Rooftop Lounge',
          description: 'Contemporary Afro-industrial rooftop grill with scenic skyline views over central Abuja.',
          cuisineType: 'Northern Nigerian / Suya Grills',
          address: 'Plot 41 Adetokunbo Ademola Crescent, Wuse 2',
          state: 'Abuja',
          city: 'Abuja',
          acceptsReservations: true,
          photos: SAMPLE_PHOTOS.restaurantGrill,
          openingHours: {
            Monday: '04:00 PM - 12:00 AM',
            Tuesday: '04:00 PM - 12:00 AM',
            Wednesday: '04:00 PM - 12:00 AM',
            Thursday: '04:00 PM - 01:00 AM',
            Friday: '03:00 PM - 02:00 AM',
            Saturday: '02:00 PM - 02:00 AM',
            Sunday: '02:00 PM - 12:00 AM'
          },
          menu: [
            { name: 'Masa Cakes with Spicy Yaji Mayo', description: 'Crispy fermented rice cakes served with homemade northern yaji chili dip', price: 3500, category: 'Starters', photoUrl: SAMPLE_PHOTOS.foodStarters },
            { name: 'Kilishi Charcuterie Board', description: 'Traditional sun-dried spicy beef crisps, tiger nuts, roasted groundnuts, and sweet dates', price: 6500, category: 'Starters', photoUrl: SAMPLE_PHOTOS.foodStarters },
            { name: 'Prime Beef Suya Platter (Large)', description: 'Tender prime beef steak dusted in roasted groundnut yaji spice, sliced red onions and vine tomatoes', price: 9500, category: 'Mains', photoUrl: SAMPLE_PHOTOS.foodMains },
            { name: 'Slow-Smoked Asun (Goat Meat) Delight', description: 'Diced goat meat pan-fried in hot habanero sauce and bell peppers', price: 8500, category: 'Mains', photoUrl: SAMPLE_PHOTOS.foodMains },
            { name: 'Fresh Chapmans Cocktail with Cucumber & Lime', description: 'Classic Nigerian mocktail with Angostura bitters, Fanta, Sprite and cucumber ribbons', price: 3500, category: 'Drinks', photoUrl: SAMPLE_PHOTOS.foodDrinks }
          ]
        }
      ]
    },

    // 6. Property Owner - Kaduna & Kano
    {
      businessName: 'Danladi Commercial & Residential Properties',
      category: 'Property Owner',
      description: 'Trusted real estate development agency managing premium commercial centers, residential leases, and titled lands across northern Nigeria.',
      address: '18 Kachia Road, Barnawa',
      state: 'Kaduna',
      city: 'Kaduna',
      contactPhone: '+234 803 555 7711',
      contactEmail: 'inquiries@danladiproperties.ng',
      logoUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80',
      verified: true,
      properties: [
        {
          type: 'rent',
          title: '3-Bedroom Luxury Flat in Barnawa GRA',
          description: 'Spacious 3-bedroom apartment with fitted wardrobes, POP ceilings, borehole water system, and paved interlocked compound.',
          address: '4 Coronation Crescent, Barnawa GRA',
          state: 'Kaduna',
          city: 'Kaduna',
          price: 2500000,
          rentAmount: 2500000,
          paymentFrequency: 'Per Annum',
          agencyFee: 250000,
          cautionFee: 200000,
          bedrooms: 3,
          bathrooms: 3,
          furnishingStatus: 'Semi-Furnished',
          availableFrom: 'Immediately',
          photos: SAMPLE_PHOTOS.rent
        },
        {
          type: 'land',
          title: 'Commercial Land Facing Express - 4 Plots',
          description: 'Prime dry commercial plot along the newly expanded Kaduna-Zaria expressway corridor, ideal for filling station or warehousing.',
          address: 'Kilometer 12, Zaria Expressway',
          state: 'Kaduna',
          city: 'Kaduna',
          price: 45000000,
          sizeInPlots: 4,
          titleDocument: 'C of O',
          photos: SAMPLE_PHOTOS.land
        },
        {
          type: 'commercial',
          title: 'Open-Plan Corporate Office Complex',
          description: 'First-floor modern office space with executive boardroom, dedicated restrooms, elevator, and 100kVA backup generator.',
          address: 'Plot 7 Ahmadu Bello Way, Central District',
          state: 'Kaduna',
          city: 'Kaduna',
          price: 8500000,
          propertyType: 'Office',
          squareFootage: 3800,
          photos: SAMPLE_PHOTOS.commercial
        }
      ]
    },

    // 7. Property Owner - Owerri (Imo State)
    {
      businessName: 'Heartland Prime Realty & Holdings',
      category: 'Property Owner',
      description: 'Leading residential property acquisitions and land registry consulting firm in New Owerri.',
      address: 'Plot 12 Concorde Boulevard, New Owerri',
      state: 'Owerri',
      city: 'Owerri',
      contactPhone: '+234 806 441 2288',
      contactEmail: 'contact@heartlandprime.com',
      logoUrl: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80',
      verified: true,
      properties: [
        {
          type: 'land',
          title: '2 Plots of Residential Dry Land in Area H',
          description: 'Gated estate plot with full infrastructure, tarred access road, drainage and immediate allocation ready for building.',
          address: 'Area H Extension, New Owerri',
          state: 'Owerri',
          city: 'Owerri',
          price: 28000000,
          sizeInPlots: 2,
          titleDocument: "Governor's Consent",
          photos: SAMPLE_PHOTOS.land
        },
        {
          type: 'rent',
          title: 'Executive 4-Bedroom Duplex with BQ',
          description: 'Newly completed standalone duplex with security post, prepaid smart meter, perimeter fencing, and car port.',
          address: 'Road 5, Works Layout',
          state: 'Owerri',
          city: 'Owerri',
          price: 4000000,
          rentAmount: 4000000,
          paymentFrequency: 'Per Annum',
          agencyFee: 400000,
          cautionFee: 300000,
          bedrooms: 4,
          bathrooms: 4.5,
          furnishingStatus: 'Unfurnished',
          availableFrom: 'Next Month',
          photos: SAMPLE_PHOTOS.rent
        }
      ]
    },

    // 8. Business Services - Kano (Electronics & Tech)
    {
      businessName: 'Arewa Heritage Crafts & Tech Hub',
      category: 'Business Services',
      description: 'Premier supplier of premium refurbished electronics, smart solar gadgets, and northern handcrafted goods.',
      address: '15 Post Office Road, Nassarawa',
      state: 'Kano',
      city: 'Kano',
      contactPhone: '+234 803 998 1234',
      contactEmail: 'sales@arewatech.ng',
      logoUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=400&q=80',
      verified: true,
      products: [
        {
          title: 'Apple MacBook Pro 14" M2 Pro (16GB RAM, 512GB SSD)',
          description: 'Pristine space gray MacBook Pro in mint condition with battery cycle count below 45. Includes original 67W charger.',
          price: 1850000,
          category: 'Electronics',
          condition: 'Used',
          photos: SAMPLE_PHOTOS.electronics,
          state: 'Kano',
          city: 'Kano'
        },
        {
          title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
          description: 'Industry-leading noise cancelation, 30-hour battery life, pristine audio clarity, in original factory sealed box.',
          price: 420000,
          category: 'Electronics',
          condition: 'New',
          photos: SAMPLE_PHOTOS.electronics,
          state: 'Kano',
          city: 'Kano'
        },
        {
          title: 'Solid Teak Wood Handcarved Coffee Table',
          description: 'Handcrafted by Kano master woodworkers featuring traditional geometric motifs and high-gloss protective finish.',
          price: 185000,
          category: 'Home',
          condition: 'New',
          photos: SAMPLE_PHOTOS.home,
          state: 'Kano',
          city: 'Kano'
        }
      ]
    },

    // 9. Business Services - Lagos (Products + Event)
    {
      businessName: 'Dan Fodio Tech & Audio Innovations',
      category: 'Business Services',
      description: 'High-end electronics distributor, pro audio studio gear specialist, and host of annual technology expos in Lagos.',
      address: '28 Otigba Street, Computer Village, Ikeja',
      state: 'Lagos',
      city: 'Lagos',
      contactPhone: '+234 812 400 8899',
      contactEmail: 'hello@danfodiotech.com',
      logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
      verified: true,
      products: [
        {
          title: 'DJI Mini 4 Pro Fly More Combo Drone',
          description: 'Omnidirectional active obstacle sensing, 4K/60fps HDR true vertical shooting, 20km FHD video transmission.',
          price: 1250000,
          category: 'Electronics',
          condition: 'New',
          photos: SAMPLE_PHOTOS.electronics,
          state: 'Lagos',
          city: 'Lagos'
        },
        {
          title: 'Ergonomic Mesh Executive Swivel Chair',
          description: 'Breathable lumbar support chair with 3D armrests, aluminum wheelbase, and smooth polyurethane casters.',
          price: 260000,
          category: 'Home',
          condition: 'New',
          photos: SAMPLE_PHOTOS.home,
          state: 'Lagos',
          city: 'Lagos'
        }
      ],
      events: [
        {
          title: 'Lagos Tech & Creator Summit 2026',
          description: 'The largest gathering of software engineers, hardware creators, fintech executives, and digital creators in West Africa.',
          venue: 'Landmark Centre, Water Corporation Drive',
          address: 'Plot 2&3 Water Corporation Drive, Victoria Island',
          state: 'Lagos',
          city: 'Lagos',
          startDate: '2026-10-15T09:00:00Z',
          endDate: '2026-10-16T18:00:00Z',
          coverImageUrl: SAMPLE_PHOTOS.events[0],
          isActive: true,
          ticketTypes: [
            { name: 'Standard Regular Pass', price: 15000, quantity: 500, sold: 0 },
            { name: 'VIP Networking & Dinner Pass', price: 75000, quantity: 150, sold: 0 },
            { name: 'Startup Founder & Pitch Pass', price: 120000, quantity: 50, sold: 0 }
          ]
        }
      ]
    },

    // 10. Business Services - Port Harcourt (Entertainment & Events)
    {
      businessName: 'Garden City Live Entertainment & Ticketing',
      category: 'Business Services',
      description: 'Event production powerhouse hosting flagship music concerts, cultural festivals, and comedy shows in the South-South.',
      address: '7 Stadium Road, Port Harcourt',
      state: 'Port Harcourt',
      city: 'Port Harcourt',
      contactPhone: '+234 805 112 3344',
      contactEmail: 'tickets@gardencitylive.ng',
      logoUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
      verified: true,
      events: [
        {
          title: 'Afrobeats by the Niger: Live in Concert',
          description: 'An electrifying night celebrating Nigeria’s global music superstars with live band setups, light displays, and VIP cabanas.',
          venue: 'Polo Club Grounds, GRA Phase 2',
          address: 'Tombia Extension, GRA Phase 2',
          state: 'Port Harcourt',
          city: 'Port Harcourt',
          startDate: '2026-11-20T18:00:00Z',
          endDate: '2026-11-21T03:00:00Z',
          coverImageUrl: SAMPLE_PHOTOS.events[1],
          isActive: true,
          ticketTypes: [
            { name: 'General Admission', price: 10000, quantity: 1000, sold: 0 },
            { name: 'Silver VIP Access', price: 35000, quantity: 300, sold: 0 },
            { name: 'Gold Table for 8 Persons', price: 500000, quantity: 20, sold: 0 }
          ]
        },
        {
          title: 'Port Harcourt Laughter Festival - Season 4',
          description: 'Over 15 top Nigerian comedians taking the stage for 4 hours of pure belly laughs and acoustic comedy specials.',
          venue: 'Azny Place Event Arena',
          address: 'Plot 33 Louis Drive, off Sani Abacha Road, GRA',
          state: 'Port Harcourt',
          city: 'Port Harcourt',
          startDate: '2026-12-05T17:00:00Z',
          endDate: '2026-12-05T23:00:00Z',
          coverImageUrl: SAMPLE_PHOTOS.events[2],
          isActive: true,
          ticketTypes: [
            { name: 'Regular Entry', price: 5000, quantity: 600, sold: 0 },
            { name: 'VIP Front Row', price: 25000, quantity: 100, sold: 0 }
          ]
        }
      ]
    }
  ];

  for (let i = 0; i < businessesSeed.length; i++) {
    const biz = businessesSeed[i];
    const bizRef = db.collection('businesses').doc();
    const businessId = bizRef.id;
    const ownerId = createdUserIds[i % createdUserIds.length];
    const slug = slugify(biz.businessName);

    console.log(`\n📌 [${i + 1}/${businessesSeed.length}] Creating Business: "${biz.businessName}" (${biz.category} - ${biz.city})`);

    // Write Top-level business doc
    await bizRef.set({
      businessName: biz.businessName,
      category: biz.category,
      description: biz.description,
      address: biz.address,
      state: biz.state,
      city: biz.city,
      contactPhone: biz.contactPhone,
      contactEmail: biz.contactEmail,
      logoUrl: biz.logoUrl,
      ownerId: ownerId,
      slug: slug,
      verified: biz.verified ?? true,
      createdAt: serverTimestamp()
    });
    stats.businesses++;

    // A. PROPERTIES
    if (biz.properties && biz.properties.length > 0) {
      for (const prop of biz.properties) {
        const propRef = bizRef.collection('properties').doc();
        const propertyId = propRef.id;

        const propDocData = {
          type: prop.type,
          title: prop.title,
          description: prop.description,
          address: prop.address,
          state: prop.state,
          city: prop.city,
          price: prop.price,
          photos: prop.photos || [],
          createdAt: serverTimestamp()
        };

        if (prop.type === 'shortlet') {
          propDocData.guestsCapacity = prop.guestsCapacity || 2;
          propDocData.bedrooms = prop.bedrooms || 1;
          propDocData.bathrooms = prop.bathrooms || 1;
          propDocData.pricePerNight = prop.pricePerNight || prop.price;
          propDocData.minimumStayNights = prop.minimumStayNights || 1;
          propDocData.amenities = prop.amenities || [];
          propDocData.propertySubType = 'shortlet_hotel';
          propDocData.miniSiteActive = true;
          propDocData.sellerType = 'business';
          propDocData.businessId = businessId;
          propDocData.businessName = biz.businessName;
          propDocData.lat = (STATE_COORDS[prop.state] || STATE_COORDS['Lagos']).lat;
          propDocData.lon = (STATE_COORDS[prop.state] || STATE_COORDS['Lagos']).lon;
          propDocData.ownerId = ownerId;
          propDocData.priceNum = prop.price;
          propDocData.price = `₦${Number(prop.price).toLocaleString()}/night`;
          propDocData.type = 'Shortlet / Hotel';
        } else if (prop.type === 'rent') {
          propDocData.propertySubType = 'rent';
          propDocData.rentAmount = prop.rentAmount || prop.price;
          propDocData.paymentFrequency = prop.paymentFrequency || 'Per Annum';
          propDocData.billingPeriod = prop.billingPeriod || '1 Year';
          propDocData.agencyFee = prop.agencyFee || 0;
          propDocData.cautionFee = prop.cautionFee || 0;
          propDocData.legalFee = prop.legalFee || Math.round((prop.rentAmount || prop.price) * 0.05);
          propDocData.serviceCharge = prop.serviceCharge || Math.round((prop.rentAmount || prop.price) * 0.08);
          propDocData.bedrooms = prop.bedrooms || 2;
          propDocData.bathrooms = prop.bathrooms || 2;
          propDocData.furnishingStatus = prop.furnishingStatus || 'Unfurnished';
          propDocData.furnishing = prop.furnishing || prop.furnishingStatus || 'Unfurnished';
          propDocData.availableFrom = prop.availableFrom || 'Immediately';
          propDocData.hasStore = prop.hasStore ?? false;
          propDocData.houseType = prop.houseType || 'Flat / Apartment';
          propDocData.roadCondition = prop.roadCondition || 'Tarred';
          propDocData.roadImage = prop.roadImage || SAMPLE_PHOTOS.rent[0];
          propDocData.roadImagePublicId = prop.roadImagePublicId || 'seeded-road-photo';
          propDocData.sellerType = 'business';
          propDocData.businessId = businessId;
          propDocData.businessName = biz.businessName;
          propDocData.ownerId = ownerId;
          propDocData.miniSiteActive = false;
          propDocData.lat = (STATE_COORDS[prop.state] || STATE_COORDS['Kaduna']).lat;
          propDocData.lon = (STATE_COORDS[prop.state] || STATE_COORDS['Kaduna']).lon;
          propDocData.priceNum = prop.price;
          propDocData.price = `₦${Number(prop.price).toLocaleString()}/${propDocData.billingPeriod.toLowerCase().includes('month') ? 'mo' : 'yr'}`;
          propDocData.type = prop.houseType || 'Flat / Apartment';
          propDocData.guests = 0;
          propDocData.image = (prop.photos && prop.photos[0]) || SAMPLE_PHOTOS.rent[0];
          propDocData.images = prop.photos || [];
          propDocData.imagePublicIds = prop.imagePublicIds || [];
          propDocData.rating = 0;
          propDocData.reviews = 0;
          propDocData.status = 'Approved';
          propDocData.amenities = prop.amenities || [];
        } else if (prop.type === 'land') {
          propDocData.propertySubType = 'land';
          propDocData.plotSize = prop.plotSize || prop.sizeInPlots || 1;
          propDocData.sizeInPlots = prop.sizeInPlots || 1;
          propDocData.sizeUnit = prop.sizeUnit || 'plots';
          propDocData.plotSizeSqm = prop.plotSizeSqm || (prop.sizeInPlots ? prop.sizeInPlots * 648 : 648);
          propDocData.titleDocument = prop.titleDocument || prop.titleType || 'C of O';
          propDocData.titleType = prop.titleDocument || prop.titleType || 'C of O';
          propDocData.landUseType = prop.landUseType || 'Residential';
          propDocData.topography = prop.topography || 'Dry & Flat';
          propDocData.accessRoad = prop.accessRoad || 'Tarred';
          propDocData.fenced = prop.fenced ?? true;
          propDocData.isFenced = prop.fenced ?? true;
          propDocData.surveyPlan = prop.surveyPlan ?? true;
          propDocData.hasSurveyPlan = prop.surveyPlan ?? true;
          propDocData.landSaleType = prop.landSaleType || 'sale';
          propDocData.sellerType = 'business';
          propDocData.businessId = businessId;
          propDocData.businessName = biz.businessName;
          propDocData.ownerId = ownerId;
          propDocData.miniSiteActive = false;
          const baseCoords = (STATE_COORDS[prop.state] || STATE_COORDS['Kaduna']);
          propDocData.lat = baseCoords.lat;
          propDocData.lon = baseCoords.lon;
          propDocData.priceNum = prop.price;
          if (prop.landSaleType === 'hire') {
            propDocData.price = `₦${Number(prop.price).toLocaleString()}/yr (Hire)`;
          } else if (prop.landSaleType === 'lease') {
            propDocData.price = `₦${Number(prop.price).toLocaleString()}/lease`;
          } else {
            propDocData.price = `₦${Number(prop.price).toLocaleString()}`;
          }
          propDocData.type = 'Land';
          propDocData.bedrooms = 0;
          propDocData.bathrooms = 0;
          propDocData.guests = 0;
          propDocData.image = (prop.photos && prop.photos[0]) || SAMPLE_PHOTOS.land[0];
          propDocData.images = prop.photos || [];
          propDocData.imagePublicIds = prop.imagePublicIds || [];
          propDocData.rating = 0;
          propDocData.reviews = 0;
          propDocData.status = 'Approved';
          propDocData.amenities = [];
        } else if (prop.type === 'commercial') {
          propDocData.propertySubType = 'commercial';
          propDocData.propertyType = prop.propertyType || 'Office';
          propDocData.commercialType = prop.propertyType || 'Office';
          propDocData.squareFootage = prop.squareFootage || 1500;
          propDocData.spaceSizeSqm = prop.spaceSizeSqm || Math.round((prop.squareFootage || 1500) / 10.764);
          propDocData.capacity = prop.capacity || 20;
          propDocData.hasParking = prop.hasParking ?? true;
          propDocData.hasSecurity = prop.hasSecurity ?? true;
          propDocData.hasWater = prop.hasWater ?? false;
          propDocData.hasPower = prop.hasPower ?? true;
          propDocData.hasAC = prop.hasAC ?? true;
          propDocData.hasInternet = prop.hasInternet ?? true;
          propDocData.hasElevator = prop.hasElevator ?? (prop.propertyType && prop.propertyType.toLowerCase().includes('office'));
          propDocData.hasCanteen = prop.hasCanteen ?? false;
          propDocData.billingPeriod = prop.billingPeriod || 'Per Annum';
          propDocData.usages = prop.usages || [prop.propertyType || 'Office'];
          propDocData.serviceCharge = prop.serviceCharge || Math.round(prop.price * 0.08);
          propDocData.cautionFee = prop.cautionFee || Math.round(prop.price * 0.06);
          propDocData.legalFee = prop.legalFee || Math.round(prop.price * 0.04);
          propDocData.agencyFee = prop.agencyFee || Math.round(prop.price * 0.05);
          propDocData.sellerType = 'business';
          propDocData.businessId = businessId;
          propDocData.businessName = biz.businessName;
          propDocData.ownerId = ownerId;
          propDocData.miniSiteActive = false;
          const baseCoords = (STATE_COORDS[prop.state] || STATE_COORDS['Kaduna']);
          propDocData.lat = baseCoords.lat;
          propDocData.lon = baseCoords.lon;
          propDocData.priceNum = prop.price;
          propDocData.price = `₦${Number(prop.price).toLocaleString()}/yr`;
          propDocData.type = prop.propertyType || 'Commercial';
          propDocData.bedrooms = 0;
          propDocData.bathrooms = 0;
          propDocData.guests = 0;
          propDocData.image = (prop.photos && prop.photos[0]) || SAMPLE_PHOTOS.commercial[0];
          propDocData.images = prop.photos || [];
          propDocData.imagePublicIds = prop.imagePublicIds || [];
          propDocData.rating = 0;
          propDocData.reviews = 0;
          propDocData.status = 'Approved';
          // Build amenities string array from boolean switches (matches dashboard form)
          const am = [];
          if (propDocData.hasParking) am.push('Parking');
          if (propDocData.hasSecurity) am.push('Security');
          if (propDocData.hasWater) am.push('Water Supply');
          if (propDocData.hasPower) am.push('Power/Electricity');
          if (propDocData.hasAC) am.push('AC');
          if (propDocData.hasInternet) am.push('WiFi/Internet');
          if (propDocData.hasElevator) am.push('Elevator/Lift');
          if (propDocData.hasCanteen) am.push('Canteen/Kitchen');
          propDocData.amenities = am;
        }

        await propRef.set(propDocData);
        stats.properties++;

        // ── Mirror to legacy top-level `house_listings` for dashboard + listing pages ──
        {
          const topPropRef = db.collection('house_listings').doc(propertyId);
          const locationLabel = [propDocData.city, propDocData.state, 'Nigeria'].filter(Boolean).join(', ');
          await topPropRef.set({
            id: propertyId,
            ...propDocData,
            location: propDocData.location || locationLabel,
            streetAddress: prop.address,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          stats.house_listings++;
        }

        // Nested rooms subcollection for shortlets
        if (prop.type === 'shortlet' && prop.rooms && prop.rooms.length > 0) {
          for (const room of prop.rooms) {
            const roomRef = propRef.collection('rooms').doc();
            await roomRef.set({
              name: room.name,
              pricePerNight: room.pricePerNight,
              totalRooms: room.totalRooms,
              maxGuests: room.maxGuests
            });
            stats.rooms++;
          }
        }
      }
      console.log(`   └─ Added ${biz.properties.length} properties under business.`);
    }

    // B. RESTAURANTS
    if (biz.restaurants && biz.restaurants.length > 0) {
      for (const rest of biz.restaurants) {
        const restRef = bizRef.collection('restaurants').doc();
        const restaurantId = restRef.id;

        await restRef.set({
          title: rest.title,
          description: rest.description,
          cuisineType: rest.cuisineType,
          address: rest.address,
          state: rest.state,
          city: rest.city,
          openingHours: rest.openingHours,
          acceptsReservations: rest.acceptsReservations ?? true,
          photos: rest.photos || [],
          createdAt: serverTimestamp()
        });
        stats.restaurants++;

        // Nested menu subcollection
        if (rest.menu && rest.menu.length > 0) {
          for (const item of rest.menu) {
            const menuItemRef = restRef.collection('menu').doc();
            await menuItemRef.set({
              name: item.name,
              description: item.description,
              price: item.price,
              category: item.category,
              photoUrl: item.photoUrl
            });
            stats.menuItems++;
          }
        }
      }
      console.log(`   └─ Added ${biz.restaurants.length} restaurant(s) with menu items.`);
    }

    // C. PRODUCTS
    if (biz.products && biz.products.length > 0) {
      for (const prod of biz.products) {
        const prodRef = bizRef.collection('products').doc();
        const productId = prodRef.id;

        await prodRef.set({
          title: prod.title,
          description: prod.description,
          price: prod.price,
          category: prod.category,
          condition: prod.condition,
          photos: prod.photos || [],
          state: prod.state,
          city: prod.city,
          sellerType: 'business',
          businessId: businessId,
          businessName: biz.businessName,
          ownerId: ownerId,
          image: (prod.photos && prod.photos[0]) || SAMPLE_PHOTOS.electronics[0],
          images: prod.photos || [],
          priceNum: prod.price,
          priceLabel: `₦${Number(prod.price).toLocaleString()}`,
          status: 'Active',
          createdAt: serverTimestamp()
        });
        stats.products++;

        // ── Mirror to legacy top-level `marketplace` for marketplace search/browse + dashboard
        {
          const topProdRef = db.collection('marketplace').doc(productId);
          const locationLabel = [prod.city, prod.state, 'Nigeria'].filter(Boolean).join(', ');
          await topProdRef.set({
            id: productId,
            title: prod.title,
            description: prod.description,
            price: `₦${Number(prod.price).toLocaleString()}`,
            priceNum: prod.price,
            category: prod.category,
            itemCondition: prod.condition,
            condition: prod.condition,
            image: (prod.photos && prod.photos[0]) || SAMPLE_PHOTOS.electronics[0],
            images: prod.photos || [],
            state: prod.state,
            city: prod.city,
            location: locationLabel,
            streetAddress: prod.address || biz.address || '',
            ownerId,
            sellerType: 'business',
            businessId,
            businessName: biz.businessName,
            status: 'Active',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          stats.marketplace++;
        }
      }
      console.log(`   └─ Added ${biz.products.length} product(s) under business.`);
    }

    // D. EVENTS
    if (biz.events && biz.events.length > 0) {
      for (const ev of biz.events) {
        const evRef = bizRef.collection('events').doc();
        const eventId = evRef.id;

        // Compute lowest ticket price FIRST (needed before writes)
        let lowestTicketPrice = Infinity;
        if (ev.ticketTypes && ev.ticketTypes.length > 0) {
          for (const tt of ev.ticketTypes) {
            if (tt.price < lowestTicketPrice) lowestTicketPrice = tt.price;
          }
        }
        const priceMin = lowestTicketPrice === Infinity ? 0 : lowestTicketPrice;
        const priceLabel = priceMin === 0 ? 'Free' : `From \u20A6${priceMin.toLocaleString()}`;
        const locationLabel = [ev.city, ev.state, 'Nigeria'].filter(Boolean).join(', ');
        const cover = ev.coverImageUrl || SAMPLE_PHOTOS.events[0];

        await evRef.set({
          title: ev.title,
          description: ev.description,
          venue: ev.venue,
          address: ev.address,
          state: ev.state,
          city: ev.city,
          startDate: ev.startDate,
          endDate: ev.endDate,
          startTime: ev.startTime || '09:00',
          endTime: ev.endTime || '18:00',
          coverImageUrl: cover,
          isActive: ev.isActive ?? true,
          isFeatured: false,
          category: ev.category || 'Festival',
          location: locationLabel,
          eventType: ev.eventType || 'Festival',
          ownerId,
          organizerId: ownerId,
          priceNum: priceMin,
          price: priceLabel,
          image: cover,
          images: [cover].filter(Boolean),
          status: ev.status || 'Active',
          rating: 0,
          totalReviews: 0,
          createdAt: serverTimestamp()
        });
        stats.events++;

        // Nested ticketTypes subcollection
        if (ev.ticketTypes && ev.ticketTypes.length > 0) {
          for (const tt of ev.ticketTypes) {
            const ticketRef = evRef.collection('ticketTypes').doc();
            const commission = Math.round(tt.price * 0.07);

            await ticketRef.set({
              name: tt.name,
              price: tt.price,
              quantity: tt.quantity,
              sold: tt.sold || 0,
              commission: commission
            });
            stats.ticketTypes++;
          }
        }

        // ── Mirror to legacy top-level `events` for the dashboard Events page and useMyListings
        {
          const topEventRef = db.collection('events').doc(eventId);
          const priceMin = lowestTicketPrice === Infinity ? 0 : lowestTicketPrice;
          const locationLabel = [ev.city, ev.state, 'Nigeria'].filter(Boolean).join(', ');
          await topEventRef.set({
            id: eventId,
            title: ev.title,
            description: ev.description,
            venue: ev.venue,
            address: ev.address,
            state: ev.state,
            city: ev.city,
            location: locationLabel,
            startDate: ev.startDate,
            endDate: ev.endDate,
            startTime: ev.startTime || '09:00',
            endTime: ev.endTime || '18:00',
            startDateTime: ev.startDate,
            endDateTime: ev.endDate,
            image: ev.coverImageUrl || SAMPLE_PHOTOS.events[0],
            images: [ev.coverImageUrl || SAMPLE_PHOTOS.events[0]].filter(Boolean),
            coverImage: ev.coverImageUrl || SAMPLE_PHOTOS.events[0],
            category: ev.category || 'Festival',
            eventCategory: ev.category || 'Festival',
            eventType: ev.eventType || 'Festival',
            isFeatured: ev.isFeatured || false,
            isActive: ev.isActive ?? true,
            status: ev.status || 'Active',
            ownerId,
            organizerId: ownerId,
            sellerType: 'business',
            businessId,
            businessName: biz.businessName,
            price: priceMin === 0 ? 'Free' : `From ₦${priceMin.toLocaleString()}`,
            priceNum: priceMin,
            minPrice: priceMin,
            ticketTypes: (ev.ticketTypes || []).map(tt => ({ ...tt })),
            ticketsAvailable: (ev.ticketTypes || []).reduce((a, tt) => a + (Number(tt.quantity) || 0), 0),
            ticketsSold: (ev.ticketTypes || []).reduce((a, tt) => a + (Number(tt.sold) || 0), 0),
            rating: 0,
            totalReviews: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          stats.top_level_events++;
        }
      }
      console.log(`   └─ Added ${biz.events.length} event(s) with tickets under business.`);
    }
  }

  // ══════════════════════════════════════════════════════════════════
  // E. INDIVIDUAL LISTINGS (no parent business, sellerType = "individual")
  //    Writes directly to legacy top-level collections to exercise the
  //    non-business flow supported by the dashboard and firestore.rules.
  // ══════════════════════════════════════════════════════════════════
  const individualOwnerId = createdUserIds[0] || null;

  // E.1 Individual Rent Property → top-level house_listings
  {
    const id = db.collection('house_listings').doc().id;
    const state = 'Lagos';
    const coords = STATE_COORDS[state] || { lat: 6.5244, lon: 3.3792 };
    const price = 2400000;
    const legalFee = Math.round(price * 0.05);
    const agencyFee = Math.round(price * 0.10);
    const cautionFee = Math.round(price * 0.10);
    await db.collection('house_listings').doc(id).set({
      id,
      title: 'Luxury 4-Bed Duplex with Boys Quarters',
      propertyName: 'Luxury 4-Bed Duplex with Boys Quarters',
      description: 'Fully detached duplex in a serene, secured estate. All rooms ensuite with fitted kitchen and spacious compound.',
      listingType: 'property',
      propertySubType: 'rent',
      propertyType: 'rent',
      type: 'rent',
      typeLabel: 'For Rent',
      sellerType: 'individual',
      businessId: null,
      ownerId: individualOwnerId,
      miniSiteActive: false,
      status: 'Approved',
      isActive: true,
      isFeatured: true,
      bedrooms: 4,
      bathrooms: 5,
      toilets: 5,
      parkingSpaces: 4,
      totalPrice: price,
      price,
      priceNum: price,
      priceLabel: `₦${price.toLocaleString()} / year`,
      currency: 'NGN',
      billingPeriod: 'yearly',
      legalFee,
      agencyFee,
      cautionFee,
      rentHouseType: 'duplex_detached',
      houseType: 'duplex_detached',
      rentRoadCondition: 'tarred',
      roadCondition: 'tarred',
      roadImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
      roadImagePublicId: null,
      storeRoom: true,
      furnished: false,
      serviced: true,
      images: SAMPLE_PHOTOS.rent.slice(0, 4),
      coverImage: SAMPLE_PHOTOS.rent[0],
      thumbnail: SAMPLE_PHOTOS.rent[0],
      gallery: SAMPLE_PHOTOS.rent.slice(0, 4),
      state,
      city: 'Lekki',
      locationName: 'Lekki, Lagos',
      address: 'Plot 14A, Admiralty Way, Lekki Phase 1',
      streetAddress: 'Plot 14A, Admiralty Way, Lekki Phase 1',
      location: 'Lekki Phase 1, Lagos, Nigeria',
      lat: coords.lat,
      lon: coords.lon,
      latitude: coords.lat,
      longitude: coords.lon,
      mapLat: coords.lat,
      mapLon: coords.lon,
      amenities: ['24/7 Power', 'Security', 'Water Supply', 'Parking', 'Estate Road'],
      rating: 0,
      totalReviews: 0,
      slug: slugify('4-bed-duplex-lekki-individual'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    stats.house_listings++;
    console.log(`   └─ Added INDIVIDUAL Rent listing → house_listings/${id}`);
  }

  // E.2 Individual Land Property → top-level house_listings
  {
    const id = db.collection('house_listings').doc().id;
    const state = 'Owerri';
    const coords = STATE_COORDS[state] || { lat: 5.4832, lon: 7.0335 };
    const plotSizeSqm = 1200;
    const price = 8500000;
    await db.collection('house_listings').doc(id).set({
      id,
      title: '1,200sqm Commercial Land on Port Harcourt Road, Owerri',
      propertyName: '1,200sqm Commercial Land on Port Harcourt Road, Owerri',
      description: 'Flat, well-drained commercial plot directly facing the dual carriage Port Harcourt Road. Perfect for filling station, mall, or office complex.',
      listingType: 'property',
      propertySubType: 'land',
      propertyType: 'land',
      type: 'land',
      typeLabel: 'Land for Lease',
      sellerType: 'individual',
      businessId: null,
      ownerId: individualOwnerId,
      miniSiteActive: false,
      status: 'Approved',
      isActive: true,
      isFeatured: false,
      landSaleType: 'lease',
      saleType: 'lease',
      plotSizeSqm,
      sizeUnit: 'sqm',
      landUseType: 'commercial',
      titleType: 'C-of-O',
      topography: 'flat',
      accessRoad: 'major_highway',
      fenced: true,
      isFenced: true,
      hasSurveyPlan: true,
      surveyPlan: true,
      totalPrice: price,
      price,
      priceNum: price,
      priceLabel: `₦${price.toLocaleString()} / 5-year lease`,
      currency: 'NGN',
      billingPeriod: 'outright-sale',
      images: SAMPLE_PHOTOS.land.slice(0, 3),
      coverImage: SAMPLE_PHOTOS.land[0],
      thumbnail: SAMPLE_PHOTOS.land[0],
      gallery: SAMPLE_PHOTOS.land.slice(0, 3),
      state,
      city: 'Owerri',
      locationName: 'Owerri, Imo',
      address: 'Port Harcourt Road, By Egbu Junction',
      streetAddress: 'Port Harcourt Road, By Egbu Junction',
      location: 'Owerri, Imo State, Nigeria',
      lat: coords.lat,
      lon: coords.lon,
      latitude: coords.lat,
      longitude: coords.lon,
      mapLat: coords.lat,
      mapLon: coords.lon,
      amenities: [],
      rating: 0,
      totalReviews: 0,
      slug: slugify('1200sqm-land-owerri-lease-individual'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    stats.house_listings++;
    console.log(`   └─ Added INDIVIDUAL Land (Lease) listing → house_listings/${id}`);
  }

  // E.3 Individual Commercial Property → top-level house_listings (Filling Station)
  {
    const id = db.collection('house_listings').doc().id;
    const state = 'Rivers';
    const coords = STATE_COORDS[state] || { lat: 4.8156, lon: 7.0498 };
    const price = 450000000;
    const hasPower = true, hasWater = true, hasSecurity = true, hasParking = true;
    const hasWarehouse = false, hasLoadingBay = true, hasOfficeSpace = true, hasInternet = false;
    const amenitiesList = [];
    if (hasPower) amenitiesList.push('Power Supply');
    if (hasWater) amenitiesList.push('Water Supply');
    if (hasSecurity) amenitiesList.push('Security');
    if (hasParking) amenitiesList.push('Parking');
    if (hasWarehouse) amenitiesList.push('Warehouse');
    if (hasLoadingBay) amenitiesList.push('Loading Bay');
    if (hasOfficeSpace) amenitiesList.push('Office Space');
    if (hasInternet) amenitiesList.push('Internet');
    await db.collection('house_listings').doc(id).set({
      id,
      title: 'Functional Filling Station with 6 Pumps + BQ on Aba Expressway',
      propertyName: 'Functional Filling Station with 6 Pumps + BQ on Aba Expressway',
      description: 'Turn-key filling station on 1.8 hectares along Aba-Port Harcourt express. DPR certified, 6-nozzle digital pump island, 2nos 45,000L PMS tanks + 1no 33,000L diesel tank.',
      listingType: 'property',
      propertySubType: 'commercial',
      propertyType: 'commercial',
      type: 'commercial',
      typeLabel: 'Commercial Outright Sale',
      commercialType: 'filling_station',
      spaceSizeSqm: 18000,
      capacity: 6,
      sellerType: 'individual',
      businessId: null,
      ownerId: individualOwnerId,
      miniSiteActive: false,
      status: 'Approved',
      isActive: true,
      isFeatured: true,
      hasPower, hasWater, hasSecurity, hasParking,
      hasWarehouse, hasLoadingBay, hasOfficeSpace, hasInternet,
      amenities: amenitiesList,
      totalPrice: price,
      price,
      priceNum: price,
      priceLabel: `₦${(price / 1000000).toFixed(1)}M outright`,
      currency: 'NGN',
      billingPeriod: 'outright-sale',
      images: SAMPLE_PHOTOS.commercial.slice(0, 4),
      coverImage: SAMPLE_PHOTOS.commercial[0],
      thumbnail: SAMPLE_PHOTOS.commercial[0],
      gallery: SAMPLE_PHOTOS.commercial.slice(0, 4),
      state,
      city: 'Port Harcourt',
      locationName: 'Port Harcourt, Rivers',
      address: 'Aba Expressway, By Eliozu Flyover',
      streetAddress: 'Aba Expressway, By Eliozu Flyover',
      location: 'Port Harcourt, Rivers State, Nigeria',
      lat: coords.lat,
      lon: coords.lon,
      latitude: coords.lat,
      longitude: coords.lon,
      mapLat: coords.lat,
      mapLon: coords.lon,
      rating: 0,
      totalReviews: 0,
      slug: slugify('filling-station-aba-expressway-individual'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    stats.house_listings++;
    console.log(`   └─ Added INDIVIDUAL Commercial (Filling Station) → house_listings/${id}`);
  }

  // E.4 Individual Marketplace Product → top-level marketplace
  {
    const id = db.collection('marketplace').doc().id;
    const state = 'Lagos';
    const coords = STATE_COORDS[state] || { lat: 6.5244, lon: 3.3792 };
    const price = 185000;
    await db.collection('marketplace').doc(id).set({
      id,
      title: 'UK-Used Samsung Galaxy S24 Ultra 512GB (Factory Unlocked)',
      name: 'UK-Used Samsung Galaxy S24 Ultra 512GB (Factory Unlocked)',
      description: 'Barely-used 3 months, 98% battery health, comes with original 45W charger and S-Pen. Factory unlocked for all networks. Physical and eSIM support.',
      listingType: 'product',
      productCategory: 'Electronics',
      category: 'Mobile Phones',
      condition: 'fairly_used',
      price,
      priceNum: price,
      originalPrice: 220000,
      priceLabel: `₦${price.toLocaleString()}`,
      currency: 'NGN',
      stock: 1,
      status: 'Active',
      isActive: true,
      isFeatured: false,
      sellerType: 'individual',
      businessId: null,
      ownerId: individualOwnerId,
      tags: ['samsung', 's24', 'ultra', 'phone'],
      images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'],
      coverImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
      gallery: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80'],
      state,
      city: 'Surulere',
      locationName: 'Surulere, Lagos',
      location: 'Surulere, Lagos, Nigeria',
      address: '18 Ogunlana Drive, Surulere',
      lat: coords.lat,
      lon: coords.lon,
      rating: 0,
      totalReviews: 0,
      slug: slugify('samsung-s24-ultra-individual'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    stats.marketplace++;
    console.log(`   └─ Added INDIVIDUAL Marketplace Product → marketplace/${id}`);
  }

  // E.5 Individual Event → top-level events
  {
    const id = db.collection('events').doc().id;
    const state = 'FCT (Abuja)';
    const coords = STATE_COORDS[state] || { lat: 9.0579, lon: 7.4951 };
    const ticketTypes = [
      { name: 'Early Bird', price: 5000, quantity: 200, sold: 42 },
      { name: 'Regular', price: 10000, quantity: 500, sold: 110 },
      { name: 'VIP (Canapé Included)', price: 35000, quantity: 100, sold: 27 },
    ];
    const priceMin = ticketTypes.reduce((m, t) => Math.min(m, t.price), Infinity);
    const priceLabel = priceMin === 0 ? 'Free' : `From ₦${priceMin.toLocaleString()}`;
    const ticketsAvailable = ticketTypes.reduce((a, t) => a + Number(t.quantity || 0), 0);
    const ticketsSold = ticketTypes.reduce((a, t) => a + Number(t.sold || 0), 0);
    await db.collection('events').doc(id).set({
      id,
      title: 'WIT & WHISKEY — Abuja Singles Mixer (Ages 28–40)',
      description: 'An exclusive, curated evening of cocktails, canapés, live jazz and icebreaker games for 200 professional singles in Abuja. Strictly by RSVP.',
      venue: 'The Art Hotel, Wuse II',
      address: '115 Adetokunbo Ademola Crescent, Wuse 2',
      state,
      city: 'Abuja',
      location: 'Wuse II, Abuja, Nigeria',
      startDate: '2026-10-08T17:00:00Z',
      endDate: '2026-10-08T23:00:00Z',
      startTime: '18:00',
      endTime: '23:00',
      startDateTime: '2026-10-08T17:00:00Z',
      endDateTime: '2026-10-08T23:00:00Z',
      coverImage: SAMPLE_PHOTOS.events[0],
      images: [SAMPLE_PHOTOS.events[0]],
      image: SAMPLE_PHOTOS.events[0],
      category: 'Social',
      eventCategory: 'Social',
      eventType: 'Networking',
      isFeatured: true,
      isActive: true,
      status: 'Active',
      ownerId: individualOwnerId,
      organizerId: individualOwnerId,
      sellerType: 'individual',
      businessId: null,
      price: priceLabel,
      priceNum: priceMin,
      minPrice: priceMin,
      ticketTypes,
      ticketsAvailable,
      ticketsSold,
      lat: coords.lat,
      lon: coords.lon,
      rating: 0,
      totalReviews: 0,
      slug: slugify('wit-whiskey-abuja-mixer-individual'),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    stats.top_level_events++;
    console.log(`   └─ Added INDIVIDUAL Event → events/${id}`);
  }

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
  console.log('Summary of Created Documents (pure business subcollections):');
  console.table(stats);
  console.log('All nested structures verified - all listings under businesses/*');
}

seedDatabase().catch((err) => {
  console.error('\n❌ Fatal Seeding Error:', err);
  process.exit(1);
});
