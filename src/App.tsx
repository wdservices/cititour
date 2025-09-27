import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/fun-places" element={<FunPlacesPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/airbnb" element={<AirbnbPage />} />
          <Route path="/attractions" element={<AttractionsPage />} />
          <Route path="/lifestyle" element={<LifestylePage />} />
          <Route path="/event-tickets" element={<EventTicketsPage />} />
          <Route path="/events/:id" element={<DetailPage />} />
          <Route path="/hotels/:id" element={<DetailPage />} />
          <Route path="/restaurants/:id" element={<DetailPage />} />
          <Route path="/fun-places/:id" element={<DetailPage />} />
          <Route path="/shopping/:id" element={<DetailPage />} />
          <Route path="/airbnb/:id" element={<DetailPage />} />
          <Route path="/attractions/:id" element={<DetailPage />} />
          <Route path="/lifestyle/:id" element={<DetailPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
