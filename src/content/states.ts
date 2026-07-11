export interface StateContent {
  slug: string;
  name: string;
  cityLabel: string;
  brandCode: 'LAG' | 'ABJ' | 'PH' | 'KAN';
  populated: boolean;
  hero: string;
  intro: string;
  neighborhoods: string[];
  faq: { q: string; a: string }[];
}

export const STATES: StateContent[] = [
  {
    slug: 'lagos',
    name: 'Lagos',
    cityLabel: 'Lagos',
    brandCode: 'LAG',
    populated: true,
    hero: 'Lagos never blinks.',
    intro:
      'From the cool suya smoke of Lekki-1 to sunset yacht cruises off Tarkwa Bay, Lagos is Nigeria\u2019s round-the-clock capital of taste. CitiTour Lagos maps the city\u2019s best rooftops, private-chef pop-ups, Afrobeats concerts and boutique stays\u2014curated by locals, updated weekly. Book a table in Victoria Island, ride out to a warehouse rave on the Mainland, or reserve a suite on Banana Island without leaving the app. Whether you\u2019re a Lagos native rediscovering your city or a visitor with 48 hours to explore, this is your shortcut to the version of Lagos that only insiders know.',
    neighborhoods: ['Victoria Island', 'Lekki', 'Ikoyi', 'Yaba', 'Ikeja GRA', 'Surulere'],
    faq: [
      { q: 'What are the best areas to stay in Lagos?', a: 'Victoria Island and Ikoyi for luxury and business, Lekki Phase 1 for nightlife and beaches, Ikeja GRA if you\u2019re flying in and out.' },
      { q: 'How do I get around Lagos safely?', a: 'Use ride-hailing (Uber, Bolt, Rida) inside the app and avoid unmarked taxis. Traffic peaks 7\u201310am and 5\u20139pm\u2014plan around it.' },
      { q: 'Can I buy event tickets in Lagos on CitiTour?', a: 'Yes. Every listed Lagos event supports secure ticketing with QR entry. Concerts, brunches, film premieres and members-only parties all in one place.' },
    ],
  },
  {
    slug: 'abuja',
    name: 'FCT (Abuja)',
    cityLabel: 'Abuja',
    brandCode: 'ABJ',
    populated: true,
    hero: 'Abuja moves quietly, and eats loudly.',
    intro:
      'Abuja is Nigeria\u2019s power capital, but the real story is in Wuse\u2019s pepper-soup bars, Maitama\u2019s garden restaurants and the private-jet weekends out to Jabi Lake. CitiTour Abuja curates diplomatic-grade hotels, celebrity chef tables, and the quiet member\u2019s clubs the Federal Capital keeps to itself. Split a bill after dinner in Katampe, buy tickets to a Sunday polo match, or book a full-service Airbnb in Asokoro. Everything you need to eat, sleep and celebrate in the Federal Capital Territory\u2014with locals-only recommendations you won\u2019t find on generic travel sites.',
    neighborhoods: ['Maitama', 'Asokoro', 'Wuse 2', 'Jabi', 'Gwarinpa', 'Katampe'],
    faq: [
      { q: 'When is the best time to visit Abuja?', a: 'November to February\u2014the harmattan season\u2014has cooler evenings and the fullest event calendar. The Abuja Carnival runs late November.' },
      { q: 'Where should I eat in Abuja?', a: 'Try BluCabana for continental, Salamander Cafe for brunch, or Wakkis for authentic Indian. Full curated list in the Restaurants tab.' },
    ],
  },
  {
    slug: 'rivers',
    name: 'Rivers (Port Harcourt)',
    cityLabel: 'Port Harcourt',
    brandCode: 'PH',
    populated: true,
    hero: 'PH runs on oil, ambition and boat parties.',
    intro:
      'Port Harcourt is the Garden City for a reason: mangrove creeks, riverfront lounges, and the loudest weekend brunches in the South-South. CitiTour Rivers maps the best of GRA and Old GRA\u2019s expat cafes, the boat charters out to Bonny Island, oil-worker-approved steakhouses and the private events the industry keeps off Instagram. List your PH business, run local ads, host an event with QR ticketing, or just find the best jollof this side of the Niger. Built by Garden City locals, for anyone spending a weekend or a lifetime here.',
    neighborhoods: ['Old GRA', 'New GRA', 'D-Line', 'Trans Amadi', 'Rumuola', 'Eliozu'],
    faq: [
      { q: 'What is Port Harcourt famous for?', a: 'Oil and gas, the Garden City nickname, seafood along the creeks, and one of Nigeria\u2019s most active nightlife scenes centered on GRA.' },
      { q: 'Is Port Harcourt safe for visitors?', a: 'GRA and the main business districts are well-served and safe with normal city precautions. Use CitiTour\u2019s verified transport partners for creek and Bonny Island trips.' },
    ],
  },
  {
    slug: 'kano',
    name: 'Kano',
    cityLabel: 'Kano',
    brandCode: 'KAN',
    populated: false,
    hero: 'Kano — coming soon.',
    intro: 'We\u2019re curating Kano\u2019s best hotels, restaurants and cultural landmarks. Get notified when CitiTour Kano launches.',
    neighborhoods: [],
    faq: [],
  },
];

export const stateBySlug = (slug: string) => STATES.find(s => s.slug === slug);
