export interface StateContent {
  slug: string;
  name: string;
  cityLabel: string;
  brandCode: 'LAG' | 'ABJ' | 'PH' | 'KAN' | 'OWR' | 'KAD';
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
      'From the cool suya smoke of Lekki-1 to sunset yacht cruises off Tarkwa Bay, Lagos is Nigeria\u2019s round-the-clock capital of taste. Citivas Lagos maps the city\u2019s best rooftops, private-chef pop-ups, Afrobeats concerts and boutique stays\u2014curated by locals, updated weekly. Book a table in Victoria Island, ride out to a warehouse rave on the Mainland, or reserve a suite on Banana Island without leaving the app. Whether you\u2019re a Lagos native rediscovering your city or a visitor with 48 hours to explore, this is your shortcut to the version of Lagos that only insiders know.',
    neighborhoods: ['Victoria Island', 'Lekki', 'Ikoyi', 'Yaba', 'Ikeja GRA', 'Surulere'],
    faq: [
      { q: 'What are the best areas to stay in Lagos?', a: 'Victoria Island and Ikoyi for luxury and business, Lekki Phase 1 for nightlife and beaches, Ikeja GRA if you\u2019re flying in and out.' },
      { q: 'How do I get around Lagos safely?', a: 'Use ride-hailing (Uber, Bolt, Rida) inside the app and avoid unmarked taxis. Traffic peaks 7\u201310am and 5\u20139pm\u2014plan around it.' },
      { q: 'Can I buy event tickets in Lagos on Citivas?', a: 'Yes. Every listed Lagos event supports secure ticketing with QR entry. Concerts, brunches, film premieres and members-only parties all in one place.' },
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
      'Abuja is Nigeria\u2019s power capital, but the real story is in Wuse\u2019s pepper-soup bars, Maitama\u2019s garden restaurants and the private-jet weekends out to Jabi Lake. Citivas Abuja curates diplomatic-grade hotels, celebrity chef tables, and the quiet member\u2019s clubs the Federal Capital keeps to itself. Split a bill after dinner in Katampe, buy tickets to a Sunday polo match, or book a full-service Airbnb in Asokoro. Everything you need to eat, sleep and celebrate in the Federal Capital Territory\u2014with locals-only recommendations you won\u2019t find on generic travel sites.',
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
      'Port Harcourt is the Garden City for a reason: mangrove creeks, riverfront lounges, and the loudest weekend brunches in the South-South. Citivas Rivers maps the best of GRA and Old GRA\u2019s expat cafes, the boat charters out to Bonny Island, oil-worker-approved steakhouses and the private events the industry keeps off Instagram. List your PH business, run local ads, host an event with QR ticketing, or just find the best jollof this side of the Niger. Built by Garden City locals, for anyone spending a weekend or a lifetime here.',
    neighborhoods: ['Old GRA', 'New GRA', 'D-Line', 'Trans Amadi', 'Rumuola', 'Eliozu'],
    faq: [
      { q: 'What is Port Harcourt famous for?', a: 'Oil and gas, the Garden City nickname, seafood along the creeks, and one of Nigeria\u2019s most active nightlife scenes centered on GRA.' },
      { q: 'Is Port Harcourt safe for visitors?', a: 'GRA and the main business districts are well-served and safe with normal city precautions. Use Citivas\u2019s verified transport partners for creek and Bonny Island trips.' },
    ],
  },
  {
    slug: 'kano',
    name: 'Kano',
    cityLabel: 'Kano',
    brandCode: 'KAN',
    populated: true,
    hero: 'Kano trades in silk, spice and centuries of history.',
    intro:
      'Kano is Nigeria\u2019s oldest living city\u2014a thousand-year-old trade capital where the Kurmi Market still hums the way it has since the trans-Saharan caravans. Citivas Kano maps the best of the Sabon Gari hotels and guesthouses, the tuwo and suya spots locals actually queue for, and the Durbar festival routes that draw visitors from across West Africa. Book a stay near the old city walls, catch a polo match at the Race Course, or split a group dinner after touring the Gidan Makama Museum. Built for business travelers working the Kano commercial corridor and for anyone curious about the North\u2019s cultural capital.',
    neighborhoods: ['Sabon Gari', 'Nassarawa GRA', 'Fagge', 'Bompai', 'Tarauni', 'Old City'],
    faq: [
      { q: 'What is Kano known for?', a: 'Centuries of trans-Saharan trade, leather and textile craftsmanship, the Kurmi Market, and the annual Durbar Festival with its horse-mounted royal procession.' },
      { q: 'Where should business travelers stay in Kano?', a: 'Nassarawa GRA and Bompai are closest to the commercial and banking districts, with easy access to the airport.' },
      { q: 'Is Kano good for a short cultural visit?', a: 'Yes\u2014the Gidan Makama Museum, Kano City Walls, and Kurmi Market can be covered comfortably in a long weekend.' },
    ],
  },
  {
    slug: 'imo',
    name: 'Imo (Owerri)',
    cityLabel: 'Owerri',
    brandCode: 'OWR',
    populated: true,
    hero: 'Owerri throws the loudest weekend in the South-East.',
    intro:
      'Owerri is the Eastern Heartland\u2019s party capital\u2014home to the Christmas-season "Owerri Detty December" scene, Nkwo Road nightlife, and some of the best isi ewu in Nigeria. Citivas Owerri curates hotels along the New Owerri and Government layouts, tracks the December concert and comedy show calendar, and lists the private-lounge nights that fill up months in advance. Whether you\u2019re back home for the holidays, tracking business at the Owerri industrial corridor, or planning a wedding at the Dan Anyiam Stadium grounds, book, split bills and get tickets without leaving the app.',
    neighborhoods: ['New Owerri', 'Government Layout', 'World Bank', 'Ikenegbu', 'Egbu Road', 'Wetheral'],
    faq: [
      { q: 'When is the best time to visit Owerri?', a: 'December\u2014the "Detty December" season\u2014brings the biggest concerts, weddings, and homecoming events, though hotels book out early.' },
      { q: 'What is Owerri famous for?', a: 'Its December festive scene, isi ewu and nkwobi delicacies, and being the commercial and cultural hub of Imo State.' },
      { q: 'Can I list a wedding or owambe venue on Citivas Owerri?', a: 'Yes\u2014event centers, halls and outdoor venues can list directly and sell tickets or manage RSVPs through the platform.' },
    ],
  },
  {
    slug: 'kaduna',
    name: 'Kaduna',
    cityLabel: 'Kaduna',
    brandCode: 'KAD',
    populated: true,
    hero: 'Kaduna keeps the North\u2019s business moving.',
    intro:
      'Kaduna built colonial-era rail lines and modern industry in equal measure, and today it\u2019s one of the North\u2019s fastest-growing commercial hubs. Citivas Kaduna maps the best hotels along Independence Way and Barnawa, the suya spots that stay open past midnight, and the polo and durbar events that draw the region\u2019s business and political circles. Book a guesthouse near the industrial layout, find a boardroom-ready hotel in Kaduna GRA, or split the bill after a long dinner meeting\u2014all from one app built for the city\u2019s working rhythm.',
    neighborhoods: ['Kaduna GRA', 'Barnawa', 'Sabon Tasha', 'Ungwan Rimi', 'Malali', 'Tudun Wada'],
    faq: [
      { q: 'Is Kaduna good for business travel?', a: 'Yes\u2014Kaduna GRA and Barnawa host most of the business hotels and are close to the state\u2019s commercial and government districts.' },
      { q: 'What food is Kaduna known for?', a: 'Suya is practically a Kaduna institution\u2014Sabon Tasha and Barnawa have some of the most recommended spots on the app.' },
    ],
  },
];

export const stateBySlug = (slug: string) => STATES.find(s => s.slug === slug);
