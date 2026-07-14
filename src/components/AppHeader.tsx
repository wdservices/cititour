import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, Bell, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";
import SideMenu from "./SideMenu";

const AppHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { brandName } = useRegion();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isLandingPage = location.pathname === "/" || location.pathname === "/landing";
  const isExplorePage = location.pathname === "/explore";
  const showGlobalSearch = isLandingPage || isExplorePage;

  // Active link helper
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-soft">
      <div className="flex items-center justify-between px-3 py-2 md:px-4 md:py-3">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-2 md:gap-3">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              <VisuallyHidden.Root>
                <SheetHeader>
                  <SheetTitle>Main Menu</SheetTitle>
                  <SheetDescription>Navigate app sections and features</SheetDescription>
                </SheetHeader>
              </VisuallyHidden.Root>
              <SideMenu onMenuItemClick={() => setIsMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate("/")}>
            <img src="/cititour-logo.png" alt="CitiTour Logo" className="h-7 md:h-8 w-auto object-contain" style={{ filter: 'invert(38%) sepia(70%) saturate(5894%) hue-rotate(200deg) brightness(94%) contrast(101%)' }} />
            <span className="hidden md:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest border-l pl-2 border-border h-4 flex items-center mt-0.5">Explore</span>
          </div>
        </div>

        {/* Center: Search Bar (Landing & Explore) */}
        {showGlobalSearch && (
          <div className="hidden md:flex items-center justify-center max-w-lg mx-auto flex-1">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search restaurants, events, hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                  }
                }}
                className="pl-10 pr-4 bg-background border-border focus:bg-card focus:border-primary transition-colors rounded-full w-full h-11"
              />
            </div>
          </div>
        )}

        {/* Right: Nav Links + Actions */}
        <div className="flex items-center gap-1">
          {/* Nav Links — visible on md+ */}
          <nav className="hidden md:flex items-center gap-1 mr-2">
            <Button
              variant="ghost"
              className={`flex items-center gap-2 text-sm ${
                isActive("/events")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/events")}
            >
              <Calendar className="h-4 w-4" />
              Events
            </Button>
            <Button
              variant="ghost"
              className={`text-sm ${
                isActive("/marketplace")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/marketplace")}
            >
              Marketplace
            </Button>
            <Button
              variant="ghost"
              className={`text-sm ${
                isActive("/businesses")
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => navigate("/businesses")}
            >
              Business Place
            </Button>
          </nav>

          {/* Divider between nav links and actions */}
          <div className="hidden md:block w-px h-6 bg-border mx-1" />

          {/* Mobile Search Icon (Landing & Explore) */}
          {showGlobalSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* User Avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors flex items-center justify-center bg-muted shrink-0"
            aria-label="Go to profile"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name || "User profile"}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (Landing & Explore) */}
      {showGlobalSearch && (
        <div className="md:hidden px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
              className="pl-10 pr-4 bg-background border-border focus:bg-card focus:border-primary transition-colors h-11"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;