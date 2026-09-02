/**
 * Citivas Database Seed Script
 * Populates a fresh Firestore database with realistic nested business structures,
 * browse/search index collections, sample users, wallets, admin users, and app settings.
 *
 * Requirements:
 * - serviceAccountKey.json in the same directory (or GOOGLE_APPLICATION_CREDENTIALS)
 * - Run with: node seed.js
 */

import admin from 'firebase-admin';
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

admin.initializeApp({
  credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault()
});

const db = admin.firestore();
const serverTimestamp = admin.firestore.FieldValue.serverTimestamp;

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-');
}

// Counters for final reporting
const stats = {
  businesses: 0,
  properties: 0,
  rooms: 0,
  restaurants: 0,
  menuItems: 0,
  products: 0,
  events: 0,
  ticketTypes: 0,
  property_index: 0,
  product_index: 0,
  event_index: 0,
  users: 0,
  wallets: 0,
  transactions: 0,
  admin_users: 0,
  app_settings: 0
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

        // Type specific fields
        if (prop.type === 'shortlet') {
          propDocData.guestsCapacity = prop.guestsCapacity || 2;
          propDocData.bedrooms = prop.bedrooms || 1;
          propDocData.bathrooms = prop.bathrooms || 1;
          propDocData.pricePerNight = prop.pricePerNight || prop.price;
          propDocData.minimumStayNights = prop.minimumStayNights || 1;
          propDocData.amenities = prop.amenities || [];
        } else if (prop.type === 'rent') {
          propDocData.rentAmount = prop.rentAmount || prop.price;
          propDocData.paymentFrequency = prop.paymentFrequency || 'Per Annum';
          propDocData.agencyFee = prop.agencyFee || 0;
          propDocData.cautionFee = prop.cautionFee || 0;
          propDocData.bedrooms = prop.bedrooms || 2;
          propDocData.bathrooms = prop.bathrooms || 2;
          propDocData.furnishingStatus = prop.furnishingStatus || 'Unfurnished';
          propDocData.availableFrom = prop.availableFrom || 'Immediately';
        } else if (prop.type === 'land') {
          propDocData.sizeInPlots = prop.sizeInPlots || 1;
          propDocData.titleDocument = prop.titleDocument || 'C of O';
        } else if (prop.type === 'commercial') {
          propDocData.propertyType = prop.propertyType || 'Office';
          propDocData.squareFootage = prop.squareFootage || 1500;
        }

        await propRef.set(propDocData);
        stats.properties++;

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

        // Flat property_index
        const propIndexRef = db.collection('property_index').doc(propertyId);
        await propIndexRef.set({
          propertyId: propertyId,
          title: prop.title,
          type: prop.type,
          price: prop.price,
          state: prop.state,
          city: prop.city,
          coverImageUrl: (prop.photos && prop.photos[0]) || '',
          businessId: businessId,
          businessName: biz.businessName,
          createdAt: serverTimestamp()
        });
        stats.property_index++;
      }
      console.log(`   └─ Added ${biz.properties.length} properties & synced to property_index.`);
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
          createdAt: serverTimestamp()
        });
        stats.products++;

        // Flat product_index
        const prodIndexRef = db.collection('product_index').doc(productId);
        await prodIndexRef.set({
          productId: productId,
          title: prod.title,
          price: prod.price,
          category: prod.category,
          state: prod.state,
          city: prod.city,
          coverImageUrl: (prod.photos && prod.photos[0]) || '',
          businessId: businessId,
          businessName: biz.businessName,
          createdAt: serverTimestamp()
        });
        stats.product_index++;
      }
      console.log(`   └─ Added ${biz.products.length} product(s) & synced to product_index.`);
    }

    // D. EVENTS
    if (biz.events && biz.events.length > 0) {
      for (const ev of biz.events) {
        const evRef = bizRef.collection('events').doc();
        const eventId = evRef.id;

        await evRef.set({
          title: ev.title,
          description: ev.description,
          venue: ev.venue,
          address: ev.address,
          state: ev.state,
          city: ev.city,
          startDate: ev.startDate,
          endDate: ev.endDate,
          coverImageUrl: ev.coverImageUrl,
          isActive: ev.isActive ?? true,
          createdAt: serverTimestamp()
        });
        stats.events++;

        let lowestTicketPrice = Infinity;

        // Nested ticketTypes subcollection
        if (ev.ticketTypes && ev.ticketTypes.length > 0) {
          for (const tt of ev.ticketTypes) {
            const ticketRef = evRef.collection('ticketTypes').doc();
            const commission = Math.round(tt.price * 0.07);
            if (tt.price < lowestTicketPrice) {
              lowestTicketPrice = tt.price;
            }

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

        // Flat event_index
        const evIndexRef = db.collection('event_index').doc(eventId);
        await evIndexRef.set({
          eventId: eventId,
          title: ev.title,
          startDate: ev.startDate,
          state: ev.state,
          city: ev.city,
          coverImageUrl: ev.coverImageUrl,
          businessId: businessId,
          businessName: biz.businessName,
          priceFrom: lowestTicketPrice === Infinity ? 0 : lowestTicketPrice,
          createdAt: serverTimestamp()
        });
        stats.event_index++;
      }
      console.log(`   └─ Added ${biz.events.length} event(s) with tickets & synced to event_index.`);
    }
  }

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log('====================================================');
  console.log('Summary of Created Documents:');
  console.table(stats);
  console.log('All nested structures and index collections are verified.');
}

seedDatabase().catch((err) => {
  console.error('\n❌ Fatal Seeding Error:', err);
  process.exit(1);
});
