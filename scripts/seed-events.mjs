#!/usr/bin/env node
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import 'dotenv/config';

// Firebase config - uses environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const events = [
  {
    id: '1',
    title: 'Lagos Food & Wine Festival',
    description: 'Experience the finest culinary delights from top chefs across Nigeria. Live cooking demonstrations, wine tasting, and gourmet food sampling.',
    date: '2024-06-15',
    time: '12:00 PM',
    location: 'Eko Atlantic, Lagos',
    price: 5000,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Food & Drink',
    organizer: 'Lagos Culinary Guild',
    attendees: 245,
    maxAttendees: 500,
    rating: 4.8,
    reviews: 89,
    isFeatured: true,
    tags: ['food', 'wine', 'festival', 'tasting']
  },
  {
    id: '2',
    title: 'Tech Summit Abuja 2024',
    description: 'Connect with tech leaders, innovators, and entrepreneurs. Keynote speeches, panel discussions, and networking opportunities.',
    date: '2024-07-20',
    time: '9:00 AM',
    location: 'Abuja International Conference Center',
    price: 15000,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Technology',
    organizer: 'TechHub Nigeria',
    attendees: 180,
    maxAttendees: 300,
    rating: 4.6,
    reviews: 67,
    tags: ['tech', 'conference', 'networking', 'innovation']
  },
  {
    id: '3',
    title: 'Afrobeats Night Live',
    description: 'An unforgettable night of live Afrobeats music featuring top Nigerian artists. Dance, enjoy, and experience the best of Nigerian music culture.',
    date: '2024-06-30',
    time: '8:00 PM',
    location: 'Eko Hotels & Suites, Lagos',
    price: 7500,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Music & Entertainment',
    organizer: 'Beat Entertainment',
    attendees: 320,
    maxAttendees: 450,
    rating: 4.9,
    reviews: 124,
    isFeatured: true,
    tags: ['music', 'afrobeats', 'live', 'concert']
  },
  {
    id: '4',
    title: 'Art Exhibition: Nigerian Masters',
    description: 'Celebrate Nigerian contemporary art with works from renowned artists. Gallery tours, artist meet-and-greets, and art workshops.',
    date: '2024-07-10',
    time: '10:00 AM',
    location: 'Nike Art Gallery, Lagos',
    price: 2000,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Arts & Culture',
    organizer: 'Nigerian Artists Association',
    attendees: 89,
    maxAttendees: 150,
    rating: 4.7,
    reviews: 45,
    tags: ['art', 'exhibition', 'culture', 'gallery']
  },
  {
    id: '5',
    title: 'Entrepreneurship Workshop',
    description: 'Learn from successful Nigerian entrepreneurs. Business strategies, funding opportunities, and growth hacking techniques.',
    date: '2024-08-05',
    time: '2:00 PM',
    location: 'Co-Creation Hub, Abuja',
    price: 3500,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Business',
    organizer: 'Startup Nigeria',
    attendees: 67,
    maxAttendees: 100,
    rating: 4.5,
    reviews: 34,
    tags: ['business', 'workshop', 'entrepreneurship', 'learning']
  },
  {
    id: '6',
    title: 'Beach Volleyball Tournament',
    description: 'Join the exciting beach volleyball competition at Tarkwa Bay. Professional players, amateur teams, and family fun activities.',
    date: '2024-07-25',
    time: '10:00 AM',
    location: 'Tarkwa Bay Beach, Lagos',
    price: 1000,
    currency: 'NGN',
    image: '/api/placeholder/400/250',
    category: 'Sports & Recreation',
    organizer: 'Lagos Sports Club',
    attendees: 156,
    maxAttendees: 200,
    rating: 4.4,
    reviews: 28,
    tags: ['sports', 'volleyball', 'beach', 'tournament']
  }
];

const seedEvents = async () => {
  console.log('Starting to seed events...');

  for (const event of events) {
    try {
      const eventRef = doc(db, 'events', event.id);
      await setDoc(eventRef, {
        ...event,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Successfully added event: ${event.title}`);
    } catch (error) {
      console.error(`Error adding event ${event.id}:`, error);
    }
  }

  console.log('Seeding completed!');
  process.exit(0);
};

seedEvents();