# Firestore Database Setup Guide for MyPHApp (TourPH)

## Overview
This is a step-by-step guide to manually create your Firestore database structure in the Firebase Console. The app is a tourism and business listing platform for the Philippines with user authentication, wallet system, business listings, ads, events, and more.

---

## 🚀 Initial Setup

### Step 1: Open Firebase Console
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project (or create a new one if you haven't)

### Step 2: Access Firestore Database
- In the left sidebar, click on **"Firestore Database"**
- Click on **"Create database"** if you haven't already
- Choose **"Start in production mode"** or **"Start in test mode"** (test mode for development)
- Select your Firestore location (choose closest to Philippines, e.g., asia-southeast1)

---

## 📋 Collection 1: users

### Step 1: Create Users Collection
- Click **"Start collection"**
- Collection ID: `users`
- Click **"Next"**

### Step 2: Create First User Document
- Document ID: Use **"Custom ID"** and enter a sample user ID (e.g., `user123` or use an actual Firebase Auth UID)
- Add the following fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| uid | string | user123 |
| email | string | john@example.com |
| displayName | string | John Doe |
| photoURL | string | https://example.com/photo.jpg |
| phoneNumber | string | +639123456789 |
| location | string | Manila, Philippines |
| bio | string | Travel enthusiast |
| status | string | active |
| emailVerified | boolean | true |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |
| lastLoginAt | timestamp | (Click "Set to current time") |
| totalBookings | number | 0 |
| totalReviews | number | 0 |
| totalPhotos | number | 0 |

- Click **"Save"**

### Step 3: Add User Preferences (Map Field)
- Click on the user document you just created
- Click **"Add field"**
- Field: `preferences`
- Type: **map**
- Click the **"+"** to add nested fields:
  - notifications: boolean → true
  - emailUpdates: boolean → true
  - language: string → "en"
  - theme: string → "light"
- Click **"Save"**

### Step 4: Create Favourites Subcollection
- While viewing the user document, click **"Add collection"** (or **"Start collection"**)
- Collection ID: `favourites`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| itemType | string | business |
| itemId | string | business123 |
| itemName | string | Garden City Grand Hotel |
| itemImage | string | https://example.com/hotel.jpg |
| itemCategory | string | Hotels |
| savedAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 5: Create Notifications Subcollection
- Go back to the user document
- Click **"Add collection"**
- Collection ID: `notifications`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| type | string | booking |
| title | string | Booking Confirmed |
| message | string | Your hotel booking has been confirmed |
| isRead | boolean | false |
| actionUrl | string | /bookings/booking123 |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── users (collection)
    └── user123 (document)
        ├── uid: "user123"
        ├── email: "john@example.com"
        ├── displayName: "John Doe"
        ├── preferences: {map}
        ├── favourites (subcollection)
        │   └── [auto-id] (document)
        │       ├── itemType: "business"
        │       ├── itemId: "business123"
        │       └── savedAt: timestamp
        └── notifications (subcollection)
            └── [auto-id] (document)
                ├── type: "booking"
                ├── title: "Booking Confirmed"
                └── isRead: false
```

---

## 💰 Collection 2: wallets

### Step 1: Create Wallets Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `wallets`
- Click **"Next"**

### Step 2: Create First Wallet Document
- Document ID: Use **"Custom ID"** - same as user ID (e.g., `user123`)
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| balance | number | 1250.75 |
| currency | string | PHP |
| status | string | active |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 3: Create Transactions Subcollection
- Click on the wallet document you just created
- Click **"Add collection"**
- Collection ID: `transactions`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| type | string | credit |
| amount | number | 500 |
| description | string | Wallet Top-up |
| date | timestamp | (Click "Set to current time") |
| method | string | GCash |
| status | string | completed |
| referenceNumber | string | REF123456789 |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 4: Create Payment Methods Subcollection
- Go back to the wallet document
- Click **"Add collection"**
- Collection ID: `paymentMethods`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| name | string | GCash |
| type | string | gcash |
| description | string | Mobile wallet payment |
| isDefault | boolean | true |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── wallets (collection)
    └── user123 (document)
        ├── userId: "user123"
        ├── balance: 1250.75
        ├── currency: "PHP"
        ├── transactions (subcollection)
        │   └── [auto-id] (document)
        │       ├── type: "credit"
        │       ├── amount: 500
        │       ├── method: "GCash"
        │       └── status: "completed"
        └── paymentMethods (subcollection)
            └── [auto-id] (document)
                ├── name: "GCash"
                ├── type: "gcash"
                └── isDefault: true
```

---

## 🏢 Collection 3: businesses

### Step 1: Create Businesses Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `businesses`
- Click **"Next"**

### Step 2: Create First Business Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| ownerId | string | user123 |
| businessName | string | Garden City Grand Hotel |
| category | string | hotel |
| description | string | Luxury 5-star hotel in the heart of Garden City |
| address | string | 123 Main Street, Makati City |
| city | string | Makati |
| region | string | Metro Manila |
| country | string | Philippines |
| phone | string | +639123456789 |
| email | string | info@gardencityhotel.com |
| website | string | https://gardencityhotel.com |
| operatingHours | string | 24/7 |
| priceRange | string | $$$$ |
| rating | number | 4.9 |
| totalReviews | number | 127 |
| totalBookings | number | 450 |
| status | string | approved |
| isVerified | boolean | true |
| isFeatured | boolean | true |
| subscriptionPlan | string | premium |
| revenue | number | 125000 |
| viewCount | number | 5420 |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Location (Geopoint)
- Click **"Add field"**
- Field: `location`
- Type: **geopoint**
- Latitude: 14.5547 (example for Manila)
- Longitude: 121.0244
- Click **"Save"**

### Step 4: Add Images (Array)
- Click **"Add field"**
- Field: `images`
- Type: **array**
- Click **"+"** to add items:
  - string: https://example.com/hotel1.jpg
  - string: https://example.com/hotel2.jpg
  - string: https://example.com/hotel3.jpg
- Click **"Save"**

### Step 5: Add Amenities (Array)
- Click **"Add field"**
- Field: `amenities`
- Type: **array**
- Click **"+"** to add items:
  - string: WiFi
  - string: Pool
  - string: Spa
  - string: Restaurant
  - string: Parking
- Click **"Save"**

### Step 6: Add Subscription Expiry (Timestamp)
- Click **"Add field"**
- Field: `subscriptionExpiry`
- Type: **timestamp**
- Set date to future (e.g., 30 days from now)
- Click **"Save"**

### Step 7: Create Reviews Subcollection
- Click on the business document
- Click **"Add collection"**
- Collection ID: `reviews`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| userName | string | John Doe |
| userAvatar | string | https://example.com/avatar.jpg |
| rating | number | 5 |
| title | string | Amazing experience! |
| comment | string | The hotel exceeded all expectations. Highly recommended! |
| helpful | number | 15 |
| notHelpful | number | 0 |
| status | string | published |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 8: Create Bookings Subcollection
- Go back to the business document
- Click **"Add collection"**
- Collection ID: `bookings`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| checkInDate | timestamp | (Set future date) |
| checkOutDate | timestamp | (Set future date) |
| numberOfGuests | number | 2 |
| totalAmount | number | 15000 |
| paymentStatus | string | completed |
| bookingStatus | string | confirmed |
| confirmationCode | string | CONF123456 |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── businesses (collection)
    └── [auto-id] (document)
        ├── ownerId: "user123"
        ├── businessName: "Garden City Grand Hotel"
        ├── category: "hotel"
        ├── location: geopoint(14.5547, 121.0244)
        ├── images: ["url1", "url2", "url3"]
        ├── amenities: ["WiFi", "Pool", "Spa"]
        ├── reviews (subcollection)
        │   └── [auto-id] (document)
        │       ├── userId: "user123"
        │       ├── rating: 5
        │       └── comment: "Amazing experience!"
        └── bookings (subcollection)
            └── [auto-id] (document)
                ├── userId: "user123"
                ├── totalAmount: 15000
                └── bookingStatus: "confirmed"
```

---

## 🎉 Collection 4: events

### Step 1: Create Events Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `events`
- Click **"Next"**

### Step 2: Create First Event Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| organizerId | string | user123 |
| title | string | Garden City Music Festival |
| description | string | Annual music festival featuring local and international artists |
| category | string | music |
| eventType | string | festival |
| venue | string | Central Park, Garden City |
| location | string | Central Park, Quezon City, Philippines |
| startDate | timestamp | (Set future date) |
| endDate | timestamp | (Set future date) |
| startTime | string | 18:00 |
| endTime | string | 23:00 |
| ticketsAvailable | number | 5000 |
| ticketsSold | number | 2340 |
| rating | number | 4.8 |
| totalReviews | number | 156 |
| status | string | upcoming |
| isActive | boolean | true |
| isFeatured | boolean | true |
| viewCount | number | 8920 |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Geopoint
- Click **"Add field"**
- Field: `geopoint`
- Type: **geopoint**
- Latitude: 14.6760
- Longitude: 121.0437
- Click **"Save"**

### Step 4: Add Price (Map)
- Click **"Add field"**
- Field: `price`
- Type: **map**
- Add nested fields:
  - min: number → 25
  - max: number → 50
  - currency: string → "PHP"
- Click **"Save"**

### Step 5: Add Images (Array)
- Click **"Add field"**
- Field: `images`
- Type: **array**
- Add items:
  - string: https://example.com/event1.jpg
  - string: https://example.com/event2.jpg
- Click **"Save"**

### Step 6: Create Tickets Subcollection
- Click on the event document
- Click **"Add collection"**
- Collection ID: `tickets`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| eventId | string | (copy the event document ID) |
| ticketType | string | General Admission |
| price | number | 35 |
| quantity | number | 3000 |
| sold | number | 1500 |
| available | number | 1500 |
| commission | number | 2.50 |
| description | string | Standard entry to the festival |
| status | string | active |
| createdAt | timestamp | (Click "Set to current time") |

### Step 7: Add Benefits (Array)
- Click **"Add field"**
- Field: `benefits`
- Type: **array**
- Add items:
  - string: Access to all stages
  - string: Free festival merchandise
  - string: Food voucher included
- Click **"Save"**

### Step 8: Add Another Ticket Type (VIP)
- Go back to tickets subcollection
- Click **"Add document"**
- Click **"Auto-ID"**
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| eventId | string | (copy the event document ID) |
| ticketType | string | 500 |
| sold | number | 340 |
| available | number | 160 |
| commission | number | 5.00 |
| description | string | Premium access with exclusive perks |
| status | string | active | VIP Access |
| price | number | 75 |
| quantity | number |
| createdAt | timestamp | (Click "Set to current time") |

- Add benefits array:
  - string: VIP lounge access
  - string: Meet & greet with artists
  - string: Premium seating
  - string: Free drinks and food
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── events (collection)
    └── [auto-id] (document)
        ├── organizerId: "user123"
        ├── title: "Garden City Music Festival"
        ├── category: "music"
        ├── geopoint: geopoint(14.6760, 121.0437)
        ├── price: {map}
        │   ├── min: 25
        │   ├── max: 50
        │   └── currency: "PHP"
        ├── images: ["url1", "url2"]
        └── tickets (subcollection)
            ├── [auto-id] (document)
            │   ├── ticketType: "General Admission"
            │   ├── price: 35
            │   ├── quantity: 3000
            │   ├── sold: 1500
            │   └── benefits: ["Access to all stages", ...]
            └── [auto-id] (document)
                ├── ticketType: "VIP Access"
                ├── price: 75
                ├── quantity: 500
                └── benefits: ["VIP lounge access", ...]
```

---

## 🏠 Collection 5: properties

### Step 1: Create Properties Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `properties`
- Click **"Next"**

### Step 2: Create First Property Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| ownerId | string | user123 |
| title | string | Modern Downtown Apartment |
| description | string | Beautiful 2-bedroom apartment in the heart of the city |
| propertyType | string | apartment |
| address | string | 456 Urban Street, Makati City |
| city | string | Makati |
| region | string | Metro Manila |
| pricePerNight | number | 3500 |
| currency | string | PHP |
| maxGuests | number | 4 |
| bedrooms | number | 2 |
| bathrooms | number | 1 |
| beds | number | 2 |
| rating | number | 4.9 |
| totalReviews | number | 89 |
| totalBookings | number | 234 |
| status | string | active |
| isAvailable | boolean | true |
| minimumStay | number | 2 |
| viewCount | number | 1250 |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Location (Geopoint)
- Click **"Add field"**
- Field: `location`
- Type: **geopoint**
- Latitude: 14.5547
- Longitude: 121.0244
- Click **"Save"**

### Step 4: Add Amenities (Array)
- Click **"Add field"**
- Field: `amenities`
- Type: **array**
- Add items:
  - string: wifi
  - string: parking
  - string: kitchen
  - string: balcony
  - string: laundry
- Click **"Save"**

### Step 5: Add Images (Array)
- Click **"Add field"**
- Field: `images`
- Type: **array**
- Add items:
  - string: https://example.com/property1.jpg
  - string: https://example.com/property2.jpg
  - string: https://example.com/property3.jpg
- Click **"Save"**

### Step 6: Create Bookings Subcollection
- Click on the property document
- Click **"Add collection"**
- Collection ID: `bookings`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user456 |
| checkInDate | timestamp | (Set future date) |
| checkOutDate | timestamp | (Set future date) |
| numberOfGuests | number | 3 |
| totalAmount | number | 10500 |
| paymentStatus | string | completed |
| bookingStatus | string | confirmed |
| confirmationCode | string | PROP789012 |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 7: Create Reviews Subcollection
- Go back to the property document
- Click **"Add collection"**
- Collection ID: `reviews`
- Click **"Next"**
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user456 |
| userName | string | Jane Smith |
| rating | number | 5 |
| title | string | Perfect location! |
| comment | string | The apartment was clean, modern, and perfectly located |
| helpful | number | 8 |
| status | string | published |
| createdAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 8: Create Availability Subcollection
- Go back to the property document
- Click **"Add collection"**
- Collection ID: `availability`
- Click **"Next"**
- Document ID: Use date format (e.g., `2024-03-15`)
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| date | timestamp | (Set specific date) |
| isAvailable | boolean | true |
| priceOverride | number | 4000 |
| minimumStay | number | 2 |

- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── properties (collection)
    └── [auto-id] (document)
        ├── ownerId: "user123"
        ├── title: "Modern Downtown Apartment"
        ├── propertyType: "apartment"
        ├── location: geopoint(14.5547, 121.0244)
        ├── pricePerNight: 3500
        ├── amenities: ["wifi", "parking", "kitchen"]
        ├── images: ["url1", "url2", "url3"]
        ├── bookings (subcollection)
        │   └── [auto-id] (document)
        │       ├── userId: "user456"
        │       ├── totalAmount: 10500
        │       └── bookingStatus: "confirmed"
        ├── reviews (subcollection)
        │   └── [auto-id] (document)
        │       ├── userId: "user456"
        │       ├── rating: 5
        │       └── comment: "Perfect location!"
        └── availability (subcollection)
            └── 2024-03-15 (document)
                ├── date: timestamp
                ├── isAvailable: true
                └── priceOverride: 4000
```

---

## 📝 Collection 6: bookings

### Step 1: Create Bookings Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `bookings`
- Click **"Next"**

### Step 2: Create First Booking Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| bookingType | string | business |
| relatedId | string | business123 |
| relatedName | string | Garden City Grand Hotel |
| bookingDate | timestamp | (Click "Set to current time") |
| checkInDate | timestamp | (Set future date) |
| checkOutDate | timestamp | (Set future date) |
| numberOfGuests | number | 2 |
| totalAmount | number | 15000 |
| currency | string | PHP |
| paymentMethod | string | GCash |
| paymentStatus | string | completed |
| bookingStatus | string | confirmed |
| confirmationCode | string | BOOK123456 |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

- Click **"Save"**

### Step 3: Add Special Requests (Optional)
- Click **"Add field"**
- Field: `specialRequests`
- Type: **string**
- Value: Late check-in requested, non-smoking room
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── bookings (collection)
    └── [auto-id] (document)
        ├── userId: "user123"
        ├── bookingType: "business"
        ├── relatedId: "business123"
        ├── relatedName: "Garden City Grand Hotel"
        ├── totalAmount: 15000
        ├── paymentStatus: "completed"
        ├── bookingStatus: "confirmed"
        └── confirmationCode: "BOOK123456"
```

---

## ⭐ Collection 7: reviews

### Step 1: Create Reviews Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `reviews`
- Click **"Next"**

### Step 2: Create First Review Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| userName | string | John Doe |
| userAvatar | string | https://example.com/avatar.jpg |
| reviewType | string | business |
| relatedId | string | business123 |
| relatedName | string | Garden City Grand Hotel |
| rating | number | 5 |
| title | string | Exceptional service! |
| comment | string | The staff was incredibly helpful and the facilities were top-notch |
| helpful | number | 24 |
| notHelpful | number | 1 |
| status | string | published |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Images (Array) - Optional
- Click **"Add field"**
- Field: `images`
- Type: **array**
- Add items:
  - string: https://example.com/review-photo1.jpg
  - string: https://example.com/review-photo2.jpg
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── reviews (collection)
    └── [auto-id] (document)
        ├── userId: "user123"
        ├── userName: "John Doe"
        ├── reviewType: "business"
        ├── relatedId: "business123"
        ├── rating: 5
        ├── title: "Exceptional service!"
        ├── comment: "The staff was incredibly helpful..."
        ├── images: ["url1", "url2"]
        └── status: "published"
```

---

## 📢 Collection 8: ads

### Step 1: Create Ads Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `ads`
- Click **"Next"**

### Step 2: Create First Ad Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| businessId | string | business123 |
| advertiserId | string | user123 |
| title | string | Grand Opening - 20% Off! |
| description | string | Celebrate our grand opening with exclusive discounts |
| adType | string | banner |
| category | string | hotel |
| budget | number | 5000 |
| spent | number | 1250 |
| startDate | timestamp | (Click "Set to current time") |
| endDate | timestamp | (Set future date - 30 days) |
| status | string | active |
| clickCount | number | 342 |
| impressions | number | 8920 |
| ctr | number | 3.8 |
| costPerClick | number | 3.65 |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Target Audience (Map)
- Click **"Add field"**
- Field: `targetAudience`
- Type: **map**
- Add nested fields:
  - location: array → ["Metro Manila", "Cebu", "Davao"]
  - ageRange: string → "25-45"
  - interests: array → ["travel", "hotels", "luxury"]
- Click **"Save"**

### Step 4: Add Images (Array)
- Click **"Add field"**
- Field: `images`
- Type: **array**
- Add items:
  - string: https://example.com/ad-banner1.jpg
  - string: https://example.com/ad-banner2.jpg
- Click **"Save"**

### Step 5: Create Analytics Subcollection
- Click on the ad document
- Click **"Add collection"**
- Collection ID: `analytics`
- Click **"Next"**
- Document ID: Use date format (e.g., `2024-03-15`)
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| date | timestamp | (Set specific date) |
| clicks | number | 45 |
| impressions | number | 1200 |
| ctr | number | 3.75 |
| spent | number | 164.25 |

- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── ads (collection)
    └── [auto-id] (document)
        ├── businessId: "business123"
        ├── advertiserId: "user123"
        ├── title: "Grand Opening - 20% Off!"
        ├── adType: "banner"
        ├── budget: 5000
        ├── spent: 1250
        ├── targetAudience: {map}
        │   ├── location: ["Metro Manila", "Cebu"]
        │   ├── ageRange: "25-45"
        │   └── interests: ["travel", "hotels"]
        ├── images: ["url1", "url2"]
        └── analytics (subcollection)
            └── 2024-03-15 (document)
                ├── date: timestamp
                ├── clicks: 45
                ├── impressions: 1200
                └── ctr: 3.75
```

---

## 💬 Collection 9: feedback

### Step 1: Create Feedback Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `feedback`
- Click **"Next"**

### Step 2: Create First Feedback Document
- Click **"Auto-ID"** for document ID
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| userId | string | user123 |
| userName | string | John Doe |
| userEmail | string | john@example.com |
| feedbackType | string | feature |
| subject | string | Dark mode support |
| message | string | Would love to see a dark mode option in the app |
| rating | number | 4 |
| status | string | in_progress |
| priority | string | medium |
| createdAt | timestamp | (Click "Set to current time") |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Response (Optional)
- Click **"Add field"**
- Field: `response`
- Type: **string**
- Value: Thanks for the suggestion! We're working on dark mode for the next update.
- Click **"Save"**

### Step 4: Add Assigned To (Optional)
- Click **"Add field"**
- Field: `assignedTo`
- Type: **string**
- Value: admin123
- Click **"Save"**

### Step 5: Add Resolved At (Optional)
- Click **"Add field"**
- Field: `resolvedAt`
- Type: **timestamp**
- Set to null or future date
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── feedback (collection)
    └── [auto-id] (document)
        ├── userId: "user123"
        ├── userName: "John Doe"
        ├── feedbackType: "feature"
        ├── subject: "Dark mode support"
        ├── message: "Would love to see a dark mode..."
        ├── status: "in_progress"
        ├── priority: "medium"
        ├── response: "Thanks for the suggestion..."
        └── assignedTo: "admin123"
```

---

## ⚙️ Collection 10: app_settings

### Step 1: Create App Settings Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `app_settings`
- Click **"Next"**

### Step 2: Create Config Document
- Document ID: Use **"Custom ID"** and enter: `config`
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| commissionRate | number | 5 |
| currency | string | PHP |
| supportEmail | string | support@tourph.com |
| supportPhone | string | +639123456789 |
| termsAndConditionsUrl | string | https://tourph.com/terms |
| privacyPolicyUrl | string | https://tourph.com/privacy |
| maintenanceMode | boolean | false |
| appVersion | string | 1.0.0 |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Social Media (Map)
- Click **"Add field"**
- Field: `socialMedia`
- Type: **map**
- Add nested fields:
  - facebook: string → https://facebook.com/tourph
  - instagram: string → https://instagram.com/tourph
  - twitter: string → https://twitter.com/tourph
- Click **"Save"**

### Step 4: Add Payment Methods (Array)
- Click **"Add field"**
- Field: `paymentMethods`
- Type: **array**
- Add items:
  - string: GCash
  - string: PayMaya
  - string: Credit Card
  - string: Bank Transfer
- Click **"Save"**

### Step 5: Add Categories (Array)
- Click **"Add field"**
- Field: `categories`
- Type: **array**
- Add items:
  - string: restaurant
  - string: hotel
  - string: event_venue
  - string: shopping
  - string: entertainment
  - string: attraction
  - string: airbnb
  - string: fun_place
  - string: lifestyle
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── app_settings (collection)
    └── config (document)
        ├── commissionRate: 5
        ├── currency: "PHP"
        ├── supportEmail: "support@tourph.com"
        ├── maintenanceMode: false
        ├── socialMedia: {map}
        │   ├── facebook: "https://facebook.com/tourph"
        │   ├── instagram: "https://instagram.com/tourph"
        │   └── twitter: "https://twitter.com/tourph"
        ├── paymentMethods: ["GCash", "PayMaya", ...]
        └── categories: ["restaurant", "hotel", ...]
```

---

## 👨‍💼 Collection 11: admin_users

### Step 1: Create Admin Users Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `admin_users`
- Click **"Next"**

### Step 2: Create First Admin Document
- Document ID: Use **"Custom ID"** (e.g., `admin123` or Firebase Auth UID)
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| name | string | Admin User |
| email | string | admin@tourph.com |
| role | string | super_admin |
| avatar | string | https://example.com/admin-avatar.jpg |
| status | string | active |
| createdAt | timestamp | (Click "Set to current time") |
| lastLoginAt | timestamp | (Click "Set to current time") |

### Step 3: Add Permissions (Array)
- Click **"Add field"**
- Field: `permissions`
- Type: **array**
- Add items:
  - string: manage_users
  - string: manage_businesses
  - string: manage_ads
  - string: manage_content
  - string: view_analytics
  - string: manage_settings
  - string: handle_complaints
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── admin_users (collection)
    └── admin123 (document)
        ├── name: "Admin User"
        ├── email: "admin@tourph.com"
        ├── role: "super_admin"
        ├── status: "active"
        └── permissions: ["manage_users", "manage_businesses", ...]
```

---

## 📊 Collection 12: analytics

### Step 1: Create Analytics Collection
- Go back to Firestore root
- Click **"Start collection"**
- Collection ID: `analytics`
- Click **"Next"**

### Step 2: Create Daily Analytics Document
- Document ID: Use date format (e.g., `2024-03-15`)
- Add fields:

| Field | Type | Value (Example) |
|-------|------|-----------------|
| date | timestamp | (Set specific date) |
| totalUsers | number | 15420 |
| activeUsers | number | 8920 |
| newUsers | number | 234 |
| totalRevenue | number | 456789 |
| totalBookings | number | 892 |
| totalAds | number | 45 |
| totalBusinesses | number | 567 |
| platformCommission | number | 22839 |
| updatedAt | timestamp | (Click "Set to current time") |

### Step 3: Add Top Categories (Array of Maps)
- Click **"Add field"**
- Field: `topCategories`
- Type: **array**
- Click **"+"** to add first item (type: map):
  - category: string → "hotel"
  - count: number → 234
- Click **"+"** to add second item (type: map):
  - category: string → "restaurant"
  - count: number → 189
- Click **"+"** to add third item (type: map):
  - category: string → "event"
  - count: number → 156
- Click **"Save"**

### Step 4: Add Top Businesses (Array of Maps)
- Click **"Add field"**
- Field: `topBusinesses`
- Type: **array**
- Click **"+"** to add first item (type: map):
  - id: string → business123
  - name: string → Garden City Grand Hotel
  - revenue: number → 125000
- Click **"+"** to add second item (type: map):
  - id: string → business456
  - name: string → Ocean View Restaurant
  - revenue: number → 89000
- Click **"Save"**

### Visual Structure:
```
Firestore Database
└── analytics (collection)
    └── 2024-03-15 (document)
        ├── date: timestamp
        ├── totalUsers: 15420
        ├── activeUsers: 8920
        ├── newUsers: 234
        ├── totalRevenue: 456789
        ├── topCategories: [array of maps]
        │   ├── {category: "hotel", count: 234}
        │   ├── {category: "restaurant", count: 189}
        │   └── {category: "event", count: 156}
        └── topBusinesses: [array of maps]
            ├── {id: "business123", name: "Garden City...", revenue: 125000}
            └── {id: "business456", name: "Ocean View...", revenue: 89000}
```

---

## 🔐 Setting Up Security Rules

### Step 1: Access Firestore Rules
- In Firebase Console, go to **Firestore Database**
- Click on the **"Rules"** tab at the top

### Step 2: Replace Default Rules
- Delete the existing rules
- Copy and paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Helper function to check if user is admin
    function isAdmin() {
      return isAuthenticated() && 
        exists(/databases/$(database)/documents/admin_users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/admin_users/$(request.auth.uid)).data.status == 'active';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
      
      match /favourites/{favouriteId} {
        allow read, write: if isOwner(userId);
      }
      
      match /notifications/{notificationId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Wallets collection
    match /wallets/{userId} {
      allow read, write: if isOwner(userId);
      
      match /transactions/{transactionId} {
        allow read: if isOwner(userId);
        allow create: if isOwner(userId);
      }
      
      match /paymentMethods/{methodId} {
        allow read, write: if isOwner(userId);
      }
    }
    
    // Businesses collection
    match /businesses/{businessId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.ownerId) || isAdmin();
      
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if isAuthenticated();
        allow update, delete: if isOwner(resource.data.userId) || isAdmin();
      }
      
      match /bookings/{bookingId} {
        allow read: if isOwner(resource.data.userId) || isOwner(get(/databases/$(database)/documents/businesses/$(businessId)).data.ownerId) || isAdmin();
        allow create: if isAuthenticated();
      }
    }
    
    // Events collection
    match /events/{eventId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.organizerId) || isAdmin();
      
      match /tickets/{ticketId} {
        allow read: if true;
        allow write: if isOwner(get(/databases/$(database)/documents/events/$(eventId)).data.organizerId) || isAdmin();
      }
    }
    
    // Properties collection
    match /properties/{propertyId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.ownerId) || isAdmin();
      
      match /bookings/{bookingId} {
        allow read: if isOwner(resource.data.userId) || isOwner(get(/databases/$(database)/documents/properties/$(propertyId)).data.ownerId) || isAdmin();
        allow create: if isAuthenticated();
      }
      
      match /reviews/{reviewId} {
        allow read: if true;
        allow create: if isAuthenticated();
        allow update, delete: if isOwner(resource.data.userId) || isAdmin();
      }
      
      match /availability/{dateId} {
        allow read: if true;
        allow write: if isOwner(get(/databases/$(database)/documents/properties/$(propertyId)).data.ownerId) || isAdmin();
      }
    }
    
    // Bookings collection
    match /bookings/{bookingId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Reviews collection
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Ads collection
    match /ads/{adId} {
      allow read: if true;
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(resource.data.advertiserId) || isAdmin();
      
      match /analytics/{dateId} {
        allow read: if isOwner(get(/databases/$(database)/documents/ads/$(adId)).data.advertiserId) || isAdmin();
        allow write: if isAdmin();
      }
    }
    
    // Feedback collection
    match /feedback/{feedbackId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
    }
    
    // App settings collection
    match /app_settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Admin users collection
    match /admin_users/{adminId} {
      allow read, write: if isAdmin();
    }
    
    // Analytics collection
    match /analytics/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

### Step 3: Publish Rules
- Click **"Publish"** button
- Confirm the changes

---

## 📈 Creating Composite Indexes

### Step 1: Access Indexes
- In Firebase Console, go to **Firestore Database**
- Click on the **"Indexes"** tab

### Step 2: Create Index for Businesses
- Click **"Create Index"**
- Collection ID: `businesses`
- Add fields:
  - Field: `category` → Order: Ascending
  - Field: `status` → Order: Ascending
  - Field: `rating` → Order: Descending
- Query scope: Collection
- Click **"Create"**

### Step 3: Create Index for Events
- Click **"Create Index"**
- Collection ID: `events`
- Add fields:
  - Field: `startDate` → Order: Ascending
  - Field: `status` → Order: Ascending
- Query scope: Collection
- Click **"Create"**

### Step 4: Create Index for Properties
- Click **"Create Index"**
- Collection ID: `properties`
- Add fields:
  - Field: `city` → Order: Ascending
  - Field: `pricePerNight` → Order: Ascending
- Query scope: Collection
- Click **"Create"**

### Step 5: Create Index for Reviews
- Click **"Create Index"**
- Collection ID: `reviews`
- Add fields:
  - Field: `relatedId` → Order: Ascending
  - Field: `createdAt` → Order: Descending
- Query scope: Collection
- Click **"Create"**

### Step 6: Create Index for Bookings
- Click **"Create Index"**
- Collection ID: `bookings`
- Add fields:
  - Field: `userId` → Order: Ascending
  - Field: `bookingDate` → Order: Descending
- Query scope: Collection
- Click **"Create"**

---

## ✅ Complete Database Structure Overview

```
Firestore Database
├── users (collection)
│   └── {userId} (document)
│       ├── favourites (subcollection)
│       └── notifications (subcollection)
│
├── wallets (collection)
│   └── {userId} (document)
│       ├── transactions (subcollection)
│       └── paymentMethods (subcollection)
│
├── businesses (collection)
│   └── {businessId} (document)
│       ├── reviews (subcollection)
│       ├── bookings (subcollection)
│       └── analytics (subcollection)
│
├── events (collection)
│   └── {eventId} (document)
│       └── tickets (subcollection)
│
├── properties (collection)
│   └── {propertyId} (document)
│       ├── bookings (subcollection)
│       ├── reviews (subcollection)
│       └── availability (subcollection)
│
├── bookings (collection)
│   └── {bookingId} (document)
│
├── reviews (collection)
│   └── {reviewId} (document)
│
├── ads (collection)
│   └── {adId} (document)
│       └── analytics (subcollection)
│
├── feedback (collection)
│   └── {feedbackId} (document)
│
├── app_settings (collection)
│   └── config (document)
│
├── admin_users (collection)
│   └── {adminId} (document)
│
└── analytics (collection)
    └── {date} (document)
```

---

## 🎯 Next Steps

### 1. Test Your Database
- Create test documents in each collection
- Try reading and writing data from your app
- Verify security rules are working

### 2. Set Up Firebase SDK in Your App
- Install Firebase: `npm install firebase`
- Initialize Firebase in your app
- Create service files for each collection

### 3. Enable Firebase Storage
- For uploading images (business photos, user avatars, etc.)
- Go to Storage in Firebase Console
- Click "Get Started"

### 4. Set Up Firebase Authentication
- Already configured in your app
- Ensure all auth methods are enabled (Google, Facebook, Email)

### 5. Monitor Usage
- Check Firebase Console regularly
- Monitor read/write operations
- Optimize queries if needed

---

## 📚 Useful Resources

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Data Modeling Best Practices](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Querying Data](https://firebase.google.com/docs/firestore/query-data/queries)

---

## 🆘 Common Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Solution**: Check your security rules and ensure the user is authenticated

### Issue: "Index not found"
**Solution**: Create the required composite index in the Indexes tab

### Issue: "Document not found"
**Solution**: Verify the document ID and collection path are correct

### Issue: "Too many reads"
**Solution**: Implement pagination and use real-time listeners sparingly

---

**Congratulations! Your Firestore database is now set up and ready to use! 🎉**
