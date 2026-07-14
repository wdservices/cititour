import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Star, Grid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StampIcon from "@/components/StampIcon";
import { getMockImage } from "@/lib/mockImages";
import hotelLuxury from "@/assets/hotel-luxury.jpg";
import restaurantFine from "@/assets/restaurant-fine.jpg";
import eventMusic from "@/assets/event-music.jpg";
import attractionGarden from "@/assets/attraction-garden.jpg";

const favourites = [
  {
    id: "1",
    title: "Eko Hotels & Suites",
    description: "Waterfront stays in Victoria Island with spa and lagoon views.",
    image: hotelLuxury,
    category: "Hotels",
    rating: 4.9,
    price: "₦85,000+/night",
    location: "Victoria Island, Lagos",
    isOpen: true,
  },
  {
    id: "2",
    title: "Nkoyo",
    description: "Modern Nigerian tasting menus in a warm, design-forward room.",
    image: restaurantFine,
    category: "Restaurants",
    rating: 4.8,
    price: "₦15,000–40,000",
    location: "Ikoyi, Lagos",
    isOpen: true,
  },
  {
    id: "3",
    title: "Detty December Live",
    description: "Afrobeats nights and pop-up concerts across the city.",
    image: eventMusic,
    category: "Events",
    rating: 4.8,
    price: "₦5,000–25,000",
    location: "Lagos Island",
    isOpen: true,
  },
  {
    id: "4",
    title: "Lekki Conservation Centre",
    description: "Canopy walkway and nature trails on the Lekki peninsula.",
    image: attractionGarden,
    category: "Attractions",
    rating: 4.9,
    price: "₦2,000–5,000",
    location: "Lekki, Lagos",
    isOpen: true,
  },
];

const categories = ["All", "Hotels", "Restaurants", "Events", "Attractions", "Shopping", "Lifestyle"];

const FavouritesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredFavourites = favourites.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (itemId: string) => {
    const item = favourites.find((f) => f.id === itemId);
    if (item) {
      navigate(`/${(item.category || "others").toLowerCase()}/${itemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-background">
        <div className="px-4 py-8 max-w-6xl mx-auto">
          <Button
            variant="ghost"
            className="text-foreground hover:bg-muted mb-4"
            onClick={() => navigate("/explore")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 group">
            <StampIcon icon={Heart} tone="accent" size="md" />
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Saved</span>
              <h1 className="font-display text-3xl font-extrabold">My Favourites</h1>
              <p className="text-muted-foreground">{favourites.length} saved places</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your favourites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="icon" onClick={() => setViewMode("grid")}>
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="icon" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {filteredFavourites.length > 0 ? (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredFavourites.map((item) =>
              viewMode === "grid" ? (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className="text-left rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={item.image || getMockImage(item.category)} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg leading-tight">{item.title}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-sm font-medium">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {item.location}
                      </span>
                      <span className="text-sm font-semibold text-accent shrink-0">{item.price}</span>
                    </div>
                  </div>
                </button>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  className="w-full flex text-left rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="w-40 h-28 shrink-0">
                    <img src={item.image || getMockImage(item.category)} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="flex-1 p-4 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <h3 className="font-display font-bold truncate">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                        <span className="text-sm">{item.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm text-muted-foreground truncate">
                        <MapPin className="h-3.5 w-3.5" />
                        {item.location}
                      </span>
                      <span className="font-semibold text-accent">{item.price}</span>
                    </div>
                  </div>
                </button>
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16 group">
            <div className="flex justify-center mb-5">
              <StampIcon icon={Heart} tone="muted" size="lg" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">No favourites found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filters"
                : "Start exploring and save places you love."}
            </p>
            <Button onClick={() => navigate("/explore")} className="rounded-full bg-primary text-primary-foreground">
              Discover Places
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;
