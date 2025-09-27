import { 
  Calendar, 
  Building, 
  UtensilsCrossed, 
  MapPin, 
  ShoppingBag, 
  Home, 
  Camera, 
  Heart 
} from "lucide-react";
import { Card } from "@/components/ui/card";

const categories = [
  {
    id: 1,
    title: "Events",
    icon: Calendar,
    description: "Live shows, concerts & more",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Hotels",
    icon: Building,
    description: "Luxury stays & accommodations",
    color: "from-green-500 to-blue-500"
  },
  {
    id: 3,
    title: "Restaurants",
    icon: UtensilsCrossed,
    description: "Fine dining & local cuisine",
    color: "from-orange-500 to-red-500"
  },
  {
    id: 4,
    title: "Fun Places",
    icon: MapPin,
    description: "Entertainment & activities",
    color: "from-pink-500 to-purple-500"
  },
  {
    id: 5,
    title: "Shopping",
    icon: ShoppingBag,
    description: "Malls, boutiques & markets",
    color: "from-teal-500 to-green-500"
  },
  {
    id: 6,
    title: "Airbnb",
    icon: Home,
    description: "Unique stays & rentals",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: 7,
    title: "Attractions",
    icon: Camera,
    description: "Must-see spots & landmarks",
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: 8,
    title: "Lifestyle",
    icon: Heart,
    description: "Wellness, spa & fitness",
    color: "from-rose-500 to-pink-500"
  }
];

const CategoryGrid = () => {
  const handleCategoryClick = (category: typeof categories[0]) => {
    // Navigate to category listing page
    console.log(`Navigate to ${category.title} listings`);
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Explore Categories
        </h2>
        <p className="text-muted-foreground">
          Discover the best of Garden City
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {categories.map((category, index) => {
          const Icon = category.icon;
          
          return (
            <Card
              key={category.id}
              className={`relative overflow-hidden cursor-pointer group transition-all duration-300 
                hover:scale-105 hover:shadow-card border-0 bg-gradient-card
                animate-bounce-in`}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handleCategoryClick(category)}
            >
              <div className="p-6 text-center">
                {/* Icon with Gradient Background */}
                <div className={`
                  w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${category.color} shadow-soft
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Category Title */}
                <h3 className="font-semibold text-foreground mb-1 text-lg">
                  {category.title}
                </h3>

                {/* Category Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {category.description}
                </p>
              </div>

              {/* Hover Effect Overlay */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${category.color} 
                opacity-0 group-hover:opacity-10 transition-opacity duration-300
              `} />
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryGrid;