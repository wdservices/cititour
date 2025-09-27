import AppHeader from "@/components/AppHeader";
import HeroSlider from "@/components/HeroSlider";
import CategoryGrid from "@/components/CategoryGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader />

      {/* Main Content */}
      <main className="pb-6">
        {/* Hero Section */}
        <div className="px-4 pt-4">
          <HeroSlider />
        </div>

        {/* Categories Section */}
        <CategoryGrid />

        {/* Quick Actions Banner */}
        <div className="px-4 mt-8">
          <div className="bg-gradient-primary rounded-2xl p-6 text-white shadow-soft">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">
                Ready to Explore?
              </h3>
              <p className="text-primary-foreground/90 mb-4">
                Discover amazing places, book tickets, and enjoy exclusive deals
              </p>
              <div className="flex gap-3 justify-center">
                <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium backdrop-blur-sm transition-colors">
                  Browse Events
                </button>
                <button className="bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-xl text-sm font-medium transition-colors">
                  Find Hotels
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-4 mt-8">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-foreground">
              Trending Now
            </h3>
            <p className="text-muted-foreground text-sm">
              Popular destinations this week
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-card rounded-xl p-4 border shadow-card animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🎭</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Live Concert Series</h4>
                  <p className="text-sm text-muted-foreground">This weekend at Central Park</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-card rounded-xl p-4 border shadow-card animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🍴</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">New Restaurant Opening</h4>
                  <p className="text-sm text-muted-foreground">Grand opening with 20% off</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;