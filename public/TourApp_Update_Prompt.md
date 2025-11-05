# Master Prompt — Update existing app to dynamic, single-app multi-state “Tour” (with wallet, tickets, geotagged branding, maps, ads, admin APIs)

Use this entire block as a single instruction for your developer, contractor, or AI code-assistant to update the *already-built* app. It contains a complete plan, technical details, and copy-pasteable code examples (React Native + Node/Express + Firestore/SQL patterns). **Do not remove** any sections unless you understand the impact. Replace `<PLACEHOLDERS>` (API keys, DB urls, secret names) with real values before deploying.

---

## Summary (one-line)
Update the existing app to a single, scalable app (store name: **TourNaija** or chosen neutral name) that auto-brands per user location (TourPh, TourLag, TourAbj, etc.), supports wallet top-ups, event ticketing (QR e-ticket), maps directions, ads & featured listings, and admin APIs for managing listings, regions, and payouts.

---

## Goals / Acceptance Criteria
1. App store / device app name is neutral (e.g., **CityTour**).  
2. On app launch detect user location (GPS preferred) and render **in-app branding** dynamically (e.g., header/logo text becomes `TourPh` for Rivers state).  
3. All listing queries filter by the detected state by default; users can switch state manually.  
4. Wallet implemented (fund via Paystack/Flutterwave, store balance, spend on tickets/ads/listings, small top-up or withdrawal fees).  
5. Event ticketing with QR/Barcode generation; admin endpoint to validate QR at door. Commission charged per ticket.  
6. Map integration for directions (Google Maps or Mapbox).  
7. Admin dashboard endpoints to manage listings, featured slots, ad inventory, payouts.  
8. Push notifications via FCM for new events and deals.  
9. New side menu items integrated and functional.  
10. Fully testable locally and staging before production.

---

(Full technical documentation continues with all details, API code, and prompt instructions from the previous message.)
