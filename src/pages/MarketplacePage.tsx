import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  MapPin,
  ShoppingCart,
  Car,
  Key,
  Laptop,
  ShoppingBag,
  Plus,
  Grid3X3,
  List,
  Monitor,
  Shirt,
  Home,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import SEO from "@/components/SEO";

/* ── Static demo listings ── */
const categories = [
  { id: "electronics", label: "Electronics", icon: Monitor },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "home", label: "Home", icon: Home },
  { id: "vehicles", label: "Vehicles", icon: Car },
  { id: "property", label: "Property", icon: Building2 },
];

type Listing = {
  id: string;
  title: string;
  image: string;
  location: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  category: string;
  actionIcon: "cart" | "car" | "key" | "laptop" | "bag";
};

const listings: Listing[] = [
  {
    id: "1",
    title: "Brand New iPhone 15 Pro",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDchjygky8L_2W7Su50qmTp_V1Wjz3uGHkMdbng3lzJ0e3LkaY_nRB0Toy2ZzfUKvFmKYewA9Kc9drrSsZQyCeJrPXUzla18PXx9UDDsdrRuo_P41JicL0ZSDuVodHbe4tbGGNaOVkHcFVMnKPYo7FkLBhAA7DYv8QozRbfH0VBNw0G0pXDlcS5SYbahAnaSByqyY48rsmrqtV8MKxbheIF0d0xirj4dCm656t9J-mRZMJF60MkkXgSB42g8bE3I_jAHl8tk-hRD7M",
    location: "Lekki, Lagos",
    price: "₦1,450,000",
    badge: "New Arrival",
    badgeColor: "bg-emerald-500 text-white",
    category: "electronics",
    actionIcon: "cart",
  },
  {
    id: "2",
    title: "Designer Leather Sofa",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwsgas-RZUn7S4QghTXmpDUhdDvlgrAWlS_t_DVE1Oa-vvukjfSuoy_Y8ObP29pDlfQbOqd2KA5njm_EWs-nYt4aP6vRi2th9__SFU9VyEYr7l9HlipWJVrRDnMd-yl816PbXMzF0sMhky3UUSuBhuh41xshvun7HqFmVcNnDLOEvcFH9g7CQf0JNZe1q9nNDGHki0A7p4SZnow0UnVdZnaHBTf5qwA1qz4sTxMi9Ooqbz0oZXxlQhi1_wawYxY-uxw2eLo7Ms7no",
    location: "Ikoyi, Lagos",
    price: "₦850,000",
    category: "home",
    actionIcon: "cart",
  },
  {
    id: "3",
    title: "2022 Toyota Camry",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9YkdONifOOzBHeGryo_ybFJhSL9IgHJm9zNt1ImHjRj3deBR1dizH388QSiqV0CoZpyOa8dld44DkawzpWb3GjUj94yvxTc2K2lgs08od_mEnMYvfOt7htqpovU9gGb7ett_MY-MUSf6WQlcIsycYN0t6MIm2SayX5WYaLCWwubCjtiqf_TcZJD7rTZ_r47lHOiH7DAb5_9sZxuMCwH253hDq2moh1vC4M1w2px8Ilg-wkoSy1StrIcU9mrmyNS4ePiBkkV9QTKo",
    location: "GRA, Port Harcourt",
    price: "₦28,500,000",
    category: "vehicles",
    actionIcon: "car",
  },
  {
    id: "4",
    title: "Modern 2-Bedroom in GRA",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYyDw1WFAQ-EgOwKDED9EvI253VSmCc0aHd39uQJ8bPEQl-uHDjmM975-PRkTQ5sSJN-l9FqtBJpZEUIKVDhI5FhX2UQjEzatIaLd_KO0b_bihgVjx5w7oma5sB3apcQBqbOz7S9G6HkgDXvFRQvwXqlpi0IPRcF2uVcbJUvUtpuoVuk0UOrpXCAp_crDuYdBxsMW1DzglzkuH9OsWKVbD5piBM09-v8XQQ2YYCGr-7hDbDBdar9t0bDuLkLo2zkQEt6QJbKFU1BI",
    location: "Ikeja, Lagos",
    price: "₦4,500,000/yr",
    badge: "Premium Rent",
    badgeColor: "bg-primary text-primary-foreground",
    category: "property",
    actionIcon: "key",
  },
  {
    id: "5",
    title: "Ultra Pro Smart Watch",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLGQ7OzWc0eovIJ4bcGwTddLtmE7-Gv1ycSpPsf6sJ3nPOuxACz6Fle-z-UFugsvBeXMXW18Y8wxWSrHnDf0U6-dh_GnZvp1SXgqEN5iOCiVI15ufZj10WErgJTm7Xh4Is416PokwuBbtDtiGHACHcQyK5IoAI4aZag1BMqESZYduhMntvxxRNFDLAzog3c7ipq1ex5_hCvW8VoT7LSZYoPxDD2mSi99Yj0yvrYIjMN6UJ1zXl9rI6VQckWcW8iLrKKencvDFe1r4",
    location: "Victoria Island, Lagos",
    price: "₦250,000",
    category: "electronics",
    actionIcon: "cart",
  },
  {
    id: "6",
    title: "2023 Luxury Sedan",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKz_5Xu3gBOhKQFjuItNGpEHeNINC0COs1GLmODRASXg_tbBzlEhw3Lv5z46dlEXrmH8yoIpLaikgSiTguFLY4J77uuIpY71pHgQ0NqpYspfkYDcmhxc1Fo5NM--B_eA7S1yDlWUBzt4edEB4lCfuwJrPjRfE1h33dzubOM5BPk4CfUwAecJld2zV8ZGWfToJrt7GDdK6jvBu_YeqTA48SE7t3YCFdGmlW9UDoAnvPYebCv9S82OTsIQMhcUTuFxaJuVhLQt-Pf0",
    location: "Abuja, FCT",
    price: "₦45,000,000",
    category: "vehicles",
    actionIcon: "car",
  },
  {
    id: "7",
    title: "Elite Urban Sneakers",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeWr6T8oY1-Xzl12jxnvxQMYIcUyhEggSbb35WB0xqWRsiBn0QZlgZk1NgnUWlx_qANLOYsmsAVQ9oiA9RQ9oVwCNrZkOK0aCXOsKMG9T1nmPrSu9ArM51vZ4N-IwScRQfYG1hLvgRPSYx8Z8_HTMQBhuRNtqObhr1KOGiJuxJsY_dZ0A2AVxSuL_NOPgFjQosEe0NpiXgwaE8DFpBRvMjfGkey0vDsHwd-lp7h2zya6Q8fe7f2cZ_5cBo3mvymhtK-6gg9oABGTk",
    location: "Surulere, Lagos",
    price: "₦120,000",
    category: "fashion",
    actionIcon: "bag",
  },
  {
    id: "8",
    title: "Power Workstation Laptop",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALjQaDW3qZOYv3IIRZCSQEGWSiXw4IbO6H1ffypq90ZxaYri9jGGK2BVdqWdXYbhu99OPw933gLBo3jJ5rCt6k5DgHm-yfWub7rkGfT_ktSu7YlmFxWPloOBIky0KyUy16JL4sIwEHBg6Im5e1TWopMQPCIpkAsAw0nsim-QIA6rFjYBQHv5imguK7AeqM8CMtp9rnvSpT2SgeEi4r8HoiI8MMYGL1dTPTXms9mxIcVJspZGtzBCksq6BZxYm9SKBKJ2NQtBA4W2s",
    location: "Enugu, Nigeria",
    price: "₦980,000",
    category: "electronics",
    actionIcon: "laptop",
  },
];

