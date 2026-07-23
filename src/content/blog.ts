export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  author: string;
  tags: string[];
  readMinutes: number;
  cover?: string;
  body: string; // markdown-ish (headings ##, paragraphs, lists -)
}

export const POSTS: BlogPost[] = [
  {
    slug: '48-hours-in-lagos',
    title: '48 Hours in Lagos: The Insider\u2019s Weekend',
    excerpt: 'From a Friday jazz set in Ikoyi to Sunday brunch on the Lekki waterfront — the Citivas edit.',
    date: '2025-11-04',
    author: 'Citivas Editorial',
    tags: ['Lagos', 'Weekend', 'Guides'],
    readMinutes: 6,
    body: `## Friday night
Land, drop bags, head to Ikoyi for a jazz set at **Bogobiri**. Late dinner at Nok by Alara.

## Saturday
Beach day at Tarkwa Bay via speedboat. Sunset drinks at a rooftop in VI, then Afrobeats till 4am.

## Sunday
Brunch on the Lekki waterfront. Art walk through **Terra Kulture** before your flight.

See our full [Lagos city guide](/nigeria/lagos) or [buy event tickets](/host-an-event) directly in the app.`,
  },
  {
    slug: 'how-to-split-a-bill-without-drama',
    title: 'How to Split a Bill Without Drama',
    excerpt: 'Nigerian dinners don\u2019t come with per-person menus. Here\u2019s how Citivas Split It handles it.',
    date: '2025-10-21',
    author: 'Citivas Product',
    tags: ['Split It', 'Product'],
    readMinutes: 4,
    body: `## The problem
Ten people, one bill, three orders of shawarma and a bottle of Hennessy. Who owes what?

## The Split It flow
- Snap the receipt.
- Tag who ordered what.
- Citivas calculates VAT, service charge and rounds fairly.
- Everyone pays in-app or gets a shareable link.

Try it on [/split-it](/split-it).`,
  },
  {
    slug: 'list-your-business-citivas',
    title: 'Why Small Businesses List on Citivas',
    excerpt: 'Discoverability across Lagos, Abuja and Port Harcourt — plus tickets, ads and reviews in one place.',
    date: '2025-10-02',
    author: 'Citivas Partnerships',
    tags: ['Business', 'Listings'],
    readMinutes: 5,
    body: `## Who lists on Citivas
Restaurants, boutique hotels, event organisers, short-let hosts and lifestyle brands across Nigeria\u2019s biggest cities.

## What you get
- A verified listing indexed on Google.
- Optional featured placement.
- Direct booking and ticketing.
- Reviews and analytics.

Start on [/list-your-business](/list-your-business).`,
  },
];

export const postBySlug = (slug: string) => POSTS.find(p => p.slug === slug);
