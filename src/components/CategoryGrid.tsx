import { useState } from "react";
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
import StampIcon, { type StampTone } from "@/components/StampIcon";

const allCategories: {
  id: number;
  title: string;
  icon: typeof Calendar;
  description: string;
  tone: StampTone;
  path: string;
  rotate: "-rotate-6" | "-rotate-3" | "rotate-3" | "rotate-6";
  isMoreBtn?: boolean;
}[] = [
  { id: 1, title: "Events", icon: Calendar, description: "Live shows & concerts", tone: "primary", path: "/events", rotate: "-rotate-6" },
  { id: 2, title: "Hotels", icon: Building, description: "Luxury stays", tone: "success", path: "/hotels", rotate: "rotate-3" },
  { id: 3, title: "Restaurants", icon: UtensilsCrossed, description: "Fine dining", tone: "accent", path: "/restaurants", rotate: "-rotate-3" },
  { id: 4, title: "Fun Places", icon: MapPin, description: "Entertainment", tone: "primary-dark", path: "/fun-places", rotate: "rotate-6" },
  { id: 5, title: "Shopping", icon: ShoppingBag, description: "Malls & boutiques", tone: "primary", path: "/shopping", rotate: "-rotate-3" },
  { id: 6, title: "Airbnb", icon: Home, description: "Unique stays", tone: "success", path: "/airbnb", rotate: "rotate-3" },
  { id: 7, title: "Attractions", icon: Camera, description: "Must-see spots", tone: "accent", path: "/attractions", rotate: "-rotate-6" },
  { id: 8, title: "Lifestyle", icon: Heart, description: "Wellness & spa", tone: "primary-dark", path: "/lifestyle", rotate: "rotate-6" },
  { id: 9, title: "Others", icon: MoreHorizontal, description: "Everything else", tone: "muted", path: "/others", rotate: "-rotate-3" },
];

const CategoryGrid = () => {
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();
  const { locationName } = useRegion();

  const displayedCategories = showAll
    ? allCategories
    : [
        ...allCategories.slice(0, 4),
        {
          id: 99,
          title: "More",
          icon: MoreHorizontal,
          description: "Explore all",
          tone: "muted" as StampTone,
          path: "",
          rotate: "rotate-0" as const,
          isMoreBtn: true,
        },
      ];

  return (
    <section className="px-4 md:px-6 pt-14 pb-12">
      <div className="mb-12 md:mb-14 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Explore</span>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-foreground">
          Categories stamped for {locationName}
        </h2>
        <p className="text-muted-foreground text-base mt-3">
          Pick a pass and collect the city one stamp at a time.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
        {displayedCategories.map((category, index) => {
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                if (category.isMoreBtn) {
                  setShowAll(true);
                } else {
                  navigate(category.path);
                }
              }}
              className="group flex flex-col items-center text-center gap-4 p-4 md:p-6 rounded-2xl border border-transparent hover:border-border hover:bg-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <StampIcon
                icon={category.icon}
                tone={category.tone}
                size="lg"
                rotate={category.rotate === "rotate-0" ? "rotate-0" : category.rotate}
              />
              <div>
                <h3 className="font-display font-bold text-foreground text-base md:text-lg">
                  {category.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
