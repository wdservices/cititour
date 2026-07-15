import { 
  User, 
  Building2, 
  Megaphone, 
  Home, 
  Heart, 
  Calendar, 
  Share, 
  MessageSquare, 
  Settings, 
  HelpCircle,
  LogOut,
  Ticket,
  Wallet,
  LayoutDashboard,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRegion } from "@/contexts/RegionContext";

const menuItems = [
  {
    section: "Discover",
    items: [
      { icon: Home, title: "Explore", description: "Find new places" },
      { icon: Calendar, title: "Events", description: "Local happenings" },
      { icon: ShoppingBag, title: "Marketplace", description: "Buy & sell" },
      { icon: Building2, title: "Business Place", description: "Shops & services" },
    ]
  },
  {
    section: "Dashboard",
    items: [
      { icon: LayoutDashboard, title: "My Dashboard", description: "Manage all your listings" },
      { icon: Heart, title: "Favourites", description: "Your saved places" },
      { icon: Wallet, title: "Wallet", description: "Manage your funds" },
    ]
  },
  {
    section: "Support",
    items: [
      { icon: Share, title: "Share CitiTour", description: "Invite friends" },
      { icon: MessageSquare, title: "Feedback", description: "Help us improve" },
      { icon: Settings, title: "Settings & Privacy", description: "Account settings" },
      { icon: HelpCircle, title: "Contact Support", description: "Get help" },
    ]
  }
];

interface SideMenuProps {
  onMenuItemClick: () => void;
}

const SideMenu = ({ onMenuItemClick }: SideMenuProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { brandName } = useRegion();
  
  const handleMenuItemClick = (title: string) => {
    const routeMap: { [key: string]: string } = {
      "Explore": "/explore",
      "Events": "/events",
      "Marketplace": "/marketplace",
      "Business Place": "/businesses",
      "My Dashboard": "/profile/dashboard",
      "Favourites": "/favourites",
      "Wallet": "/wallet",
      "Share App": "/share-app",
      "Feedback": "/feedback",
      "Settings & Privacy": "/settings",
      "Contact Support": "/contact-support"
    };
    
    const route = routeMap[title];
    if (route) {
      navigate(route);
    }
    onMenuItemClick();
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const displayName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.photoURL || '';
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-primary">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Avatar className="h-12 w-12 border-2 border-white/30">
            <AvatarImage src={userAvatar} alt={displayName} />
            <AvatarFallback className="bg-white/20 text-white font-semibold">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <div className="text-white flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold truncate">{displayName}</h3>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 text-xs">
                Active
              </Badge>
            </div>
            <p className="text-sm opacity-90 truncate">{userEmail}</p>
            <p className="text-xs opacity-75">{brandName} Explorer</p>
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="flex-1 overflow-y-auto">
        {menuItems.map((section, sectionIndex) => (
          <div key={section.section} className="py-4">
            <div className="px-6 mb-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {section.section}
              </h4>
            </div>
            
            <div className="space-y-1 px-3">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                
                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={`w-full justify-start gap-3 px-3 py-3 h-auto text-left
                      hover:bg-muted/50 transition-colors animate-slide-up`}
                    style={{
                      animationDelay: `${(sectionIndex * section.items.length + itemIndex) * 0.05}s`
                    }}
                    onClick={() => handleMenuItemClick(item.title)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">
                        {item.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
            
            {sectionIndex < menuItems.length - 1 && (
              <Separator className="mt-4" />
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
        
        <div className="mt-4 flex flex-col items-center gap-1 justify-center">
          <img src="/cititour-logo.png" alt={`${brandName} Logo`} className="h-6 w-auto object-contain" style={{ filter: 'invert(38%) sepia(70%) saturate(5894%) hue-rotate(200deg) brightness(94%) contrast(101%)' }} />
          <p className="text-[10px] text-muted-foreground/60 mt-1">
            By Bluewaves Technologies
          </p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
