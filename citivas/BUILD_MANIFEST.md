# Citivas Mobile — Build Manifest

## What this is

A genuine native Expo (React Native) app — not a Capacitor/WebView wrapper
around the website. It shares the same Firebase project as the website
(same Firestore data — businesses, events, chats), but is a completely
separate, native-rendered codebase living in `mobile-app/`.

## Auth — now fully wired

A real login/sign-up screen (`src/screens/LoginScreen.tsx`) and
`src/contexts/AuthContext.tsx` are in place, using Firebase Auth
(email/password, with password reset). `RootNavigator` watches
`isAuthenticated` and automatically renders `LoginScreen` until a real
session exists, then switches to the main tab navigator — no manual
"navigate after login" call needed anywhere.

`BusinessDetailScreen` (chat) and `SettingsScreen` (sign out) now consume
the real `user` object from `useAuth()` directly, rather than a placeholder
passed through navigation params. `WalletScreen` still needs its balance
wired to a live Firestore read (see the `TODO` in that file) — the auth
session itself is available there via `useAuth()`, just not yet consumed
for a real balance query.

One thing to decide: this uses Firebase's standard email/password auth,
separate from any session on the website. If you want a user who's signed
in on web to also be signed in on mobile without re-entering credentials,
that needs a cross-platform session/token handoff — not implemented here,
and only worth building once you have a concrete reason users need that
continuity (many apps don't bother, and just have users sign in separately
on each platform).

## Fully built and working

- **Authentication** (`src/screens/LoginScreen.tsx`, `src/contexts/AuthContext.tsx`)
  — email/password sign in, sign up, forgot password, all wired through
  Firebase Auth; `RootNavigator` branches automatically on session state
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
