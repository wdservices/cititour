import {
  Calendar,
  Building,
  UtensilsCrossed,
  MapPin,
  ShoppingBag,
  Home,
  Camera,
  Heart,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRegion } from "@/contexts/RegionContext";

const categories = [
  {
    id: 1,
    title: "Events",
    icon: Calendar,
    description: "Live shows & concerts",
    color: "#6366f1",
    path: "/events",
  },
  {
    id: 2,
    title: "Hotels",
    icon: Building,
    description: "Luxury stays",
    color: "#10b981",
    path: "/hotels",
  },
  {
    id: 3,
    title: "Restaurants",
    icon: UtensilsCrossed,
    description: "Fine dining",
    color: "#f97316",
    path: "/restaurants",
  },
  {
    id: 4,
    title: "Fun Places",
    icon: MapPin,
    description: "Entertainment",
    color: "#d946ef",
    path: "/fun-places",
  },
  {
    id: 5,
    title: "Shopping",
    icon: ShoppingBag,
    description: "Malls & boutiques",
    color: "#14b8a6",
    path: "/shopping",
  },
  {
    id: 6,
    title: "Airbnb",
    icon: Home,
    description: "Unique stays",
    color: "#3b82f6",
    path: "/airbnb",
  },
  {
    id: 7,
    title: "Attractions",
    icon: Camera,
    description: "Must-see spots",
    color: "#eab308",
    path: "/attractions",
  },
  {
    id: 8,
    title: "Lifestyle",
    icon: Heart,
    description: "Wellness & spa",
    color: "#f43f5e",
    path: "/lifestyle",
  },
  {
    id: 9,
    title: "More",
    icon: MoreHorizontal,
    description: "Explore all",
    color: "#64748b",
    path: "/others",
  },
];

const CategoryGrid = () => {
  const navigate = useNavigate();
  const { locationName } = useRegion();

  return (
    <section className="px-4 md:px-6 pt-14 pb-8">
      <div className="mb-8 md:mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Explore Categories
        </h2>
        <p className="text-muted-foreground text-base">
          Discover the best of {locationName} and beyond
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => navigate(category.path)}
              className="group relative bg-card/60 dark:bg-card/40 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:shadow-card animate-fade-in"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              {/* Glow icon container */}
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{
                  backgroundColor: category.color,
                  boxShadow: `0 0 24px ${category.color}40`,
                }}
              >
                <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
              </div>

              <h3 className="font-semibold text-foreground text-base md:text-lg mb-1">
                {category.title}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">
                {category.description}
              </p>

              {/* Hover glow underlay */}
              <div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none"
                style={{ backgroundColor: category.color }}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;