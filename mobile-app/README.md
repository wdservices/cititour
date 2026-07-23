# Citivas Mobile App — Glassmorphic Design System

A premium React Native mobile application featuring a complete glassmorphic design system, built with Expo and Firebase.

## 🎨 Design System

### Colors
- **Primary**: `#1E88E5` (Confident Blue)
- **Accent**: `#D9891F` (Warm Marigold Gold)
- **Success**: `#10B981` (Palm Green)
- **Destructive**: `#EF4444` (Money Out Red)
- **Background**: `#F5F7FA` (Light mode), `#0B0E14` (Dark mode)

### Typography
- **Display**: Bricolage Grotesque (bold, geometric)
- **Body**: Inter (clean humanist sans)

### Glassmorphism
- **Glass Opacity**: 0.7 (light mode), 0.65 (dark mode)
- **Border Radius**: 14–20px on cards, fully rounded (999px) on buttons
- **Blur**: 20px backdrop blur on all glass surfaces
- **Border**: Translucent white hairline (rgba(255,255,255,0.4))

## 🏗️ Architecture

### Project Structure
```
mobile-app/
├── src/
│   ├── components/          # Reusable glassmorphic components
│   │   ├── GlassCard.tsx
│   │   ├── GlassButton.tsx
│   │   ├── GlassHeader.tsx
│   │   ├── FloatingTabBar.tsx
│   │   ├── SideMenu.tsx
│   │   └── PassportStampIcon.tsx
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/             # Screens (pages)
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── EventsScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── MyDashboardScreen.tsx
│   │   └── FavouritesScreen.tsx
│   ├── navigation/          # Navigation stacks
│   │   ├── RootNavigator.tsx
│   │   └── MainTabsContent.tsx
│   ├── theme/               # Theme tokens & styles
│   │   ├── theme.ts
│   │   └── styles.ts
│   └── lib/                 # Utilities
│       ├── firebase.ts
│       └── chat.ts
├── App.tsx
├── app.json
└── package.json
```

### Key Components

#### **GlassCard**
Translucent container with glassmorphic styling.
```tsx
<GlassCard intensity={20} borderColor="#custom">
  <Text>Content</Text>
</GlassCard>
```

#### **GlassButton**
Versatile button with three variants: solid, outline, glass.
```tsx
<GlassButton
  label="Press me"
  onPress={() => {}}
  variant="solid"
  color="primary"
  size="md"
/>
```

#### **PassportStampIcon**
Passport-stamp-styled category icon with dashed circular ring.
```tsx
<PassportStampIcon category="hotels" size={60} />
```

#### **GlassHeader**
Translucent header bar with location pill and icons.
```tsx
<GlassHeader
  title="Tour Lagos"
  subtitle="Citivas CONCIERGE"
  locationPill="Lagos"
  leftIcon="menu"
  rightIcon="bell"
/>
```

#### **FloatingTabBar**
Floating pill-styled tab bar at bottom of screen.
```tsx
<FloatingTabBar
  tabs={[
    { name: 'explore', icon: 'compass', label: 'Explore' },
    { name: 'events', icon: 'calendar', label: 'Events' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

#### **SideMenu**
Slide-in drawer with user profile and menu sections.
```tsx
<SideMenu
  visible={menuVisible}
  onClose={() => setMenuVisible(false)}
  userName="John Doe"
  userEmail="john@example.com"
  sections={menuSections}
  onLogout={logout}
/>
```

### Theme Context

Control light/dark mode globally:
```tsx
const { colors, isDark, themeMode, setThemeMode } = useTheme();

// Change theme
await setThemeMode('dark'); // 'light' | 'dark' | 'auto'
```

Theme preference is persisted to AsyncStorage.

## 🎯 Navigation

- **Tab Navigation** (Floating bottom bar):
  - Explore (home)
  - Events
  - Marketplace
  - Wallet
  - Menu (opens side drawer)

- **Side Menu**:
  - Discover section (Explore, Events, Marketplace)
  - Dashboard section (My Dashboard, Favourites, Wallet)
  - Support section (Share, Feedback, Settings, Contact Support)
  - Log Out button

- **Stack Navigation**:
  - Each tab has its own stack for nested navigation
  - Modal screens slide up from bottom

## 🚀 Getting Started

### Install Dependencies
```bash
cd mobile-app
npm install
```

### Start Dev Server
```bash
npm start
```

### Run on Device/Emulator
```bash
npm run android   # Android emulator
npm run ios       # iOS simulator
```

### Build APK
```bash
npm run build:android
```

## 🔐 Authentication

Firebase Auth with email/password. Login screen includes:
- Sign In / Create Account tabs
- Email & password fields
- Terms of Service acceptance (Sign Up only)
- "Forgot password?" link
- "Continue with Google" option (placeholder)

Auth state is managed globally via AuthContext. Logged-out users see LoginScreen; logged-in users see MainTabs.

## 🎨 Theming

Edit `src/theme/theme.ts` to customize:
- Colors (primary, accent, success, destructive)
- Spacing scale (xs, sm, md, lg, xl, xxl)
- Border radius (xs, sm, md, lg, xl, full)
- Typography (sizes, font families)
- Glass opacity presets

## 📦 Dependencies

- **Expo**: Framework for React Native
- **React Navigation**: Navigation library
- **Firebase**: Backend auth & Firestore
- **Feather Icons** (@expo/vector-icons): Icon library
- **AsyncStorage**: Persistent storage
- **Expo Font**: Custom font loading

## 🧪 Testing

The app includes:
- Dark mode toggle in Settings
- Location-based city detection
- Chat messaging interface
- Wallet transactions
- Marketplace grid with favorites
- Event filtering & booking

## 📝 Notes

- Screens are placeholder-driven; connect to real Firestore/API endpoints for live data
- Passport stamp icons use category colors from the theme
- Dark mode automatically applies glass effect changes (darker, more translucent)
- All fonts default to system fonts; replace with custom fonts via `expo-font` if needed
- Animations are subtle (activeOpacity on touchables); consider adding Reanimated for advanced animations

## 🔗 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Responsive Design](https://tailwindcss.com) (reference for spacing/typography scale)