const ActionIcon = ({ type }: { type: Listing["actionIcon"] }) => {
  const cls = "w-4 h-4";
  switch (type) {
    case "car":
      return <Car className={cls} />;
    case "key":
      return <Key className={cls} />;
    case "laptop":
      return <Laptop className={cls} />;
    case "bag":
      return <ShoppingBag className={cls} />;
    default:
      return <ShoppingCart className={cls} />;
  }
};

/* ══════════════════════════════════════════ */

const MarketplacePage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("electronics");
  const [condition, setCondition] = useState("all");
  const [radius, setRadius] = useState("15km");
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = listings.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q);
    const matchCat =
      activeCategory === "all" || l.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Marketplace | CititourNG"
        description="Buy and sell electronics, fashion, vehicles, property and more on the CititourNG marketplace."
        keywords={[
          "marketplace",
          "buy",
          "sell",
          "Nigeria",
          "electronics",
          "fashion",
          "vehicles",
          "property",
        ]}
        canonicalUrl={`${window.location.origin}/marketplace`}
      />

      <div className="max-w-7xl mx-auto flex gap-5 px-4 md:px-6 pt-4">
        {/* ── Sidebar (lg+) ── */}
        <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-[72px] h-[calc(100vh-88px)] overflow-y-auto">
          <div className="bg-card/60 dark:bg-card/40 backdrop-blur-sm rounded-2xl p-5 border border-border/50 shadow-card">
            {/* Categories */}
            <div className="mb-6">
              <h2 className="font-bold text-lg text-primary mb-0.5">
                Categories
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Premium Selection
              </p>
            </div>

            <nav className="flex flex-col gap-1.5 mb-6">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      active
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-0.5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </nav>

            {/* Filters */}
            <div className="border-t border-border/50 pt-5">
              <h3 className="font-semibold text-foreground mb-4">Filters</h3>

              {/* Price Range */}
              <div className="mb-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Price Range
                </label>
                <input
                  type="range"
                  className="w-full accent-primary h-1 bg-accent rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1.5 text-[11px] text-muted-foreground">
                  <span>₦0</span>
                  <span>₦10M+</span>
                </div>
              </div>

              {/* Condition */}
              <div className="mb-5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Condition
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {["all", "new", "used"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCondition(c)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-full capitalize transition-colors ${
                        condition === c
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground hover:bg-primary/20"
                      }`}
                    >
                      {c === "all" ? "All" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Radius */}
              <div className="mb-6">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                  Radius (KM)
                </label>
                <div className="flex gap-1.5">
                  {["5km", "15km", "30km"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRadius(r)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                        radius === r
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border/50 bg-accent text-muted-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List an Item CTA */}
            <button
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-transform"
            >
              List an Item
            </button>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main className="flex-1 pb-24 lg:pb-8 min-w-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Marketplace
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Discover exclusive listings in your area and beyond.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden p-2 bg-card/60 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg border border-border/50 transition-colors ${
                  viewMode === "grid"
                    ? "bg-card text-foreground"
                    : "bg-card/40 text-muted-foreground opacity-50"
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg border border-border/50 transition-colors ${
                  viewMode === "list"
                    ? "bg-card text-foreground"
                    : "bg-card/40 text-muted-foreground opacity-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search bar (mobile / md) */}
          <div className="lg:hidden mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search marketplace..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 bg-accent border-border/50 rounded-full"
              />
            </div>
          </div>

          {/* Mobile filter panel */}
          {showMobileFilters && (
            <div className="lg:hidden mb-5 bg-card/60 backdrop-blur-sm rounded-2xl p-4 border border-border/50 animate-fade-in">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => {
                  const active = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-muted-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
              {/* Condition */}
              <div className="flex gap-2 mb-3">
                {["all", "new", "used"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCondition(c)}
                    className={`px-3 py-1 text-[11px] font-bold rounded-full capitalize transition-colors ${
                      condition === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-muted-foreground"
                    }`}
                  >
                    {c === "all" ? "All" : c}
                  </button>
                ))}
              </div>
              {/* Radius */}
              <div className="flex gap-2">
                {["5km", "15km", "30km"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      radius === r
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border/50 bg-accent text-muted-foreground"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
                : "flex flex-col gap-4"
            }
          >
            {filtered.map((item, index) => (
              <div
                key={item.id}
                className={`group bg-card/60 dark:bg-card/40 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-300 shadow-card animate-fade-in cursor-pointer ${
                  viewMode === "list" ? "flex" : ""
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/marketplace/${item.id}`)}
              >
                {/* Image */}
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list"
                      ? "w-32 sm:w-44 shrink-0"
                      : "aspect-square"
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Favorite */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:text-red-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedIds.has(item.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </button>
                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute bottom-3 left-3">
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-3.5 ${viewMode === "list" ? "flex-1 flex flex-col justify-center" : ""}`}>
                  <h3 className="font-semibold text-sm md:text-base text-foreground truncate">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1 mb-2.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm md:text-base text-primary">
                      {item.price}
                    </span>
                    <button className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                      <ActionIcon type={item.actionIcon} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground">
                No listings found. Try a different category or search term.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile FAB — List an Item ── */}
      <button
        className="fixed bottom-20 right-5 lg:hidden w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-40"
        aria-label="List an item"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
};

export default MarketplacePage;
