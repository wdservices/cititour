# CitiTour Mobile — Google Stitch Design Prompt

Paste this into Google Stitch to generate the mobile UI independently of
the coded version — useful if you want to see design alternatives, or if
you don't like the coded screens and want a fresh visual direction using
the same brand foundation.

---

## App overview

CitiTour is a mobile app for discovering, booking, and paying for hotels,
restaurants, events, and local businesses across major Nigerian cities
(Lagos, Abuja, Port Harcourt, Kano, Owerri, Kaduna). The app detects the
user's city via GPS and rebrands its header to match — e.g. "Tour Lagos"
becomes "Tour Abuja" automatically when the user travels. Design direction:
light, warm, premium travel-app feel — think Airbnb or Booking.com's polish
level, adapted with a distinctly Nigerian/West African visual character,
not a generic template look.

## Brand colors (exact values — use these, not approximations)

- Background: #F5F7FA (soft light gray-white, never stark pure white)
- Card surfaces: #FFFFFF
- Primary (buttons, active states, links): #1E88E5 — a clean, confident blue
- Accent (secondary CTAs, ratings, highlights): #D9891F — warm marigold gold
- Success (positive states, verified badges): #10B981 — green
- Text: #0F172A (near-black ink, not pure black)
- Muted text: #64748B
- Borders: #E2E8F0

Dark mode (user-toggleable in Settings, not default): background #0B0E14,
cards #12161F, text #F4EFE6, primary brightens to #5FB0F0, accent to
#F2A93B, success to #34D399.

## Typography

Bold, geometric display font for headlines and section titles — confident
and large, not a generic system font. Clean humanist sans (like Inter) for
body text and UI labels.

## Signature visual motif: the "passport stamp"

Category icons and feature callouts are presented inside a dashed circular
ring (like a customs/passport stamp), in a brand color, rather than plain
square icon tiles. This should appear consistently anywhere the app
represents "categories" or "features" — it's the app's core visual
signature, tying to the "touring cities" concept.

## Screens to design

### 1. Home / Explore (main tab)
- Header: eyebrow label "CITITOUR CONCIERGE" above a large headline reading
  "Tour [City]" where [City] is in the primary blue color
- A location pill showing the detected city, top-right
- A prominent search bar: "Search restaurants, events, hotels..."
- A 4-column category grid: Hotels, Restaurants, Events, Fun Places — each
  in a passport-stamp dashed circular icon
- Horizontal-scrolling "Trending in [City]" card row — image, title, city
- "Upcoming Events" list — date badge (day + month) on the left, event
  name and price on the right

### 2. Business/Listing Detail
- Full-width hero image
- Business name, star rating + review count, location with a pin icon
- Description text
- Two action buttons side by side: "Call" (filled blue) and "Message"
  (outlined blue) — Message opens the in-app chat

### 3. Chat screen (opened from a listing's "Message" button)
- Simple header: back arrow, business name, centered
- Message bubbles: customer's messages right-aligned in solid blue with
  white text; business replies left-aligned in white/card color with a
  border
- Bottom input bar: rounded text field + circular send button in blue

### 4. Events tab
- Horizontal filter chips: All, Food & Drink, Music, Business, Sports —
  active chip filled blue, inactive chips outlined
- Vertical list of event cards: image with a price badge in the corner,
  title, location, date/time, star rating, "Book Now" button (full-width,
  rounded, blue)

### 5. Marketplace tab
- Header with a "List Item" button (small, filled blue, top-right)
- Horizontal category filter chips (Electronics, Fashion, Home, Vehicles,
  Property)
- 2-column product grid: image with a heart/favorite icon top-right,
  product title, location, price in blue bold text

### 6. Wallet tab
- Large balance card at the top, filled solid blue, showing "Available
  Balance" and the amount in large white text
- Two buttons inside the card: "Fund" (filled, darker blue) and "Withdraw"
  (white background, blue text)
- Below the card: a "Recent Transactions" list — small circular icon
  (green for money in, red for money out), transaction label, amount in
  matching color

### 7. Settings tab
- "Appearance" section: two side-by-side toggle cards for Light/Dark theme,
  each with a sun or moon icon, the selected one highlighted with a blue
  border and light blue background tint
- "Account" section: simple list rows for Notifications, Privacy &
  Security, Help & Support, each with an icon, label, and a chevron arrow

### 8. Bottom navigation
Five tabs with icons only (no text labels needed if icons are clear, or
small labels beneath): Explore (compass icon), Events (calendar icon),
Marketplace (shopping bag icon), Wallet (wallet icon), Settings (gear icon).
Active tab in primary blue, inactive tabs in muted gray.

## Overall feel to aim for

Warm and premium, not corporate or cold. Generous white space. Rounded
corners throughout (cards, buttons, chips — nothing sharp-edged). No
gradients on buttons or headlines — flat, solid colors only. Real
photography-forward layouts (large hero images, card thumbnails) even
where this prompt uses placeholder descriptions — actual venue/event
photos should anchor most screens once available.
