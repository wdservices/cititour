import { useState, useEffect, useMemo } from "react";
import { Search, SlidersHorizontal, Star, Utensils, X, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { type FoodItem, type FoodCategory, getFoodItems, getFoodCategories } from "@/lib/foodMenu";
import { Loader2 } from "lucide-react";

export default function FoodMenu() {
  const [items, setItems] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "featured">("featured");
  const [showAllCats, setShowAllCats] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [fi, cat] = await Promise.all([getFoodItems(), getFoodCategories()]);
        setItems(fi.filter((i) => i.available));
        setCategories(cat.filter((c) => c.active).sort((a, b) => a.displayOrder - b.displayOrder));
      } catch { /* silent */ }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = useMemo(() => {
    let result = items;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) =>
        i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      result = result.filter((i) => i.categoryId === selectedCategory);
    }
    switch (sortBy) {
      case "name": result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case "price-asc": result = [...result].sort((a, b) => a.price - b.price); break;
      case "price-desc": result = [...result].sort((a, b) => b.price - a.price); break;
      case "featured": result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break;
    }
    return result;
  }, [items, search, selectedCategory, sortBy]);

  const categoryIcon = (cat: FoodCategory) => {
    if (cat.icon) return cat.icon;
    const map: Record<string, string> = {
      "small-chops": "🍟", appetizers: "🥗", soups: "🍲", swallows: "🫓",
      "rice-dishes": "🍚", grills: "🔥", sides: "🥦", beverages: "🥤",
      desserts: "🍰", combos: "🍽️",
    };
    return map[cat.slug] || "🍴";
  };

  const categoryCount = (catId: string) => items.filter((i) => i.categoryId === catId).length;

  // Structured data for SEO
  const jsonLd = items.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Citivas Hospitality Menu",
    description: "Food and beverage menu available at Citivas Hospitality.",
    hasMenuSection: categories.map((cat) => ({
      "@type": "MenuSection",
      name: cat.name,
      hasMenuItem: items.filter((i) => i.categoryId === cat.id).map((item) => ({
        "@type": "MenuItem",
        name: item.name,
        description: item.description,
        offers: item.complimentary ? { "@type": "Offer", price: "0", priceCurrency: "NGN" } :
          { "@type": "Offer", price: item.price, priceCurrency: "NGN" },
      })),
    })),
  } : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/20">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Utensils className="h-8 w-8 text-amber-300" />
            <span className="text-sm tracking-widest uppercase text-amber-200">Hospitality</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Food Menu</h1>
          <p className="text-amber-200 text-lg max-w-xl mx-auto">
            Curated flavors crafted for your comfort. Order from the comfort of your suite.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 flex-wrap">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  selectedCategory === "all"
                    ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200"
                    : "bg-white border-amber-200 text-amber-800 hover:border-amber-400 hover:bg-amber-50"
                }`}
              >
                All ({items.length})
              </button>
              {(showAllCats ? categories : categories.slice(0, 5)).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id!)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    selectedCategory === cat.id
                      ? "bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-200"
                      : "bg-white border-amber-200 text-amber-800 hover:border-amber-400 hover:bg-amber-50"
                  }`}
                >
                  {categoryIcon(cat)} {cat.name} ({categoryCount(cat.id!)})
                </button>
              ))}
              {categories.length > 5 && (
                <button
                  onClick={() => setShowAllCats(!showAllCats)}
                  className="whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all border bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100 hover:border-amber-400 flex items-center gap-1"
                >
                  {showAllCats ? (
                    <>Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>More <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white border-amber-200 focus-visible:ring-amber-400"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="h-10 rounded-md border border-amber-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="featured">Chef's Picks</option>
              <option value="name">Name A–Z</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Utensils className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">
              {items.length === 0 ? "Menu coming soon" : "No items match your search"}
            </p>
            <p className="text-sm mt-1">
              {items.length === 0 ? "We're preparing something delicious for you." : "Try a different search term."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((item) => (
              <Card key={item.id} className="group overflow-hidden border-amber-100 hover:border-amber-300 hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-muted overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-50">
                      <Utensils className="h-12 w-12 text-amber-300" />
                    </div>
                  )}
                  {item.featured && (
                    <Badge className="absolute top-3 left-3 bg-amber-500 hover:bg-amber-500 text-white border-0 shadow-md">
                      <Star className="h-3 w-3 mr-1" /> Chef's Special
                    </Badge>
                  )}
                  {item.complimentary && (
                    <Badge className="absolute top-3 right-3 bg-green-500 hover:bg-green-500 text-white border-0 shadow-md">
                      Complimentary
                    </Badge>
                  )}
                  {item.spicyLevel && item.spicyLevel !== "none" && (
                    <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-500 text-white border-0 shadow-md">
                      {item.spicyLevel === "mild" ? "🌶️" : item.spicyLevel === "medium" ? "🌶️🌶️" : "🌶️🌶️🌶️"}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg leading-tight">{item.name}</h3>
                    <span className="text-amber-700 font-bold text-lg whitespace-nowrap">
                      {item.complimentary || item.price === 0
                        ? "Free"
                        : item.discountPrice
                          ? `₦${item.discountPrice.toLocaleString()}`
                          : `₦${item.price.toLocaleString()}`
                      }
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.description}</p>
                  {item.portionSize && (
                    <Badge variant="outline" className="text-xs font-normal border-amber-200">
                      {item.portionSize}
                    </Badge>
                  )}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </div>
  );
}
