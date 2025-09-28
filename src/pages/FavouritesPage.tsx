import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, Star, Filter, Grid, List, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ListingCard from "@/components/ListingCard";
import hotelLuxury from "@/assets/hotel-luxury.jpg";
import restaurantFine from "@/assets/restaurant-fine.jpg";
import eventMusic from "@/assets/event-music.jpg";
import attractionGarden from "@/assets/attraction-garden.jpg";

const favourites = [
  {
    id: "1",
    title: "Garden City Grand Hotel",
    description: "Luxury 5-star hotel in the heart of Garden City with world-class amenities and spa services.",
    image: hotelLuxury,
    category: "Hotels",
    rating: 4.9,
    price: "$200-400/night",
    location: "Downtown Garden City",
    phone: "+1234567890",
    website: "https://example.com",
    isOpen: true,
    savedDate: "2024-01-15"
  },
  {
    id: "2",
    title: "Garden Bistro",
    description: "Fine dining restaurant specializing in modern European cuisine with fresh ingredients.",
    image: restaurantFine,
    category: "Restaurants", 
    rating: 4.8,
    price: "$40-80",
    location: "Garden City Center",
    phone: "+1234567891",
    website: "https://example.com",
    isOpen: true,
    savedDate: "2024-01-10"
  },
  {
    id: "3",
    title: "Garden City Music Festival",
    description: "Annual music festival featuring local and international artists with amazing atmosphere.",
    image: eventMusic,
    category: "Events",
    rating: 4.8,
    price: "$25-50",
    location: "Central Park, Garden City",
    phone: "+1234567892",
    website: "https://example.com",
    isOpen: true,
    savedDate: "2024-01-08"
  },
  {
    id: "4",
    title: "Botanical Gardens",
    description: "Stunning botanical gardens featuring rare plants and peaceful walking trails.",
    image: attractionGarden,
    category: "Attractions",
    rating: 4.9,
    price: "$8-15",
    location: "Garden City Park", 
    phone: "+1234567893",
    website: "https://example.com",
    isOpen: true,
    savedDate: "2024-01-05"
  }
];

const categories = ["All", "Hotels", "Restaurants", "Events", "Attractions", "Shopping", "Lifestyle"];

const FavouritesPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredFavourites = favourites.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleItemClick = (itemId: string) => {
    const item = favourites.find(f => f.id === itemId);
    if (item) {
      navigate(`/${item.category.toLowerCase()}/${itemId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white py-8">
        <div className="px-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Favourites</h1>
              <p className="text-white/90">{favourites.length} saved places</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="px-4 py-4 bg-white border-b sticky top-0 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results */}
        {filteredFavourites.length > 0 ? (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredFavourites.map((item) => (
              viewMode === "grid" ? (
                <ListingCard
                  key={item.id}
                  {...item}
                  onClick={() => handleItemClick(item.id)}
                />
              ) : (
                <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex" onClick={() => handleItemClick(item.id)}>
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.location}</span>
                        </div>
                        <span className="font-semibold text-primary">{item.price}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No favourites found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== "All" 
                ? "Try adjusting your search or filters"
                : "Start exploring and save places you love!"}
            </p>
            <Button onClick={() => navigate("/")} className="bg-gradient-primary hover:opacity-90">
              Discover Places
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavouritesPage;