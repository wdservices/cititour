import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import { RegionProvider } from "./contexts/RegionContext";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppShell from "./components/AppShell";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import CategoriesPage from "./pages/CategoriesPage";
import NotFound from "./pages/NotFound";
import EventsPage from "./pages/EventsPage";
import HotelsPage from "./pages/HotelsPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import FunPlacesPage from "./pages/FunPlacesPage";
import ShoppingPage from "./pages/ShoppingPage";
import AirbnbPage from "./pages/AirbnbPage";
import AttractionsPage from "./pages/AttractionsPage";
import LifestylePage from "./pages/LifestylePage";
import EventTicketsPage from "./pages/EventTicketsPage";
import DetailPage from "./pages/DetailPage";
import DynamicEventPage from "./pages/DynamicEventPage";
import BusinessListingPage from "./pages/BusinessListingPage";
import RunAdsPage from "./pages/RunAdsPage";
import HouseListingsPage from "./pages/HouseListingsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileDashboard from "./pages/ProfileDashboard";
import FavouritesPage from "./pages/FavouritesPage";
import ShareAppPage from "./pages/ShareAppPage";
import FeedbackPage from "./pages/FeedbackPage";
import SettingsPage from "./pages/SettingsPage";
import ContactSupportPage from "./pages/ContactSupportPage";
import WalletPage from "./pages/WalletPage";
import WalletVerifyPage from "./pages/WalletVerifyPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import SearchPage from "./pages/SearchPage";
import OthersPage from "./pages/OthersPage";
import AllBusinessesPage from "./pages/AllBusinessesPage";
import MarketplacePage from "./pages/MarketplacePage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import SplitItPage from "./pages/SplitItPage";
import ListYourBusinessPage from "./pages/ListYourBusinessPage";
import HostAnEventPage from "./pages/HostAnEventPage";
import StatePage from "./pages/StatePage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogPostPage from "./pages/BlogPostPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3 * 60 * 1000,     // 3 minutes before data is considered stale
      gcTime: 15 * 60 * 1000,       // 15 minutes before unused cache is garbage collected
      refetchOnWindowFocus: false,   // Don't refetch on tab switch
      refetchOnReconnect: false,     // Don't refetch on network reconnect
      retry: 1,                      // Retry failed queries once
    },
  },
});

// Protected Routes Component
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Avoid showing a full-screen loader; wait silently while auth initializes.
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect declaratively without flashing a loader.
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/explore" element={<CategoriesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
        <Route path="/businesses" element={<AllBusinessesPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/restaurants" element={<RestaurantsPage />} />
        <Route path="/fun-places" element={<FunPlacesPage />} />
        <Route path="/shopping" element={<ShoppingPage />} />
        <Route path="/airbnb" element={<AirbnbPage />} />
        <Route path="/attractions" element={<AttractionsPage />} />
        <Route path="/lifestyle" element={<LifestylePage />} />
        <Route path="/others" element={<OthersPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/event-tickets" element={<EventTicketsPage />} />
        <Route path="/business-listing" element={<BusinessListingPage />} />
        <Route path="/run-ads" element={<RunAdsPage />} />
        <Route path="/house-listings" element={<HouseListingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/dashboard" element={<ProfileDashboard />} />
        <Route path="/house-listings" element={<Navigate to="/profile/dashboard?tab=listings&action=create&type=property" replace />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/share-app" element={<ShareAppPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/contact-support" element={<ContactSupportPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/wallet/verify" element={<WalletVerifyPage />} />
        <Route path="/events/:id" element={<DetailPage />} />
        <Route path="/hotels/:id" element={<DetailPage />} />
        <Route path="/restaurants/:id" element={<DetailPage />} />
        <Route path="/fun-places/:id" element={<DetailPage />} />
        <Route path="/shopping/:id" element={<DetailPage />} />
        <Route path="/airbnb/:id" element={<DetailPage />} />
        <Route path="/attractions/:id" element={<DetailPage />} />
        <Route path="/lifestyle/:id" element={<DetailPage />} />
        <Route path="/others/:id" element={<DetailPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <WalletProvider>
        <RegionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/split-it" element={<SplitItPage />} />
                  <Route path="/list-your-business" element={<Navigate to="/profile/dashboard?tab=listings&action=create" replace />} />
                  <Route path="/host-an-event" element={<Navigate to="/profile/dashboard?tab=events&action=create" replace />} />
                  <Route path="/add-property" element={<Navigate to="/profile/dashboard?tab=listings&action=create&type=property" replace />} />
                  <Route path="/add-business" element={<Navigate to="/profile/dashboard?tab=listings&action=create&type=business" replace />} />
                  <Route path="/create-event" element={<Navigate to="/profile/dashboard?tab=events&action=create" replace />} />
                  <Route path="/businessplace" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/business-place" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/nigeria/:stateSlug" element={<StatePage />} />
                  <Route path="/blog" element={<BlogIndexPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/events/:eventId" element={<DynamicEventPage />} />
                  <Route path="/auth" element={<AuthPage onAuthenticated={() => {}} />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfUsePage />} />
                  <Route path="/*" element={<ProtectedRoutes />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </RegionProvider>
      </WalletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
