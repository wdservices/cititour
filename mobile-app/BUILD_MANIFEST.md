# CitiTour Mobile — Build Manifest

## What this is

A genuine native Expo (React Native) app — not a Capacitor/WebView wrapper
around the website. It shares the same Firebase project as the website
(same Firestore data — businesses, events, chats), but is a completely
separate, native-rendered codebase living in `mobile-app/`.

## ⚠️ Critical gap: no login/auth screen (per instruction)

This was built with the login/auth screen deliberately excluded. That
means **several screens will not actually function** until a real
authentication entry point exists, because they depend on a genuine
Firebase `user.id`:

- `WalletScreen` — needs a real user to read/write wallet balance
- `BusinessDetailScreen`'s chat feature — `ensureChatExists` requires a
  real `currentUser.id`
- Any future Profile/Bookings screen

Right now these screens use a placeholder `currentUser` shape passed via
navigation params — they are NOT wired to a real signed-in session. Before
this app is usable end-to-end, you'll need one of:
1. Add a login screen back in (simplest — mirrors the website's AuthPage)
2. A silent/anonymous Firebase Auth session (works for browsing, not for
   wallet/chat since those need a persistent identity across app opens)
3. A deep-link/token handoff from an existing web session

This isn't a design choice I made lightly — it's a direct consequence of
your instruction, flagged clearly so it doesn't get discovered later as a
surprise "why doesn't the wallet work" bug.

## Fully built and working

- Project scaffold: package.json, app.json, navigation, theme
- **Theme** (src/theme/theme.ts) — colors ported exactly from the live
  website's src/index.css tokens (blue primary, marigold accent, palm
  green success) — matches the actual current site, not an older version
- **Firebase setup** (src/lib/firebase.ts) — same project as the website,
  RN-appropriate AsyncStorage session persistence
- **Chat** (src/lib/chat.ts) — identical logic to the website's chat
  feature, same Firestore chats collection, so a conversation started on
  web and continued on mobile is the same thread
- **Home/Explore screen** — GPS city detection (same lat/lon heuristic as
  the website's RegionContext.tsx), category grid with the passport-stamp
  visual motif, trending section, upcoming events preview
- **Business Detail screen** — listing info + inline native chat (full
  conversation view, not a floating widget — there's no room for that
  pattern on a mobile screen, so it's a dedicated chat view instead)
- **Events screen** — filter chips, event cards with price/rating/date
- **Marketplace screen** — category filters, 2-column product grid
- **Wallet screen** — balance card, fund/withdraw buttons, transaction list
- **Settings screen** — light/dark theme toggle UI (not yet wired to a
  persisted ThemeContext — currently local component state only)
- **Bottom tab navigation** — Explore, Events, Marketplace, Wallet, Settings

## Stubbed / not yet built

These need the same treatment as the screens above — currently either
missing entirely or using placeholder data instead of live Firestore reads:

- State/city detail screens (Lagos/Abuja/PH/Kano/Owerri/Kaduna equivalent
  of the website's /nigeria/:state pages)
- Search screen (referenced in navigation but not built)
- Business listing creation flow (the "List Your Business" form)
- Host-an-event / ticketing creation flow
- House/Airbnb listings screen
- Split It feature
- Real Firestore data wiring on Home/Events/Marketplace (currently showing
  placeholder array data, not live businesses/events/marketplace
  collection reads)
- Push notifications (new chat message, booking confirmation, etc.)
- Persisted theme (Settings toggle currently local state, not saved)

## Running it

```bash
cd mobile-app
npm install
npx expo start
```

Requires an .env (or app.config.js with extra fields, or EAS secrets)
providing the same EXPO_PUBLIC_FIREBASE_* values as the website's
Firebase project, so both apps read/write the same data.

## Suggested next steps, in order

1. Decide and implement the auth entry point (see the gap above) — nothing
   past this point works properly without it
2. Wire Home/Events/Marketplace screens to real Firestore queries instead
   of placeholder arrays
3. Build the Search screen
4. Build the remaining stubbed screens listed above, prioritizing whichever
   matches your current highest-traffic web features
