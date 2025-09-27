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
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SheetClose } from "@/components/ui/sheet";

const menuItems = [
  {
    section: "Personal",
    items: [
      { icon: User, title: "Profile", description: "Manage your account" },
      { icon: Heart, title: "Favourites", description: "Your saved places" },
      { icon: Calendar, title: "Events & Deals", description: "Special offers" },
    ]
  },
  {
    section: "Business",
    items: [
      { icon: Building2, title: "Business Listing", description: "List your business" },
      { icon: Megaphone, title: "Run Ads", description: "Promote your business" },
      { icon: Home, title: "House Listings", description: "Airbnb & rentals" },
    ]
  },
  {
    section: "Support",
    items: [
      { icon: Share, title: "Share App", description: "Invite friends" },
      { icon: MessageSquare, title: "Feedback", description: "Help us improve" },
      { icon: Settings, title: "Settings & Privacy", description: "Account settings" },
      { icon: HelpCircle, title: "Contact Support", description: "Get help" },
    ]
  }
];

const SideMenu = () => {
  const handleMenuItemClick = (title: string) => {
    console.log(`Navigate to ${title}`);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-primary">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="text-white">
            <h3 className="font-semibold">Welcome!</h3>
            <p className="text-sm opacity-90">Garden City Explorer</p>
          </div>
        </div>
        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <X className="h-5 w-5" />
          </Button>
        </SheetClose>
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary/10 flex items-center justify-center shrink-0">
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
          onClick={() => handleMenuItemClick("Logout")}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default SideMenu;