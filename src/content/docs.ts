export interface DocSection {
  id: string;
  title: string;
  icon: string;
  description: string;
  topics: DocTopic[];
}

export interface DocTopic {
  id: string;
  title: string;
  description: string;
  screenshot?: string;
  steps?: string[];
  tips?: string[];
  note?: string;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    description: 'Create your account and start exploring cities across Nigeria.',
    topics: [
      {
        id: 'what-is-Citivas',
        title: 'What is Citivas?',
        description: 'Citivas is Nigeria\'s urban concierge — a platform to discover places, book events, shop locally, and split bills with friends. Whether you\'re in Lagos, Abuja, Port Harcourt, or Kano, Citivas helps you find the best restaurants, hotels, fun places, events, and marketplace products in your city.',
      },
      {
        id: 'create-account',
        title: 'Creating Your Account',
        description: 'You can sign up using your email address or Google account.',
        steps: [
          'Visit the Citivas website and click "Get Started" or "Sign In".',
          'On the auth page, toggle to "Sign Up" mode.',
          'Enter your full name, email address, and create a password.',
          'Accept the Terms of Use and Privacy Policy.',
          'Click "Create Account" to register.',
          'Alternatively, click "Continue with Google" for one-click signup.',
        ],
        tips: [
          'Use a valid email — you\'ll need it to reset your password.',
          'Google Sign-In is the fastest way to get started.',
        ],
      },
      {
        id: 'sign-in',
        title: 'Signing In',
        description: 'Access your Citivas account.',
        steps: [
          'Go to the auth page (click "Sign In" from the landing page).',
          'Enter your registered email and password.',
          'Click "Sign In" to access your dashboard.',
          'Or click "Continue with Google" if you signed up with Google.',
        ],
      },
      {
        id: 'forgot-password',
        title: 'Resetting Your Password',
        description: 'Recover access to your account if you forgot your password.',
        steps: [
          'On the sign-in page, click "Forgot password?" below the password field.',
          'Enter your registered email address.',
          'Check your inbox for a password reset link from Firebase.',
          'Click the link and create a new password.',
          'Return to Citivas and sign in with your new password.',
        ],
        tips: [
          'Check your spam/junk folder if you don\'t see the email.',
          'The reset link expires after a short time — use it promptly.',
        ],
      },
    ],
  },
  {
    id: 'your-profile',
    title: 'Your Profile',
    icon: '👤',
    description: 'Manage your personal information and app preferences.',
    topics: [
      {
        id: 'view-profile',
        title: 'Viewing & Editing Your Profile',
        description: 'Access your profile from the sidebar menu or by clicking your avatar.',
        steps: [
          'Click your profile avatar in the top-right corner, or open the sidebar menu.',
          'Navigate to "My Dashboard" or directly to "Profile".',
          'On the Profile page, you\'ll see tabs: Overview, Bookings, Reviews, Security.',
          'In the Overview tab, edit your first name, last name, phone, location, and bio.',
          'Click "Save" to update your information.',
        ],
      },
      {
        id: 'avatar',
        title: 'Avatar & Personal Info',
        description: 'Your avatar is auto-generated from your initials. Your display name and email are pulled from your sign-up method.',
        tips: [
          'Your name and email are set during registration and can be edited in your profile.',
          'Your profile stats show: Places Visited, Reviews Written, Photos Shared, and Member Since date.',
        ],
      },
      {
        id: 'preferences',
        title: 'App Preferences',
        description: 'Customize your Citivas experience.',
        steps: [
          'Go to Settings (from the sidebar menu).',
          'In the Account tab, you can change your Region & Branding.',
          'Select your city: Lagos, Rivers (Port Harcourt), Abuja, or Kano.',
          'The app brand name changes dynamically — TourLAG, TourRIV, TourABJ, or TourKAN.',
          'Your region preference is saved and remembered on your device.',
        ],
      },
    ],
  },
  {
    id: 'exploring-places',
    title: 'Exploring Places',
    icon: '🗺️',
    description: 'Discover the best businesses, restaurants, hotels, and attractions.',
    topics: [
      {
        id: 'explore-page',
        title: 'The Explore Page',
        description: 'Your main discovery hub showing categories, trending places, and featured listings.',
        steps: [
          'After signing in, you land on the Explore page.',
          'Browse the category grid: Hotels, Restaurants, Fun Places, Shopping, Airbnb, Attractions, Lifestyle, Others.',
          'Scroll down to see horizontal rows of businesses, events, marketplace products, and properties.',
          'Each row shows up to 4 items with a "View More" button to see all.',
          'Use the search bar in the header to find specific places or events.',
        ],
      },
      {
        id: 'category-pages',
        title: 'Category Pages',
        description: 'Dive deep into a specific category to find exactly what you need.',
        steps: [
          'Click any category button on the Explore page (e.g., "Hotels", "Restaurants").',
          'You\'ll see a filtered list of all businesses in that category.',
          'Use the search bar to narrow results by name, location, or keyword.',
          'Click any listing card to view its full details.',
        ],
      },
      {
        id: 'business-details',
        title: 'Viewing Business Details',
        description: 'See the full profile of any business, restaurant, or hotel.',
        steps: [
          'Click on a listing card from any category or search result.',
          'The detail page shows: hero image, business name, category, location, and description.',
          'Scroll down for Features/Tags, Operating Hours, and Contact Info.',
          'Click "Message Business" to contact via WhatsApp or phone call.',
          'Read and write reviews in the Reviews section at the bottom.',
        ],
      },
      {
        id: 'writing-reviews',
        title: 'Writing a Review',
        description: 'Share your experience and help others discover great places.',
        steps: [
          'Navigate to any business detail page.',
          'Scroll to the "Write a Review" section (visible when logged in).',
          'Select your star rating (1-5 stars).',
          'Write your review comment in the text area.',
          'Click "Submit Review" to publish.',
          'Your review appears in the reviews list for that business.',
        ],
        tips: [
          'Be specific about your experience — mention what you liked or didn\'t.',
          'Reviews help other users make informed decisions.',
        ],
      },
      {
        id: 'messaging-business',
        title: 'Messaging a Business',
        description: 'Contact businesses directly via WhatsApp or phone.',
        steps: [
          'On any business detail page, find the "Message Business" button.',
          'If the business has a phone number, clicking the button opens WhatsApp (if available) or your phone dialer.',
          'You can also click "Request Quote" to inquire about services.',
        ],
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    icon: '🎉',
    description: 'Find, register for, and organize events in your city.',
    topics: [
      {
        id: 'browsing-events',
        title: 'Browsing Events',
        description: 'Discover events happening around you.',
        steps: [
          'Click "Events" in the top navigation bar, or find Events in the sidebar menu.',
          'The Events page shows all upcoming events with category filters.',
          'Use the category pills to filter: Food & Drink, Technology, Music & Entertainment, Arts & Culture, Business, Sports & Recreation, General.',
          'Use the search bar to find events by name or keyword.',
          'Click any event card to see full details.',
        ],
      },
      {
        id: 'event-categories',
        title: 'Event Categories & Filters',
        description: 'Narrow down events by type.',
        steps: [
          'Click a category pill at the top of the Events page.',
          'The list updates to show only events in that category.',
          "Click 'All' to see all events again.",
          'Combine category filters with the search bar for precise results.',
        ],
      },
      {
        id: 'register-free-event',
        title: 'Registering for Free Events',
        description: 'Reserve your spot at free events.',
        steps: [
          'Click an event card to open the event details.',
          'If the event is free, click "Reserve a Spot".',
          'Your name and email auto-fill from your account.',
          'Add your phone number (optional).',
          'Click "Confirm Reservation" to complete registration.',
          'You\'ll see a success confirmation.',
        ],
      },
      {
        id: 'buy-event-tickets',
        title: 'Buying Event Tickets (Paid Events)',
        description: 'Purchase tickets for paid events.',
        steps: [
          'Click an event card to open the event details.',
          'Select a ticket tier (e.g., Regular, VIP, VVIP) — each tier shows price and available spots.',
          'Click "Attend" to proceed to registration.',
          'Fill in your name, email, and phone (optional).',
          'Choose the number of tickets.',
          'Click "Continue to Payment" to proceed.',
          'Select your payment method: Credit/Debit Card, Wallet, or Bank Transfer.',
          'Complete the payment — you\'ll be redirected to a success screen.',
        ],
        tips: [
          'You must select a ticket tier before proceeding — the app won\'t let you continue without one.',
          'If paying with Wallet, ensure you have sufficient balance.',
          'Card payments are processed securely via Paystack.',
        ],
      },
      {
        id: 'my-tickets',
        title: 'My Tickets',
        description: 'View events you\'ve registered for or purchased tickets for.',
        steps: [
          'Go to your Dashboard (click your avatar → My Dashboard).',
          'Click the "My Events" tab.',
          'Scroll to the "My Tickets" section.',
          'See all events you\'ve registered for with ticket details.',
          'You can cancel a ticket by clicking the trash icon.',
        ],
      },
    ],
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    icon: '🛒',
    description: 'Buy and sell products — electronics, fashion, vehicles, and more.',
    topics: [
      {
        id: 'browsing-products',
        title: 'Browsing Products',
        description: 'Discover products listed by sellers across Nigeria.',
        steps: [
          'Click "Marketplace" in the top navigation bar.',
          'Browse the product grid — each card shows image, title, price, and location.',
          'Use the sidebar category buttons to filter: Electronics, Fashion, Home, Vehicles, Property.',
          'Use the condition filter: All, New, or Used.',
          'Use the search bar to find specific products.',
        ],
      },
      {
        id: 'product-details',
        title: 'Viewing Product Details',
        description: 'See the full listing of any product.',
        steps: [
          'Click any product card to open its detail page.',
          'View the product image gallery, price, promo price (if discounted), condition, and description.',
          'Check the seller info and location.',
          'Click "Message Seller" to contact the seller.',
          'Read and write reviews for the product.',
        ],
        tips: [
          'Discounted products show the original price with a strikethrough and the promo price in bold.',
        ],
      },
      {
        id: 'contacting-seller',
        title: 'Contacting a Seller',
        description: 'Reach out to sellers directly.',
        steps: [
          'On the product detail page, find the "Message Seller" button.',
          'Click it to open WhatsApp or your phone dialer.',
          'Discuss pricing, availability, and meetup details directly with the seller.',
        ],
      },
    ],
  },
  {
    id: 'properties',
    title: 'Properties & Airbnb',
    icon: '🏠',
    description: 'Find shortlets, rentals, and property listings.',
    topics: [
      {
        id: 'browsing-properties',
        title: 'Browsing Property Listings',
        description: 'Discover available properties and shortlets.',
        steps: [
          'Click the "Airbnb" category on the Explore page, or navigate to /airbnb.',
          'Browse property listing cards with images, prices, and locations.',
          'Click any card to view full property details.',
        ],
      },
      {
        id: 'property-details',
        title: 'Viewing Property Details',
        description: 'See the full profile of a property listing.',
        steps: [
          'Click a property card to open its detail page.',
          'View the hero image, property name, type, price, and description.',
          'Check features, tags, location, and contact information.',
          'Contact the property owner via the provided phone or WhatsApp.',
        ],
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'User Dashboard',
    icon: '📊',
    description: 'Manage all your listings, events, and activity from one place.',
    topics: [
      {
        id: 'dashboard-overview',
        title: 'Dashboard Overview',
        description: 'Your command center for managing everything on Citivas.',
        steps: [
          'Click your profile avatar in the top-right corner → "My Dashboard".',
          'The overview shows stat cards: Businesses, Products, Properties, Events.',
          'Use the Quick Actions grid to create a new listing or event.',
          'Switch between tabs: My Listings, My Events, Ad Manager.',
        ],
      },
      {
        id: 'my-listings',
        title: 'My Listings',
        description: 'View and manage all your businesses, products, and properties.',
        steps: [
          'Click the "My Listings" tab in your dashboard.',
          'Switch between sub-tabs: Businesses, Products, Properties.',
          'Each listing card shows the image, title, location, and price.',
          'Click the Edit icon (pencil) to modify any listing.',
          'Click the Delete icon (trash) to remove a listing.',
        ],
      },
      {
        id: 'create-listing',
        title: 'Creating a New Listing',
        description: 'Add a business, product, property, or event to Citivas.',
        steps: [
          'In your dashboard, click "Create New" or use a Quick Action button.',
          'Choose the listing type: Business, Product, Property, or Event.',
          'Fill in the required fields for your listing type:',
          '  • Business: Name, Category, State, City, Street Address, Phone, Description, Image.',
          '  • Product: Title, Category, Price, Promo Price, Description, Condition, Image.',
          '  • Property: Title, Type, Price, Description, State, City, Image.',
          '  • Event: Title, Category, Start/End Date, Start/End Time, Venue, Ticket Types, Image.',
          'Upload a cover image (stored on Cloudinary).',
          'Click "Create" to publish your listing.',
        ],
        tips: [
          'Images are uploaded to Cloudinary automatically.',
          'For events, you can add multiple ticket tiers with different prices and quantities.',
          'All listings appear on your dashboard for easy management.',
        ],
      },
      {
        id: 'edit-listing',
        title: 'Editing a Listing',
        description: 'Update any of your existing listings.',
        steps: [
          'Go to your Dashboard → My Listings.',
          'Find the listing you want to edit.',
          'Click the Edit icon (pencil) on the listing card.',
          'An edit dialog opens with all current values pre-filled.',
          'Make your changes — businesses show State/City/Phone, products show Price/Promo, events show dates/times/venue/ticket types.',
          'Click "Update" to save changes.',
        ],
      },
      {
        id: 'delete-listing',
        title: 'Deleting a Listing (2-Step Confirmation)',
        description: 'Permanently remove a listing with safety checks.',
        steps: [
          'Go to your Dashboard → My Listings or My Events.',
          'Click the Delete icon (trash) on the listing card.',
          'Step 1: "Are you sure?" — Click "Yes, Continue" to proceed.',
          'Step 2: "Final Confirmation" — Click "Delete Permanently" to confirm.',
          'The listing and its images are removed from Citivas.',
        ],
        tips: [
          'This action cannot be undone.',
          'Cloudinary images are also deleted to save storage.',
        ],
      },
      {
        id: 'my-events-tab',
        title: 'My Events (Organizer View)',
        description: 'Manage events you\'ve created and track attendees.',
        steps: [
          'Click the "My Events" tab in your dashboard.',
          'See analytics: Total Events, Total Capacity, Attendees, Revenue.',
          'Each event shows its ticket tiers and attendee list.',
          'Click "Edit" on an event to modify its details.',
          'Click "Delete" to remove an event (2-step confirmation).',
          'Click "Report" to download a CSV of all event data and attendee details.',
          'Your "My Tickets" section shows events you\'ve registered for as an attendee.',
        ],
      },
    ],
  },
  {
    id: 'wallet',
    title: 'Wallet',
    icon: '💰',
    description: 'Fund your wallet, pay for events, and withdraw to your bank account.',
    topics: [
      {
        id: 'view-balance',
        title: 'Viewing Your Balance',
        description: 'Check your current wallet balance.',
        steps: [
          'Click "Wallet" in the sidebar menu.',
          'Your balance is displayed prominently at the top of the page.',
          'Scroll down to see your transaction history.',
        ],
      },
      {
        id: 'fund-wallet',
        title: 'Funding Your Wallet',
        description: 'Add money to your wallet via Paystack.',
        steps: [
          'Go to your Wallet page.',
          'Click "Add Money".',
          'Enter the amount you want to fund.',
          'Click "Add Funds" — a Paystack payment popup opens.',
          'Choose your payment method: Card, Bank Transfer, or USSD.',
          'Complete the payment.',
          'Your wallet is credited instantly and the transaction appears in your history.',
        ],
        tips: [
          'Payments are processed securely via Paystack.',
          'You can fund your wallet from any amount — there\'s no minimum.',
          'Use your wallet to pay for event tickets without entering card details each time.',
        ],
      },
      {
        id: 'withdraw-funds',
        title: 'Withdrawing to Your Bank Account',
        description: 'Transfer money from your wallet to your bank.',
        steps: [
          'Go to your Wallet page.',
          'Click "Withdraw".',
          'Enter the amount to withdraw.',
          'Select your bank account (or add a new one first).',
          'Review the fee preview — a 1.5% service fee is deducted.',
          'Check the net amount you\'ll receive.',
          'Click "Withdraw Funds" to complete the transfer.',
        ],
      },
      {
        id: 'add-bank-account',
        title: 'Adding a Bank Account',
        description: 'Link a bank account for withdrawals.',
        steps: [
          'Go to Wallet → Withdraw → "Add Bank Account".',
          'Select your bank from the dropdown (fetched from Paystack).',
          'Enter your 10-digit account number.',
          'The system auto-resolves your account name — verify it\'s correct.',
          'Click "Save Bank Account" to link it.',
          'Your bank account is now available for withdrawals.',
        ],
      },
      {
        id: 'transaction-history',
        title: 'Transaction History',
        description: 'View all your wallet transactions.',
        steps: [
          'Go to your Wallet page.',
          'Scroll to the "Transaction History" section.',
          'See all transactions with description, payment method, date, and amount.',
          'Transactions are color-coded: green for credits, red for debits.',
          'Each transaction shows a status badge: completed, pending, or failed.',
        ],
      },
    ],
  },
  {
    id: 'favourites',
    title: 'Favourites',
    icon: '❤️',
    description: 'Save and organize your favourite places.',
    topics: [
      {
        id: 'saving-places',
        title: 'Saving Places',
        description: 'Heart any listing to save it to your favourites.',
        steps: [
          'On any listing card or detail page, click the Heart icon.',
          'The heart fills in to indicate the item is saved.',
          'Click again to unfavourite.',
        ],
      },
      {
        id: 'viewing-favourites',
        title: 'Viewing Your Favourites',
        description: 'Access all your saved places in one place.',
        steps: [
          'Click "Favourites" in the sidebar menu.',
          'See all your saved items in a grid or list view.',
          'Use the category filter: All, Hotels, Restaurants, Events, Attractions, Shopping, Lifestyle.',
          'Use the search bar to find a specific favourite.',
          'Click any item to navigate to its detail page.',
        ],
      },
    ],
  },
  {
    id: 'sharing',
    title: 'Sharing & Referrals',
    icon: '🔗',
    description: 'Share places with friends and earn referral rewards.',
    topics: [
      {
        id: 'share-listings',
        title: 'Sharing Events & Listings',
        description: 'Share any event or listing with friends.',
        steps: [
          'On any event or listing detail page, click the "Share" button.',
          'On mobile, your device\'s native share sheet opens.',
          'On desktop, the link is copied to your clipboard.',
          'Share the link via WhatsApp, Twitter, Facebook, or any messaging app.',
        ],
      },
      {
        id: 'referral-program',
        title: 'Share Citivas Referral Program',
        description: 'Earn rewards by inviting friends to Citivas.',
        steps: [
          'Go to "Share Citivas" in the sidebar menu.',
          'Your unique referral code is displayed.',
          'Click "Copy" to copy your code or shareable link.',
          'Share via WhatsApp, Facebook, Twitter, Instagram, or Email.',
          'Track your referral milestones and rewards on the same page.',
        ],
      },
    ],
  },
  {
    id: 'ads',
    title: 'Ads & Promotion',
    icon: '📢',
    description: 'Promote your business, event, or product with paid ads.',
    topics: [
      {
        id: 'run-ads',
        title: 'Running an Ad Campaign',
        description: 'Create and launch advertising campaigns.',
        steps: [
          'Go to your Dashboard → Ad Manager tab, or visit /run-ads.',
          'Choose an ad format: Banner Ad (₦50,000/week), Sponsored Listing (₦30,000/week), or Featured Event (₦100,000/week).',
          'Fill in campaign details: name, target audience, budget, dates, duration.',
          'Select the category to advertise in.',
          'Write your ad content (title, description, image).',
          'Click "Launch Campaign" to start.',
          'Monitor performance in the Active Campaigns and Analytics tabs.',
        ],
        tips: [
          'Ensure your wallet has sufficient balance before launching.',
          'Campaign analytics show impressions, CTR, clicks, and cost per click.',
        ],
      },
    ],
  },
  {
    id: 'settings',
    title: 'Settings & Privacy',
    icon: '⚙️',
    description: 'Customize your app experience and manage your privacy.',
    topics: [
      {
        id: 'region-branding',
        title: 'Region & Branding',
        description: 'Switch between Nigerian cities for a localized experience.',
        steps: [
          'Go to Settings (sidebar menu).',
          'In the Account tab, find "Region & Branding".',
          'Select your city: Rivers (Port Harcourt), Lagos, Abuja, or Kano.',
          'The app brand name updates: TourRIV, TourLAG, TourABJ, or TourKAN.',
          'The app automatically detects your location on first visit.',
        ],
      },
      {
        id: 'notifications',
        title: 'Notification Preferences',
        description: 'Control what notifications you receive.',
        steps: [
          'Go to Settings → Notifications tab.',
          'Toggle Push Notifications, Email Notifications, and SMS on/off.',
          'Toggle specific types: Booking Confirmations, Special Offers, New Events, Review Reminders, App Updates.',
        ],
      },
      {
        id: 'privacy',
        title: 'Privacy Settings',
        description: 'Control who sees your information.',
        steps: [
          'Go to Settings → Privacy tab.',
          'Toggle Public Profile on/off.',
          'Toggle Location Sharing on/off.',
          'Toggle Activity Status on/off.',
          'Toggle Review Visibility on/off.',
          'Manage Data Usage consent.',
          'Use "Export Data" to download your data, or "Delete Account" in the Danger Zone.',
        ],
      },
    ],
  },
  {
    id: 'support',
    title: 'Support & Feedback',
    icon: '💬',
    description: 'Get help when you need it and share your feedback.',
    topics: [
      {
        id: 'contact-support',
        title: 'Contacting Support',
        description: 'Reach our support team through multiple channels.',
        steps: [
          'Click "Contact Support" in the sidebar menu.',
          'Choose your preferred channel: Live Chat (24/7), Email Support (24/7), or Phone (Mon-Fri).',
          'Use Quick Actions: Check Order Status, Report a Problem, Business Partnership, Feature Request.',
          'Browse the FAQ tab for instant answers.',
          'Submit a support ticket with category, subject, message, and priority level.',
        ],
      },
      {
        id: 'feedback',
        title: 'Submitting Feedback',
        description: 'Help us improve Citivas with your suggestions.',
        steps: [
          'Click "Feedback" in the sidebar menu.',
          'Select feedback type: General, Bug Report, Feature Request, or Business Inquiry.',
          'Rate your experience (1-5 stars).',
          'Write a subject and message (max 500 characters).',
          'Click "Submit Feedback" to send.',
        ],
      },
      {
        id: 'faqs',
        title: 'Frequently Asked Questions',
        description: 'Quick answers to common questions.',
        steps: [
          'Go to Contact Support → FAQ tab.',
          'Browse categories: Account & Profile, Bookings & Reservations, App Features.',
          'Click any question to expand the answer.',
          'Use the search bar to find specific topics.',
        ],
      },
    ],
  },
  {
    id: 'split-it',
    title: 'Split It',
    icon: '🧾',
    description: 'Split bills effortlessly with friends after group outings.',
    topics: [
      {
        id: 'what-is-split-it',
        title: 'What is Split It?',
        description: 'Split It is Citivas\'s bill-splitting feature. Snap a receipt, tag who ordered what, and let the app calculate fair shares — no more awkward math or uneven splits.',
      },
      {
        id: 'how-split-it-works',
        title: 'How It Works',
        description: 'A 4-step process to split any bill.',
        steps: [
          'Step 1: Snap Receipt — Take a photo of your receipt after a group outing.',
          'Step 2: Tag Orders — Assign each item on the receipt to the person who ordered it.',
          'Step 3: Fair Math — The app automatically calculates each person\'s share, including taxes and tips.',
          'Step 4: Share & Settle — Share the split with your group and settle up via your preferred method.',
        ],
        tips: [
          'Works for group dinners, weekend getaways, office lunches, and wedding after-parties.',
          'No more calculators or spreadsheets — Split It does the math for you.',
        ],
      },
      {
        id: 'split-it-landing',
        title: 'Accessing Split It',
        description: 'Visit the Split It landing page.',
        steps: [
          'Click "Split It" in the sidebar menu, or visit /split-it.',
          'The landing page explains the feature with a visual walkthrough.',
          'Click "Try Split It" to get started.',
        ],
      },
    ],
  },
];
