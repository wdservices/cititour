import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { WalletProvider } from "./contexts/WalletContext";
import { RegionProvider } from "./contexts/RegionContext";
import { ActiveChatProvider } from "./contexts/ActiveChatContext";
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
import MiniSitesPage from "./pages/MiniSitesPage";
import MarketplaceDetailPage from "./pages/MarketplaceDetailPage";
import SplitItPage from "./pages/SplitItPage";
import ListYourBusinessPage from "./pages/ListYourBusinessPage";
import HostAnEventPage from "./pages/HostAnEventPage";
import StatePage from "./pages/StatePage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogPostPage from "./pages/BlogPostPage";
import DocsPage from "./pages/DocsPage";
import HospitalityDashboard from "./pages/HospitalityDashboard";
import MiniSiteWizard from "./pages/MiniSiteWizard";
import MiniSitePage from "./pages/MiniSitePage";
import BookingEngine from "./pages/BookingEngine";
import BookingPayment from "./pages/BookingPayment";
import ChildSafetyPage from "./pages/ChildSafetyPage";
import FoodMenuPage from "./pages/FoodMenu";
import WebNotificationListener from "./components/WebNotificationListener";

// Admin dashboard
import { AdminGuard } from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminAdsPage from "./pages/admin/AdsPage";
import AdminContentPage from "./pages/admin/ContentPage";
import AdminComplaintsPage from "./pages/admin/ComplaintsPage";
import AdminBusinessListingPage from "./pages/admin/BusinessListingPage";
import AdminEventsPage from "./pages/admin/EventsPage";
import AdminPropertiesPage from "./pages/admin/PropertiesPage";
import AdminMiniSitesPage from "./pages/admin/MiniSitesPage";
import AdminBookingsPage from "./pages/admin/BookingsPage";
import AdminReviewsPage from "./pages/admin/ReviewsPage";
import AdminFeedbackPage from "./pages/admin/FeedbackPage";
import AdminAppSettingsPage from "./pages/admin/AppSettingsPage";
import AdminAdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "./pages/admin/AnalyticsPage";
import AdminWalletPage from "./pages/admin/WalletPage";
import AdminQRValidatePage from "./pages/admin/QRValidatePage";
import AdminActivityLogsPage from "./pages/admin/ActivityLogsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutes fresh
      gcTime: 30 * 60 * 1000,       // 30 minutes garbage collection
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 1,
    },
  },
});

/** Mounts the background chat notification listener (web). */
function ChatNotificationListeners() {
  return <WebNotificationListener />;
}

// Protected Routes Component
const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Avoid showing a full-screen loader; wait silently while auth initializes.
  if (isLoading) {
    return null;
  }

  // If not authenticated, redirect declaratively without flashing a loader.
  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${redirectUrl}`} replace />;
  }

  return (
    <AppShell>
      <ChatNotificationListeners />
      <Routes>
        <Route path="/explore" element={<CategoriesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<MarketplaceDetailPage />} />
        <Route path="/businesses" element={<AllBusinessesPage />} />
        <Route path="/business/:id" element={<DetailPage />} />
        <Route path="/mini-sites" element={<MiniSitesPage />} />
        <Route path="/m/:slug" element={<MiniSitePage />} />
        <Route path="/food-menu" element={<FoodMenuPage />} />
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
        <Route path="/mini-site-wizard" element={<MiniSiteWizard />} />
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

// Lightweight auth guard that renders children directly (no AppShell wrapper)
const ProtectedRoutesInline = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return null;
  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/auth?redirect=${redirectUrl}`} replace />;
  }
  return <>{children}</>;
};

const App = () => {
  const inner = (
    <AuthProvider>
      <ActiveChatProvider>
      <WalletProvider>
        <RegionProvider>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/hospitality-dashboard" element={
                    <ProtectedRoutesInline>
                      <HospitalityDashboard />
                    </ProtectedRoutesInline>
                  } />
                  <Route path="/split-it" element={<SplitItPage />} />
                  <Route path="/list-your-business" element={<Navigate to="/profile/dashboard?tab=listings&action=create" replace />} />
                  <Route path="/host-an-event" element={<Navigate to="/profile/dashboard?tab=events&action=create" replace />} />
                  <Route path="/add-property" element={<Navigate to="/profile/dashboard?tab=listings&action=create&type=property" replace />} />
                  <Route path="/add-business" element={<Navigate to="/profile/dashboard?tab=listings&action=create&type=business" replace />} />
                  <Route path="/create-event" element={<Navigate to="/profile/dashboard?tab=events&action=create" replace />} />
                  <Route path="/businessplace" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/business-place" element={<Navigate to="/marketplace" replace />} />
                  <Route path="/nigeria/:stateSlug" element={<StatePage />} />
                  <Route path="/m/:slug" element={<MiniSitePage />} />
                  <Route path="/property/:slug" element={<MiniSitePage />} />
                  <Route path="/blog" element={<BlogIndexPage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                  <Route path="/events/:eventId" element={<DynamicEventPage />} />
                  <Route path="/property/:slug" element={<MiniSitePage />} />
                  <Route path="/book/:slug" element={<BookingEngine />} />
                  <Route path="/book/:slug/payment" element={<BookingPayment />} />
                  <Route path="/auth" element={<AuthPage onAuthenticated={() => {}} />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfUsePage />} />
                  <Route path="/docs" element={<DocsPage />} />
                  <Route path="/child-safety" element={<ChildSafetyPage />} />
                  {/* Admin Dashboard Routes */}
                  <Route path="/admin" element={<AdminGuard><AdminLayout><AdminDashboardPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/dashboard" element={<AdminGuard><AdminLayout><AdminDashboardPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/users" element={<AdminGuard><AdminLayout><AdminUsersPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/ads" element={<AdminGuard><AdminLayout><AdminAdsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/content" element={<AdminGuard><AdminLayout><AdminContentPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/complaints" element={<AdminGuard><AdminLayout><AdminComplaintsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/business-listings" element={<AdminGuard><AdminLayout><AdminBusinessListingPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/events" element={<AdminGuard><AdminLayout><AdminEventsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/properties" element={<AdminGuard><AdminLayout><AdminPropertiesPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/mini-sites" element={<AdminGuard><AdminLayout><AdminMiniSitesPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/bookings" element={<AdminGuard><AdminLayout><AdminBookingsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/reviews" element={<AdminGuard><AdminLayout><AdminReviewsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/feedback" element={<AdminGuard><AdminLayout><AdminFeedbackPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/app-settings" element={<AdminGuard><AdminLayout><AdminAppSettingsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/admin-users" element={<AdminGuard><AdminLayout><AdminAdminUsersPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/analytics" element={<AdminGuard><AdminLayout><AdminAnalyticsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/wallet" element={<AdminGuard><AdminLayout><AdminWalletPage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/qr-validate" element={<AdminGuard><AdminLayout><AdminQRValidatePage /></AdminLayout></AdminGuard>} />
                  <Route path="/admin/activity-logs" element={<AdminGuard><AdminLayout><AdminActivityLogsPage /></AdminLayout></AdminGuard>} />
                  <Route path="/*" element={<ProtectedRoutes />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </RegionProvider>
      </WalletProvider>
      </ActiveChatProvider>
    </AuthProvider>
  );

  return (
    <QueryClientProvider client={queryClient}>
      {inner}
    </QueryClientProvider>
  );
};

export default App;
