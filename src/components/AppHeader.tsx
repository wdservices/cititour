import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, Search, Bell, Moon, Sun, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { useTheme } from "@/contexts/ThemeContext";
import { useRegion } from "@/contexts/RegionContext";
import { useAuth } from "@/contexts/AuthContext";
import SideMenu from "./SideMenu";

const AppHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
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
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu & Logo */}
        <div className="flex items-center gap-3">
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

          <div className="flex flex-col cursor-pointer" onClick={() => navigate("/")}>
            <h1 className="font-bold text-lg text-primary">{brandName}</h1>
            <p className="text-xs text-muted-foreground">Explore</p>
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
                className="pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-primary transition-colors rounded-full w-full"
              />
            </div>
          </div>
        )}

        {/* Right: Nav Links + Actions */}
        <div className="flex items-center gap-1 md:gap-2">
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

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full flex items-center justify-center border-2 border-background">
              <span className="text-[10px] text-white font-bold">3</span>
            </div>
          </Button>

          {/* User Avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors flex items-center justify-center bg-muted shrink-0 ml-1"
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
        <div className="md:hidden px-4 pb-3">
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
              className="pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-900 focus:border-primary transition-colors"
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;