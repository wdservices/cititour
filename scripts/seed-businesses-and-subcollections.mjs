#!/usr/bin/env node
/**
 * Citivas Database Seeder & Migration Script
 * Migrates and seeds businesses as the primary parent entity with rich subcollections:
 * - /businesses/{businessId}
 *   - /properties/{propertyId} (4 sub-types: rent, shortlet/hotel, land, commercial)
 *   - /products/{productId}    (marketplace items / products / merchandise)
 *   - /events/{eventId}        (ticketing & events)
 *   - /menu/{menuItemId}       (restaurant digital menu items)
 *   - /reviews/{reviewId}      (verified reviews)
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, Timestamp, getDocs, deleteDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseAppletConfig from '../firebase-applet-config.json' with { type: 'json' };

const app = initializeApp(firebaseAppletConfig);
const db = (firebaseAppletConfig.firestoreDatabaseId && firebaseAppletConfig.firestoreDatabaseId !== "(default)")
  ? getFirestore(app, firebaseAppletConfig.firestoreDatabaseId)
  : getFirestore(app);
const auth = getAuth(app);

const u = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const cleanObj = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  );
};

// ── Authenticate as Admin ──
async function authenticateAdmin() {
  const usersToTry = [
    { email: 'migrator@tourph.com', pass: 'TourPHMigration2026!' },
    { email: 'hello.bluewavestech@gmail.com', pass: 'Bwtng@26' },
  ];

  for (const u of usersToTry) {
    try {
      const cred = await signInWithEmailAndPassword(auth, u.email, u.pass);
      console.log(`Authenticated as admin: ${cred.user.email} (${cred.user.uid})`);
      return cred.user.uid;
    } catch (err) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const cred = await createUserWithEmailAndPassword(auth, u.email, u.pass);
          console.log(`Created admin user: ${cred.user.email} (${cred.user.uid})`);
          return cred.user.uid;
        } catch (createErr) {
          console.warn(`Could not create ${u.email}:`, createErr.message);
        }
      }
    }
  }
  return '2Ar50B5FO6dRmb2yipo1sRPSiGN2';
}

// ── Business Data Tree ──
const businessesSeed = [
  {
    id: 'AT3egQd3ZXfVPpr5yjv1',
    name: 'Asemi Apartment',
    title: 'Asemi Apartment',
    businessName: 'Asemi Apartment',
    slug: 'asemi-apartment-ph',
    category: 'Hotel',
    tagline: 'Premium Serviced Shortlet Apartments & Executive Living in Port Harcourt',
    description: 'At Asemi Apartments, hospitality and comfort redefined. Our carefully curated collection of premium apartments offers 24/7 power, luxury interiors, super-fast Wi-Fi, and dedicated concierge in Obio/Akpor.',
    image: 'https://res.cloudinary.com/dvlgvtqn/image/upload/v1787929840/listings/6e09c68f-2d95-4051-b8dd-e28e489e2fce.jpg',
    images: [
      'https://res.cloudinary.com/dvlgvtqn/image/upload/v1787929770/listings/arfed.png',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    ],
    imagePublicIds: ['listings/arfed'],
    cover: 'https://res.cloudinary.com/dvlgvtqn/image/upload/v1787929770/listings/arfed.png',
    phone: '08108510085',
    whatsapp: '2348108510085',
    streetAddress: 'Obio/Akpor, Rivers State, Nigeria',
    address: 'Obio/Akpor, Rivers State, Nigeria',
    location: 'Port Harcourt, Rivers',
    city: 'Port Harcourt',
    state: 'Rivers',
    lat: 4.849945379463527,
    lon: 6.963506409640785,
    ownerId: '397YKWX6s5OdwgUnxGLhvj8t3j1',
    isOpen: true,
    rating: 4.9,
    reviewsCount: 12,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Asemi', 'Port Harcourt', 'Hotel', 'Shortlet', 'Luxury Stays'],
    properties: [
      {
        id: 'prop-asemi-ph-shortlet-01',
        title: 'Asemi Executive 3-Bedroom Serviced Shortlet (Obio/Akpor)',
        propertySubType: 'shortlet',
        type: 'Shortlet & Hotel',
        description: 'Fully furnished 3-bedroom serviced apartment in Obio/Akpor with 24/7 power, superfast fiber Wi-Fi, air conditioning, smart TVs, and dedicated parking.',
        price: '₦75,000/night',
        pricePerNight: 75000,
        currency: 'NGN',
        bedrooms: 3,
        bathrooms: 3,
        guests: 6,
        location: 'Port Harcourt, Rivers',
        address: 'Obio/Akpor, Rivers State, Nigeria',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: 'https://res.cloudinary.com/dvlgvtqn/image/upload/v1787929770/listings/arfed.png',
        gallery: [
          'https://res.cloudinary.com/dvlgvtqn/image/upload/v1787929770/listings/arfed.png',
          'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
        ],
        amenities: ['WiFi', 'Parking', 'Full Kitchen', '24h Power', 'Air Conditioning', 'Smart TVs', 'Security'],
        rating: 4.9,
        reviews: 12,
        status: 'Approved',
        miniSiteActive: true,
        isFeatured: true,
      },
      {
        id: 'prop-asemi-ph-rent-02',
        title: 'GRA Phase 2 Luxury 4-Bedroom Semi-Detached Duplex',
        propertySubType: 'rent',
        type: 'Apartment / Duplex',
        description: 'Spacious 4-bedroom duplex in a secure, serene GRA Phase 2 neighborhood. Complete with fitted kitchen, security post, and ample parking space.',
        price: '₦5,000,000/year',
        pricePerMonth: 416666,
        priceTotal: 5000000,
        currency: 'NGN',
        bedrooms: 4,
        bathrooms: 4,
        guests: 8,
        location: 'GRA Phase 2, Port Harcourt, Rivers',
        address: 'GRA Phase 2, Port Harcourt, Rivers',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: u('1600585154340-be6161a56a0c'),
        gallery: [u('1600566753086-00f18fb6b3ea'), u('1522708323590-d24dbb6b0267')],
        amenities: ['WiFi', 'Parking', '24h Security', 'Fitted Kitchen', 'Balcony'],
        rating: 4.8,
        reviews: 6,
        status: 'Approved',
      },
      {
        id: 'prop-asemi-ph-land-03',
        title: 'Greater Port Harcourt City 1,000 sqm Dry Plot',
        propertySubType: 'land',
        type: 'Land',
        description: 'Prime 1,000 sqm residential/commercial plot in Greater Port Harcourt City. Clean title document, fully demarcated and ready for immediate development.',
        price: '₦35,000,000',
        priceTotal: 35000000,
        currency: 'NGN',
        plotSize: '1,000 sqm',
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: 'Greater Port Harcourt, Rivers',
        address: 'Greater Port Harcourt City Phase 1, Rivers',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: u('1500381123146-e5131e291f67'),
        gallery: [u('1464146071629-c2f83e42bd37')],
        amenities: ['Tarred Access', 'Survey Plan', 'C of O in Progress'],
        rating: 5.0,
        reviews: 2,
        status: 'Approved',
      },
      {
        id: 'prop-asemi-ph-comm-04',
        title: 'Trans-Amadi Industrial Open-Plan Corporate Office',
        propertySubType: 'commercial',
        type: 'Commercial Office',
        description: '280 sqm modern commercial space suitable for corporate HQ, tech hub or logistics operations in Trans-Amadi.',
        price: '₦8,000,000/year',
        pricePerMonth: 666666,
        priceTotal: 8000000,
        currency: 'NGN',
        areaSize: '280 sqm',
        bedrooms: 0,
        bathrooms: 3,
        guests: 30,
        location: 'Trans-Amadi, Port Harcourt, Rivers',
        address: 'Trans-Amadi Industrial Layout, Port Harcourt',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: u('1497366216548-37526070297c'),
        gallery: [u('1497366811353-6870744d04b2')],
        amenities: ['Elevator', '24h Power', 'Dedicated Parking', 'Security Gatehouse'],
        rating: 4.8,
        reviews: 5,
        status: 'Approved',
      }
    ],
    reviews: [
      {
        id: 'rev-asemi-ph-01',
        userName: 'Chukwudi O.',
        rating: 5,
        comment: 'The apartment is stunning and the 24/7 power and AC was consistent throughout our 5-day stay.',
        date: '2026-08-29'
      }
    ]
  },
  {
    id: 'biz-lekki-prime',
    name: 'Lekki Prime Real Estate & Property Advisory',
    slug: 'lekki-prime-real-estate',
    category: 'Real Estate & Properties',
    tagline: 'Premium residential, shortlet stays, commercial & land investments in Lagos',
    description: 'Lekki Prime is a premier Nigerian real estate advisory delivering verified luxury residences, high-yield shortlets, commercial towers, and dry titled land plots across Lekki Phase 1, Ikoyi, Victoria Island, and Epe.',
    cover: u('1600596542815-ffad4c1539a9'),
    images: [
      u('1600596542815-ffad4c1539a9'),
      u('1600607687939-ce8a6c25118c'),
      u('1600566753086-00f18fb6b3ea'),
      u('1600585154340-be6161a56a0c'),
    ],
    logo: u('1560448204-e02f11c3d0e2', 400),
    phone: '+234 810 222 0011',
    whatsapp: '2348102220011',
    email: 'info@lekkiprime.ng',
    website: 'https://lekkiprime.ng',
    address: '14 Admiralty Way, Lekki Phase 1, Lagos',
    location: 'Lekki Phase 1, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    rating: 4.9,
    reviewsCount: 54,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Real Estate', 'Shortlet', 'Rent', 'Land', 'Commercial'],
    properties: [
      {
        id: 'prop-lekki-rent-01',
        title: 'Modern 3-Bedroom Serviced Terrace with BQ',
        propertySubType: 'rent',
        type: 'Apartment / Terrace',
        description: 'Newly finished 3-bedroom terrace duplex in a gated Lekki Phase 1 estate. 24/7 power supply, fitted Italian kitchen, CCTV, Olympic swimming pool, children play area, and dedicated 2-car parking.',
        price: '₦4,500,000/year',
        pricePerMonth: 375000,
        priceTotal: 4500000,
        currency: 'NGN',
        bedrooms: 3,
        bathrooms: 4,
        guests: 6,
        location: 'Lekki Phase 1, Lagos',
        address: '19B Admiralty Road, Lekki Phase 1, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        image: u('1522708323590-d24dbb6b0267'),
        gallery: [u('1560448204-e02f11c3d0e2'), u('1502672260266-1c1ef2d93688'), u('1493809842364-78817add7ffb')],
        amenities: ['WiFi', 'Parking', 'Full Kitchen', 'Laundry', '24h Power', 'Swimming Pool', 'Gym', 'CCTV Security'],
        rating: 4.8,
        reviews: 24,
        status: 'Approved',
        isFeatured: true,
      },
      {
        id: 'prop-lekki-shortlet-02',
        title: 'Luxury Oceanview Penthouse Shortlet',
        propertySubType: 'shortlet',
        type: 'Penthouse / Shortlet',
        description: 'Stunning 3-bedroom penthouse with panoramic ocean views, modern interiors, private rooftop terrace and infinity plunge pool. Chef kitchen, home automation, 24/7 concierge.',
        price: '₦120,000/night',
        pricePerNight: 120000,
        currency: 'NGN',
        bedrooms: 3,
        bathrooms: 3,
        guests: 6,
        location: 'Victoria Island, Lagos',
        address: '4A Yesufu Abiodun, Victoria Island, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        image: u('1600596542815-ffad4c1539a9'),
        gallery: [u('1600607687939-ce8a6c25118c'), u('1600566753086-00f18fb6b3ea'), u('1600585154340-be6161a56a0c')],
        amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Full Kitchen', 'Gym', 'Laundry', 'Balcony/Terrace', '24h Power', 'Concierge', 'Elevator'],
        rating: 4.9,
        reviews: 47,
        status: 'Approved',
        miniSiteActive: true,
        isFeatured: true,
      },
      {
        id: 'prop-lekki-land-03',
        title: 'Lekki Scheme 2 Dry Residential Plot (600 sqm)',
        propertySubType: 'land',
        type: 'Land Plot',
        description: '600 sqm 100% dry corner plot in Lekki Scheme 2. Clean Certificate of Occupancy (C of O), paved road access, perimeter fencing, excellent drainage. Ideal for building private duplexes or rental flats.',
        price: '₦22,000,000',
        priceTotal: 22000000,
        currency: 'NGN',
        plotSize: '600 sqm',
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: 'Lekki Scheme 2, Lagos',
        address: 'Block 56, Lekki Scheme II, Ajah, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        image: u('1500381123146-e5131e291f67'),
        gallery: [u('1500381130435-de0a34a0b163'), u('1500381143625-c5469399b396')],
        amenities: ['Tarred Road', 'Drainage', 'Fenced', 'Electricity Access', 'C of O Ready'],
        rating: 5.0,
        reviews: 8,
        status: 'Approved',
      },
      {
        id: 'prop-lekki-comm-04',
        title: 'Grade-A Open Plan Commercial Office & Showroom',
        propertySubType: 'commercial',
        type: 'Commercial Office / Showroom',
        description: '450 sqm Grade-A open plan commercial floor on Victoria Island. Floor-to-ceiling glass facade, dedicated transformer & generator, 15 underground parking bays, passenger elevator, 24/7 security.',
        price: '₦12,000,000/year',
        pricePerMonth: 1000000,
        priceTotal: 12000000,
        currency: 'NGN',
        areaSize: '450 sqm',
        bedrooms: 0,
        bathrooms: 4,
        guests: 50,
        location: 'Victoria Island, Lagos',
        address: 'Plot 28B Adeola Odeku Street, Victoria Island, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        image: u('1497366216548-37526070297c'),
        gallery: [u('1497366811353-6870744d04b2'), u('1497215728101-856f4ea42174')],
        amenities: ['Elevator', '24h Power', 'Underground Parking', 'Central AC', 'Fire Suppression', 'CCTV'],
        rating: 4.7,
        reviews: 12,
        status: 'Approved',
      }
    ],
    reviews: [
      {
        id: 'rev-lp-01',
        userName: 'Emeka Nwosu',
        rating: 5,
        comment: 'Exceptional service! Found our dream shortlet in VI effortlessly. Everything was exactly as described.',
        date: '2026-02-15'
      }
    ]
  },
  {
    id: 'biz-asemi-suites',
    name: 'Asemi Luxury Stays & Apartments',
    slug: 'asemi-luxury-stays',
    category: 'Hotels & Stays',
    tagline: 'Serviced 3-bedroom shortlet apartments, villas & suites in Abuja',
    description: 'Asemi Luxury Stays is Abuja’s highest-rated executive hospitality provider. Offering fully serviced luxury suites with 24/7 power, smart home amenities, super-fast fiber Wi-Fi, and private concierge.',
    cover: u('1600566753086-00f18fb6b3ea'),
    images: [
      u('1600566753086-00f18fb6b3ea'),
      u('1590490360182-c33d57733427'),
      u('1618773928121-c32242e63f39'),
      u('1566665797739-1674de7a421a')
    ],
    logo: u('1600566753086-00f18fb6b3ea', 400),
    phone: '+234 703 999 0007',
    whatsapp: '2347039990007',
    email: 'asemi@premierstays.ng',
    website: 'https://asemi.citivas.ng',
    address: '11 Nyerere Crescent, Wuye District, Abuja',
    location: 'Wuye District, Abuja FCT',
    city: 'Abuja',
    state: 'FCT',
    country: 'Nigeria',
    rating: 4.9,
    reviewsCount: 126,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Asemi', 'Abuja', 'Shortlet', 'Luxury Stays', 'Villa'],
    properties: [
      {
        id: 'prop-asemi-apt-01',
        title: 'Asemi Premium 3-Bed Serviced Shortlet (Wuye)',
        propertySubType: 'shortlet',
        type: 'Serviced Apartment',
        description: 'Fully serviced 3-bedroom short-let apartment with premium finishes in a high-security estate. 24/7 power, inverter backup, 3 smart TVs, sound system, all rooms ensuite.',
        price: '₦95,000/night',
        pricePerNight: 95000,
        currency: 'NGN',
        bedrooms: 3,
        bathrooms: 3,
        guests: 6,
        location: 'Wuye, Abuja FCT',
        address: '11 Nyerere Crescent, Wuye District, Abuja',
        city: 'Abuja',
        state: 'FCT',
        image: u('1600566753086-00f18fb6b3ea'),
        gallery: [u('1590490360182-c33d57733427'), u('1618773928121-c32242e63f39'), u('1566665797739-1674de7a421a')],
        amenities: ['WiFi', 'Parking', 'Full Kitchen', 'Gym', 'Laundry', 'Balcony/Terrace', '24h Power', 'Inverter', 'Smart TVs', 'Security'],
        rating: 4.9,
        reviews: 126,
        status: 'Approved',
        miniSiteActive: true,
        isFeatured: true,
      },
      {
        id: 'prop-asemi-rent-02',
        title: 'Maitama 4-Bed Terrace Duplex for Long Lease',
        propertySubType: 'rent',
        type: 'House / Duplex',
        description: 'Newly built 4-bedroom terrace duplex with BQ, fitted kitchen, spacious compound, all bedrooms ensuite, excellent drainage, interlocked compound in Maitama.',
        price: '₦12,000,000/year',
        pricePerMonth: 1000000,
        priceTotal: 12000000,
        currency: 'NGN',
        bedrooms: 4,
        bathrooms: 4,
        guests: 8,
        location: 'Maitama, Abuja FCT',
        address: 'Plot 212 Off IBB Way, Maitama, Abuja',
        city: 'Abuja',
        state: 'FCT',
        image: u('1582719478250-c89cae4dc85b'),
        gallery: [u('1596394516093-501ba68a0ba6'), u('1571003123894-1f0594d2b5d9')],
        amenities: ['Parking', 'Full Kitchen', 'Laundry', '24h Power (Estate)', 'BQ', 'Security'],
        rating: 4.8,
        reviews: 16,
        status: 'Approved',
      },
      {
        id: 'prop-asemi-land-03',
        title: 'Guzape Hills 1.2 Hectare Scenic Land Parcel',
        propertySubType: 'land',
        type: 'Land',
        description: 'Premium 1.2 hectare (12,000 sqm) parcel at Guzape Hills with panoramic Abuja city views. Serene environment, perfect for estate development or luxury mansion.',
        price: '₦450,000,000',
        priceTotal: 450000000,
        currency: 'NGN',
        plotSize: '1.2 Hectares (12,000 sqm)',
        bedrooms: 0,
        bathrooms: 0,
        guests: 0,
        location: 'Guzape Hills, Abuja FCT',
        address: 'Guzape Hills District, Abuja',
        city: 'Abuja',
        state: 'FCT',
        image: u('1464146071629-c2f83e42bd37'),
        gallery: [u('1500381123146-e5131e291f67'), u('1526720234285-12a741fd22ef')],
        amenities: ['Hillside City View', 'C of O Ready', 'Accessible Tarred Road'],
        rating: 5.0,
        reviews: 4,
        status: 'Approved',
      },
      {
        id: 'prop-asemi-comm-04',
        title: 'Wuse 2 Executive Corporate Office Suite',
        propertySubType: 'commercial',
        type: 'Commercial Office',
        description: 'Fully furnished 120 sqm executive office suite on Aminu Kano Crescent, Wuse 2. Includes conference room, reception desk, fiber internet, executive bathroom, and 24/7 electricity.',
        price: '₦7,500,000/year',
        pricePerMonth: 625000,
        priceTotal: 7500000,
        currency: 'NGN',
        areaSize: '120 sqm',
        bedrooms: 0,
        bathrooms: 2,
        guests: 15,
        location: 'Wuse 2, Abuja FCT',
        address: 'Aminu Kano Crescent, Wuse 2, Abuja',
        city: 'Abuja',
        state: 'FCT',
        image: u('1497366754035-f200968a6e72'),
        gallery: [u('1497366811353-6870744d04b2')],
        amenities: ['Furnished', 'Fiber Internet', 'Conference Room', '24h Power', 'Dedicated Security'],
        rating: 4.9,
        reviews: 19,
        status: 'Approved',
      }
    ]
  },
  {
    id: 'biz-yellow-chilli',
    name: 'The Yellow Chilli Restaurant & Lounge',
    slug: 'the-yellow-chilli-ph',
    category: 'Restaurants & Eateries',
    tagline: 'Contemporary Nigerian gourmet kitchen, grills & cocktail lounge',
    description: 'A contemporary Nigerian kitchen plating heritage recipes with a fine-dining finish. Expect smoky jollof from the open fire pit, native seafood soups simmered daily, and a grill counter that runs until midnight.',
    cover: u('1517248135467-4c7edcad34c4'),
    images: [
      u('1517248135467-4c7edcad34c4'),
      u('1414235077428-338989a2e8c0'),
      u('1552566626-52f8b828add9'),
      u('1555396273-367ea4eb4db5')
    ],
    logo: u('1555396273-367ea4eb4db5', 400),
    phone: '+234 803 111 2233',
    whatsapp: '2348031112233',
    email: 'hello@yellowchilliph.ng',
    website: 'https://yellowchilliph.ng',
    address: '18 Olu Obasanjo Road, GRA Phase 2, Port Harcourt',
    location: 'GRA Phase 2, Port Harcourt',
    city: 'Port Harcourt',
    state: 'Rivers',
    country: 'Nigeria',
    rating: 4.8,
    reviewsCount: 184,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Restaurant', 'Fine Dining', 'Nigerian Cuisine', 'Lounge', 'Cocktails'],
    menu: [
      {
        id: 'menu-yc-jollof',
        name: 'Smoky Firewood Party Jollof with Jumbo Prawns',
        description: 'Authentic Nigerian wood-smoked jollof served with jumbo grilled tiger prawns, sweet plantain cubes (dodo) and house coleslaw.',
        price: 7500,
        section: 'Mains & Rice',
        category: 'Rice Dishes',
        image: u('1563379091339-03b21ab4a4f8'),
        popular: true,
        spicy: true,
        isAvailable: true,
      },
      {
        id: 'menu-yc-seafood',
        name: 'Native Rivers Seafood Okro Special',
        description: 'Fresh aromatic seafood soup cooked with jumbo crabs, tiger prawns, periwinkles, snails, and fresh croaker fish. Served with pounded yam.',
        price: 12500,
        section: 'Soups & Swallows',
        category: 'Traditional Soups',
        image: u('1546069901-ba9599a7e63c'),
        popular: true,
        spicy: true,
        isAvailable: true,
      },
      {
        id: 'menu-yc-grill',
        name: 'Spicy Goat Meat Asun & Suya Platter',
        description: 'Tender flame-grilled goat meat chunks seasoned with scotch bonnet peppers, sweet red onions and authentic Yaji suya spice.',
        price: 8000,
        section: 'Grills & Small Chops',
        category: 'Grills & Bites',
        image: u('1544025162-d76694265947'),
        popular: true,
        spicy: true,
        isAvailable: true,
      },
      {
        id: 'menu-yc-chapman',
        name: 'Signature Lagos Chapman Cocktail & Mocktail',
        description: 'House-made sparkling Nigerian Chapman with angostura bitters, citrus slices, cucumber ribbon, and grenadine garnish.',
        price: 3500,
        section: 'Cocktails & Beverages',
        category: 'Drinks',
        image: u('1551024709-8f23befc6f87'),
        popular: true,
        spicy: false,
        isAvailable: true,
      }
    ]
  },
  {
    id: 'biz-citadel-ph',
    name: 'The Citadel Boutique Hotel & Spa',
    slug: 'the-citadel-boutique-hotel',
    category: 'Hotels & Stays',
    tagline: '28-room luxury boutique hotel with rooftop pool, spa & conference centre',
    description: '28-room boutique hotel with rooftop bar, conference room (80 pax), restaurant, 24/7 gym and spa. Fully operational with existing occupancy rates, staff and FnB structure.',
    cover: u('1566073771259-6a8506099945'),
    images: [
      u('1566073771259-6a8506099945'),
      u('1582719478250-c89cae4dc85b'),
      u('1596394516093-501ba68a0ba6'),
      u('1571003123894-1f0594d2b5d9')
    ],
    logo: u('1566073771259-6a8506099945', 400),
    phone: '+234 700 248 2335',
    whatsapp: '2347002482335',
    email: 'info@citadelhotelph.ng',
    website: 'https://citadelhotelph.ng',
    address: '52 Stadium Road, GRA Phase 3, Port Harcourt',
    location: 'GRA Phase 3, Port Harcourt',
    city: 'Port Harcourt',
    state: 'Rivers',
    country: 'Nigeria',
    rating: 4.7,
    reviewsCount: 428,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Hotel', 'Boutique', 'Spa', 'Pool', 'Conferences'],
    properties: [
      {
        id: 'prop-citadel-royal',
        title: 'Citadel Executive Royal King Suite',
        propertySubType: 'hotel',
        type: 'Hotel Suite',
        description: 'King bed suite with marble en-suite bathroom, rain shower, deep soaking tub, private lounge, espresso bar, and city skyline views.',
        price: '₦85,000/night',
        pricePerNight: 85000,
        currency: 'NGN',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        location: 'GRA Phase 3, Port Harcourt',
        address: '52 Stadium Road, GRA Phase 3, Port Harcourt',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: u('1566073771259-6a8506099945'),
        gallery: [u('1582719478250-c89cae4dc85b'), u('1596394516093-501ba68a0ba6')],
        amenities: ['WiFi', 'Parking', 'Swimming Pool', 'Gym', 'Restaurant', 'Spa', '24h Power', 'Room Service', 'Air Conditioning'],
        rating: 4.8,
        reviews: 142,
        status: 'Approved',
        miniSiteActive: true,
      },
      {
        id: 'prop-citadel-hall',
        title: 'Citadel Grand Banquet & Conference Hall',
        propertySubType: 'commercial',
        type: 'Event Hall / Commercial',
        description: '150-capacity conference & banquet hall with high-definition laser projectors, digital audio mixing, banquet seating, and VIP green room.',
        price: '₦350,000/day',
        priceTotal: 350000,
        currency: 'NGN',
        areaSize: '300 sqm',
        bedrooms: 0,
        bathrooms: 4,
        guests: 150,
        location: 'GRA Phase 3, Port Harcourt',
        address: '52 Stadium Road, GRA Phase 3, Port Harcourt',
        city: 'Port Harcourt',
        state: 'Rivers',
        image: u('1519167758481-83f550bb49b3'),
        gallery: [u('1511578314322-379afb476865')],
        amenities: ['Stage & Lighting', 'Sound System', 'Projector', 'Air Conditioning', 'VIP Lounge', '24h Power'],
        rating: 4.9,
        reviews: 28,
        status: 'Approved',
      }
    ]
  },
  {
    id: 'biz-techhub-ng',
    name: 'TechHub Nigeria & Innovation Spaces',
    slug: 'techhub-nigeria',
    category: 'Events & Entertainment',
    tagline: 'Tech events, summits, conferences and co-working innovation spaces',
    description: 'Nigeria’s premier technology ecosystem hub hosting global developer hackathons, investor demo days, AI summits, and providing modern creator spaces.',
    cover: u('1540575467063-178a50c2df87'),
    images: [
      u('1540575467063-178a50c2df87'),
      u('1505373877841-8d25f7d46678'),
      u('1475721027785-f74eccf877e2')
    ],
    logo: u('1540575467063-178a50c2df87', 400),
    phone: '+234 809 333 4455',
    whatsapp: '2348093334455',
    email: 'events@techhub.ng',
    website: 'https://techhub.ng',
    address: '23 Commercial Avenue, Sabo, Yaba, Lagos',
    location: 'Yaba, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    rating: 4.8,
    reviewsCount: 96,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Tech', 'Events', 'Conferences', 'Co-working', 'Hackathons'],
    events: [
      {
        id: 'evt-tech-summit-2026',
        title: 'Nigeria Tech & AI Innovation Summit 2026',
        description: 'Connect with 1,500+ tech founders, global AI researchers, product leaders, and venture capitalists. Keynote panels, live startup pitches, hands-on workshops, and executive networking.',
        date: '2026-05-18',
        startDate: '2026-05-18',
        endDate: '2026-05-19',
        time: '09:00 AM - 05:00 PM',
        venue: 'Landmark Centre, Victoria Island, Lagos',
        location: 'Victoria Island, Lagos',
        price: 15000,
        currency: 'NGN',
        category: 'Technology & Business',
        image: u('1540575467063-178a50c2df87'),
        attendees: 420,
        maxAttendees: 1500,
        rating: 4.9,
        reviews: 58,
        isFeatured: true,
        tags: ['Tech', 'AI', 'Startups', 'Venture Capital', 'Networking'],
        status: 'Approved'
      },
      {
        id: 'evt-afrobeats-fest',
        title: 'Afrobeats & Street Culture Live Festival',
        description: 'An electrifying celebration of African music, street fashion, live DJs, art installations, and culinary pop-ups featuring top charting African superstars.',
        date: '2026-06-25',
        startDate: '2026-06-25',
        endDate: '2026-06-25',
        time: '04:00 PM - 02:00 AM',
        venue: 'Eko Atlantic Waterfront Stage, Lagos',
        location: 'Eko Atlantic, Lagos',
        price: 10000,
        currency: 'NGN',
        category: 'Music & Concerts',
        image: u('1470225620780-dba8ba36b745'),
        attendees: 850,
        maxAttendees: 3000,
        rating: 4.9,
        reviews: 94,
        isFeatured: true,
        tags: ['Afrobeats', 'Concert', 'Live Music', 'Festival', 'Lagos Nightlife'],
        status: 'Approved'
      }
    ],
    properties: [
      {
        id: 'prop-yaba-coworking',
        title: 'Modern 10-Desk Private Tech Team Office',
        propertySubType: 'commercial',
        type: 'Commercial Office',
        description: 'Sound-dampened 10-desk dedicated private team suite with 1Gbps fiber internet, ergonomic chairs, motorized standing desks, smart whiteboard, and unlimited coffee.',
        price: '₦650,000/month',
        pricePerMonth: 650000,
        priceTotal: 7800000,
        currency: 'NGN',
        areaSize: '65 sqm',
        bedrooms: 0,
        bathrooms: 2,
        guests: 10,
        location: 'Yaba, Lagos',
        address: '23 Commercial Avenue, Sabo, Yaba, Lagos',
        city: 'Lagos',
        state: 'Lagos',
        image: u('1497366216548-37526070297c'),
        gallery: [u('1497366811353-6870744d04b2')],
        amenities: ['High Speed Fiber', '24h Power', 'Meeting Room Access', 'Podcast Studio', 'Coffee Bar'],
        rating: 4.9,
        reviews: 31,
        status: 'Approved',
      }
    ]
  },
  {
    id: 'biz-alaba-tech',
    name: 'Alaba Tech Hub & Electronics Emporium',
    slug: 'alaba-tech-hub',
    category: 'Shopping & Retail',
    tagline: 'Official distributor of brand new laptops, smartphones, sound & solar systems',
    description: 'Certified dealer of genuine consumer electronics, computing hardware, smart home devices, and solar energy systems with full manufacturer warranty and nationwide express delivery.',
    cover: u('1526738549149-8e07eca6c147'),
    images: [
      u('1526738549149-8e07eca6c147'),
      u('1511707171634-5f897ff02aa9'),
      u('1505740420928-5e560c06d30e')
    ],
    logo: u('1526738549149-8e07eca6c147', 400),
    phone: '+234 803 777 8899',
    whatsapp: '2348037778899',
    email: 'sales@alabatech.ng',
    website: 'https://alabatech.ng',
    address: 'Block 18, Alaba International Market, Ojo, Lagos',
    location: 'Ojo, Lagos',
    city: 'Lagos',
    state: 'Lagos',
    country: 'Nigeria',
    rating: 4.7,
    reviewsCount: 215,
    isVerified: true,
    isFeatured: true,
    status: 'Approved',
    tags: ['Marketplace', 'Electronics', 'Phones', 'Laptops', 'Solar Energy'],
    products: [
      {
        id: 'prod-macbook-pro',
        title: 'Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
        description: 'Brand new factory sealed Space Black MacBook Pro 16-inch with 14-core CPU, 30-core GPU, Liquid Retina XDR display, 1 Year AppleCare warranty.',
        category: 'Computers & Laptops',
        price: 2850000,
        currency: 'NGN',
        image: u('1517336714731-489689fd1ca8'),
        images: [u('1517336714731-489689fd1ca8'), u('1611186871348-b1ce696e52c9')],
        condition: 'Brand New',
        stock: 5,
        rating: 5.0,
        reviews: 29,
        isFeatured: true,
        status: 'Approved',
      },
      {
        id: 'prod-iphone-16',
        title: 'iPhone 16 Pro Max 256GB - Desert Titanium',
        description: 'Factory unlocked iPhone 16 Pro Max with Grade 5 Titanium finish, A18 Pro Bionic chip, 48MP Fusion Camera, and all day battery life.',
        category: 'Phones & Tablets',
        price: 1950000,
        currency: 'NGN',
        image: u('1511707171634-5f897ff02aa9'),
        images: [u('1511707171634-5f897ff02aa9'), u('1592750475338-74b7b21085ab')],
        condition: 'Brand New',
        stock: 12,
        rating: 4.9,
        reviews: 64,
        isFeatured: true,
        status: 'Approved',
      },
      {
        id: 'prod-solar-inverter',
        title: 'Felicity Solar 5kVA Hybrid Inverter & 10kWh Lithium Battery',
        description: 'Complete home & office clean energy kit. 5kVA pure sine wave hybrid inverter, 10kWh LiFePO4 battery pack, smart BMS, wifi mobile monitor app, and professional installation guide.',
        category: 'Home & Solar Power',
        price: 2450000,
        currency: 'NGN',
        image: u('1509391365360-2e959784a276'),
        images: [u('1509391365360-2e959784a276')],
        condition: 'Brand New',
        stock: 8,
        rating: 4.8,
        reviews: 18,
        isFeatured: true,
        status: 'Approved',
      }
    ]
  }
];

async function runSeed() {
  console.log('🚀 Starting Citivas Business Collection Migration & Seeding...');
  const ownerId = await authenticateAdmin();

  let totalBusinesses = 0;
  let totalProperties = 0;
  let totalProducts = 0;
  let totalEvents = 0;
  let totalMenuItems = 0;

  for (const biz of businessesSeed) {
    const bizRef = doc(db, 'businesses', biz.id);
    const { properties = [], products = [], events = [], menu = [], reviews = [], ...bizDocData } = biz;

    const bizPayload = cleanObj({
      ...bizDocData,
      ownerId: bizDocData.ownerId || ownerId,
      propertiesCount: properties.length,
      productsCount: products.length,
      eventsCount: events.length,
      menuCount: menu.length,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    await setDoc(bizRef, bizPayload, { merge: true });
    totalBusinesses++;
    console.log(`\n🏢 Business seeded: [${biz.id}] "${biz.name}" (${biz.category})`);

    // 1. Seed Subcollection: properties
    for (const prop of properties) {
      const propRef = doc(db, 'businesses', biz.id, 'properties', prop.id);
      const propPayload = cleanObj({
        ...prop,
        businessId: biz.id,
        businessName: biz.name,
        businessSlug: biz.slug,
        businessCategory: biz.category,
        businessPhone: biz.phone,
        businessWhatsapp: biz.whatsapp,
        businessEmail: biz.email,
        ownerId: prop.ownerId || ownerId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await setDoc(propRef, propPayload, { merge: true });

      // Also maintain top-level house_listings for seamless backward compatibility
      const legacyPropRef = doc(db, 'house_listings', prop.id);
      await setDoc(legacyPropRef, propPayload, { merge: true });

      totalProperties++;
      console.log(`  🏠 Property [${prop.propertySubType.toUpperCase()}]: ${prop.title}`);
    }

    // 2. Seed Subcollection: products
    for (const prod of products) {
      const prodRef = doc(db, 'businesses', biz.id, 'products', prod.id);
      const prodPayload = cleanObj({
        ...prod,
        businessId: biz.id,
        businessName: biz.name,
        businessSlug: biz.slug,
        ownerId: prod.ownerId || ownerId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await setDoc(prodRef, prodPayload, { merge: true });

      // Also maintain top-level marketplace for seamless backward compatibility
      const legacyProdRef = doc(db, 'marketplace', prod.id);
      await setDoc(legacyProdRef, prodPayload, { merge: true });

      totalProducts++;
      console.log(`  🛍️ Product: ${prod.title} (₦${prod.price.toLocaleString()})`);
    }

    // 3. Seed Subcollection: events
    for (const evt of events) {
      const evtRef = doc(db, 'businesses', biz.id, 'events', evt.id);
      const evtPayload = cleanObj({
        ...evt,
        businessId: biz.id,
        businessName: biz.name,
        businessSlug: biz.slug,
        organizer: biz.name,
        ownerId: evt.ownerId || ownerId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await setDoc(evtRef, evtPayload, { merge: true });

      // Also maintain top-level events for seamless backward compatibility
      const legacyEvtRef = doc(db, 'events', evt.id);
      await setDoc(legacyEvtRef, evtPayload, { merge: true });

      totalEvents++;
      console.log(`  🎟️ Event: ${evt.title} (${evt.date})`);
    }

    // 4. Seed Subcollection: menu
    for (const item of menu) {
      const menuRef = doc(db, 'businesses', biz.id, 'menu', item.id);
      const menuPayload = cleanObj({
        ...item,
        businessId: biz.id,
        businessName: biz.name,
        ownerId: item.ownerId || ownerId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      await setDoc(menuRef, menuPayload, { merge: true });
      totalMenuItems++;
      console.log(`  🍽️ Menu Item: ${item.name} (₦${item.price.toLocaleString()})`);
    }

    // 5. Seed Subcollection: reviews
    for (const rev of reviews) {
      const revRef = doc(db, 'businesses', biz.id, 'reviews', rev.id);
      await setDoc(revRef, cleanObj({
        ...rev,
        businessId: biz.id,
        createdAt: Timestamp.now(),
      }), { merge: true });
    }
  }

  console.log('\n======================================================');
  console.log('🎉 MIGRATION & SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`  • Businesses:   ${totalBusinesses}`);
  console.log(`  • Properties:   ${totalProperties} (Covering Rent, Shortlet, Land, Commercial)`);
  console.log(`  • Products:     ${totalProducts}`);
  console.log(`  • Events:       ${totalEvents}`);
  console.log(`  • Menu Items:   ${totalMenuItems}`);
  console.log('======================================================\n');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
