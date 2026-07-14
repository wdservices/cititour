import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Heart, Share2, MapPin, ShoppingCart, 
  MessageCircle, Star, Shield, CheckCircle2,
  ShieldCheck, Truck, RefreshCcw, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SEO from "@/components/SEO";
import StampIcon from "@/components/StampIcon";

/* Extended static listings matching the HTML design details */
const listings = [
  {
    id: "1",
    title: "Brand New iPhone 15 Pro",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCBvigL7KaEyDrqdpsC3SBCj7ZOfqtLb2K79Q12V6f2qCOvVRsBTT5qPGSSHEA8gJFyTTGhURbmDO9VZHby_sa5yau7lPAOGF9CwwP99f81YMNzGyzrd8MUaroM46I9W7NOuKmmnv2hlHYXlb6sn1LOALsPDZByqe3n2_9wcRX9lTO3T0OquBLwCzmBdCmY4XUhIOcAKqCPG-FtwMCkipITokL7jKOT7pwuB3Ob8FTyQekKF4LQY0Oqao0jrzsCT5d438k8nIesECc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD1G7Tcm9dICfA7Mw70CQm2eX3a-Ro1Hfss85iG3GfwfeE7w2u1zoTcUVlr0Bv-KGx6mxDQymSF-g71KJLrDgLZAPAwVHbNErF9Tnr6rqCrav3RIfOS8qeri4BK0I0oEjbmHSVHRKV-p28p2gvp7qsCnJ8iYyQdnAvUK_PXFhb8gQmjmFKuF3MCt3oVyfyWg49qoDUTpV-YnuC_p6L-ZHmoUatlmo6hqcvIXOgpGUMlERa54t92jIkwQUgAopO4VGky-2mNM4I3UBM",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA57NsNr0REniUh22nBq4DbagoR3mk1sCNcdZtkIk-uTHfjb4F7cYtzjpDC8fZtZrec6jX9ollYG3_GFd8mDxjJGPE3BchzdzU3DbWwsh8OAobnRUy8fpn53S8FU1-1BSZQXZqTiEe_KmDTA2zPSkjwRmY1ZZeIbdBHZ_GD4GtoppHPOlZCsKkmbmiYtYCbbrsf2HMlPWDu7_v65F0amFLRHKNn-vVZsnbqPN5QklHg6t58IvsXE8KZ3vFBg07kfJ0wg9TdA60Rw7A",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIt3186IfciduYuKitTmyd7VwogBzTp1cadIJiTvaFQrE7gM8n0e7Wb9Vosnk5wtJGTm4xnUCkIbraE-MOe1-l4uWIz8lu9VLkBvxGKKrFh3E2Liz1pGI0ZmIp6ctPYSW2tMGBDubRkx3eeIdcvMnUxUTHD7C7TxHmDsPTPlIewvLw4SjX3tGSXnh3BAOk7pCFBOEIqMZo_62-4sW1oCw3bNuAdbzYF9LeOrEqRLWmfBDA-6lH56-CH9mmO6cMddXviu3iuEcaLWc",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuChho2LEUVQuveU-RXV5Lz5T7wIo7ag_fS7j0uvq1A4XDbxYutXl-pNZsa53voFMGg5JPefes0F5miEMAyT-WbncsyuV7ao0EFGOYfz1hiqXqtLtrwJUkLHh4fi4GblUm6Rw_x4gQ3vlzSH1VHaa-0yHK2I2s8biLjaYSjP1C_qBqlO3OiHXbbeRRv0hLdh0LUwcM_WetRb41qSn4DSDHt3hzhdv63qkUfbZR5e63JRywbX7ARGhQOPn387BW_Em4tFEUxyukJT0xM"
    ],
    location: "Lekki, Lagos, Nigeria",
    price: "₦1,450,000",
    category: "Electronics",
    condition: "New",
    description: "Brand new, factory sealed iPhone 15 Pro 256GB in Natural Titanium. Comes with full Apple warranty. Local pickup or delivery available within Lagos. Features the A17 Pro chip, 48MP main camera, and USB-C.",
    features: ["256GB Storage", "Natural Titanium", "Sealed Box", "Apple Warranty"],
    seller: {
      name: "TechHub Lagos",
      rating: 4.9,
      reviews: 124,
      verified: true
    }
  },
  {
    id: "2",
    title: "Designer Leather Sofa",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwsgas-RZUn7S4QghTXmpDUhdDvlgrAWlS_t_DVE1Oa-vvukjfSuoy_Y8ObP29pDlfQbOqd2KA5njm_EWs-nYt4aP6vRi2th9__SFU9VyEYr7l9HlipWJVrRDnMd-yl816PbXMzF0sMhky3UUSuBhuh41xshvun7HqFmVcNnDLOEvcFH9g7CQf0JNZe1q9nNDGHki0A7p4SZnow0UnVdZnaHBTf5qwA1qz4sTxMi9Ooqbz0oZXxlQhi1_wawYxY-uxw2eLo7Ms7no"
    ],
    location: "Ikoyi, Lagos",
    price: "₦850,000",
    category: "Home",
    condition: "New",
    description: "Luxury Italian leather 3-seater sofa in charcoal grey. Perfect for modern interiors. Minor delivery charge applies outside Ikoyi.",
    features: ["Italian Leather", "Charcoal Grey", "3-Seater", "Modern Design"],
    seller: { name: "LuxHome NG", rating: 4.7, reviews: 89, verified: false }
  },
  {
    id: "3",
    title: "2022 Toyota Camry",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9YkdONifOOzBHeGryo_ybFJhSL9IgHJm9zNt1ImHjRj3deBR1dizH388QSiqV0CoZpyOa8dld44DkawzpWb3GjUj94yvxTc2K2lgs08od_mEnMYvfOt7htqpovU9gGb7ett_MY-MUSf6WQlcIsycYN0t6MIm2SayX5WYaLCWwubCjtiqf_TcZJD7rTZ_r47lHOiH7DAb5_9sZxuMCwH253hDq2moh1vC4M1w2px8Ilg-wkoSy1StrIcU9mrmyNS4ePiBkkV9QTKo"
    ],
    location: "GRA, Port Harcourt",
    price: "₦28,500,000",
    category: "Vehicles",
    condition: "Foreign Used",
    description: "2022 Toyota Camry XSE V6, pearl white. Only 12,000 km. Full service history. Registered. Serious buyers only.",
    features: ["XSE V6 Engine", "12,000 km Mileage", "Pearl White", "Full Service History"],
    seller: { name: "AutoDeals PH", rating: 4.8, reviews: 210, verified: true }
  },
  {
    id: "4",
    title: "Modern 2-Bedroom in GRA",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCYyDw1WFAQ-EgOwKDED9EvI253VSmCc0aHd39uQJ8bPEQl-uHDjmM975-PRkTQ5sSJN-l9FqtBJpZEUIKVDhI5FhX2UQjEzatIaLd_KO0b_bihgVjx5w7oma5sB3apcQBqbOz7S9G6HkgDXvFRQvwXqlpi0IPRcF2uVcbJUvUtpuoVuk0UOrpXCAp_crDuYdBxsMW1DzglzkuH9OsWKVbD5piBM09-v8XQQ2YYCGr-7hDbDBdar9t0bDuLkLo2zkQEt6QJbKFU1BI"
    ],
    location: "Ikeja, Lagos",
    price: "₦4,500,000/yr",
    category: "Property",
    condition: "Available",
    description: "Spacious 2-bedroom apartment in a gated estate. 24/7 power, water, and security. Available for immediate move-in.",
    features: ["2 Bedrooms", "24/7 Power", "Gated Estate", "Water Supply"],
    seller: { name: "GRA Properties", rating: 4.6, reviews: 45, verified: true }
  },
  {
    id: "5",
    title: "Ultra Pro Smart Watch",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCLGQ7OzWc0eovIJ4bcGwTddLtmE7-Gv1ycSpPsf6sJ3nPOuxACz6Fle-z-UFugsvBeXMXW18Y8wxWSrHnDf0U6-dh_GnZvp1SXgqEN5iOCiVI15ufZj10WErgJTm7Xh4Is416PokwuBbtDtiGHACHcQyK5IoAI4aZag1BMqESZYduhMntvxxRNFDLAzog3c7ipq1ex5_hCvW8VoT7LSZYoPxDD2mSi99Yj0yvrYIjMN6UJ1zXl9rI6VQckWcW8iLrKKencvDFe1r4"
    ],
    location: "Victoria Island, Lagos",
    price: "₦250,000",
    category: "Electronics",
    condition: "New",
    description: "Ultra Pro Smart Watch with AMOLED display, fitness tracking, SpO2 monitoring, and 7-day battery. Comes with extra straps.",
    features: ["AMOLED Display", "SpO2 Monitoring", "7-Day Battery", "Extra Straps"],
    seller: { name: "GadgetWorld VI", rating: 4.5, reviews: 312, verified: true }
  },
  {
    id: "6",
    title: "2023 Luxury Sedan",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCUKz_5Xu3gBOhKQFjuItNGpEHeNINC0COs1GLmODRASXg_tbBzlEhw3Lv5z46dlEXrmH8yoIpLaikgSiTguFLY4J77uuIpY71pHgQ0NqpYspfkYDcmhxc1Fo5NM--B_eA7S1yDlWUBzt4edEB4lCfuwJrPjRfE1h33dzubOM5BPk4CfUwAecJld2zV8ZGWfToJrt7GDdK6jvBu_YeqTA48SE7t3YCFdGmlW9UDoAnvPYebCv9S82OTsIQMhcUTuFxaJuVhLQt-Pf0"
    ],
    location: "Abuja, FCT",
    price: "₦45,000,000",
    category: "Vehicles",
    condition: "Brand New",
    description: "Stunning 2023 luxury sports sedan in metallic red. Under 5,000 km. Full warranty. Test drive available by appointment.",
    features: ["Metallic Red", "Under 5,000 km", "Full Warranty", "Sports Edition"],
    seller: { name: "Premium Motors Abuja", rating: 5.0, reviews: 88, verified: true }
  },
  {
    id: "7",
    title: "Elite Urban Sneakers",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCeWr6T8oY1-Xzl12jxnvxQMYIcUyhEggSbb35WB0xqWRsiBn0QZlgZk1NgnUWlx_qANLOYsmsAVQ9oiA9RQ9oVwCNrZkOK0aCXOsKMG9T1nmPrSu9ArM51vZ4N-IwScRQfYG1hLvgRPSYx8Z8_HTMQBhuRNtqObhr1KOGiJuxJsY_dZ0A2AVxSuL_NOPgFjQosEe0NpiXgwaE8DFpBRvMjfGkey0vDsHwd-lp7h2zya6Q8fe7f2cZ_5cBo3mvymhtK-6gg9oABGTk"
    ],
    location: "Surulere, Lagos",
    price: "₦120,000",
    category: "Fashion",
    condition: "New",
    description: "Limited-edition designer sneakers in vibrant colorway. US Size 10. Deadstock, never worn. Comes with original box and receipt.",
    features: ["US Size 10", "Limited Edition", "Deadstock", "Original Box included"],
    seller: { name: "SneakerVault NG", rating: 4.8, reviews: 156, verified: true }
  },
  {
    id: "8",
    title: "Power Workstation Laptop",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALjQaDW3qZOYv3IIRZCSQEGWSiXw4IbO6H1ffypq90ZxaYri9jGGK2BVdqWdXYbhu99OPw933gLBo3jJ5rCt6k5DgHm-yfWub7rkGfT_ktSu7YlmFxWPloOBIky0KyUy16JL4sIwEHBg6Im5e1TWopMQPCIpkAsAw0nsim-QIA6rFjYBQHv5imguK7AeqM8CMtp9rnvSpT2SgeEi4r8HoiI8MMYGL1dTPTXms9mxIcVJspZGtzBCksq6BZxYm9SKBKJ2NQtBA4W2s"
    ],
    location: "Enugu, Nigeria",
    price: "₦980,000",
    category: "Electronics",
    condition: "New",
    description: "High-performance workstation laptop with 32GB RAM, 1TB SSD, and dedicated GPU. Perfect for creative professionals and developers.",
    features: ["32GB RAM", "1TB SSD", "Dedicated GPU", "16-inch Display"],
    seller: { name: "TechPro Enugu", rating: 4.6, reviews: 67, verified: false }
  },
];

const MarketplaceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  const item = listings.find((l) => l.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50">
          <div className="flex items-center px-4 py-4 max-w-7xl mx-auto">
            <Button variant="ghost" size="icon" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="text-xl font-bold text-foreground mb-2">
            Listing not found
          </h2>
          <p className="text-muted-foreground mb-6">
            This item may have been sold or removed.
          </p>
          <Button onClick={() => navigate("/marketplace")}>
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 lg:pb-8">
      <SEO 
        title={`Urban Pulse | ${item.title}`} 
        description={item.description}
      />
      
      {/* Mobile Header (Back button etc) */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(!liked)}
              className="rounded-full hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${
                  liked ? "fill-destructive text-destructive" : "text-muted-foreground"
                }`}
              />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Share2 className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-10">
        {/* Desktop Breadcrumb/Back */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => window.history.length > 2 ? navigate(-1) : navigate('/explore')} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Marketplace
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className={`gap-2 transition-colors ${
                  liked ? "border-destructive/50 bg-destructive/10 text-destructive" : ""
                }`}
              onClick={() => setLiked(!liked)}
            >
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-destructive text-destructive" : ""
                }`}
              />
              {liked ? "Saved" : "Save"}
            </Button>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Product Gallery */}
          <div className="w-full lg:w-3/5 space-y-4 lg:space-y-6">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-card/60 border border-border/50 shadow-card group relative">
              <img
                src={item.images[mainImageIdx]}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 pointer-events-none"></div>
            </div>
            
            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3 lg:gap-4">
                {item.images.slice(0, 4).map((img, idx) => {
                  const isLastThumb = idx === 3 && item.images.length > 4;
                  return (
                    <div 
                      key={idx}
                      onClick={() => setMainImageIdx(idx)}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all relative ${
                        mainImageIdx === idx 
                          ? "border-2 border-primary" 
                          : "border border-border/50 hover:border-primary/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {isLastThumb && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] flex items-center justify-center font-bold text-foreground text-lg lg:text-xl">
                          +{item.images.length - 3}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-2/5 flex flex-col gap-6 lg:gap-8">
            
            {/* Title and Tags */}
            <div className="space-y-3 lg:space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-primary/20">
                  {item.category}
                </span>
                {item.condition && (
                  <span className="bg-success/10 text-success px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-success/20">
                    {item.condition}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {item.title}
              </h1>
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm lg:text-base">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="p-5 lg:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border-t border-t-white/5 border-x border-x-border/30 border-b border-b-border/30 shadow-xl">
              <p className="text-[10px] lg:text-xs font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">
                Market Price
              </p>
              <div className="text-3xl lg:text-[40px] font-extrabold text-accent leading-none tracking-tight">
                {item.price}
              </div>
              <div className="mt-4 lg:mt-5 flex items-center gap-2 text-success font-medium text-xs lg:text-sm bg-success/10 w-fit px-3 py-1.5 rounded-lg border border-success/20">
                <ShieldCheck className="w-4 h-4 lg:w-4 lg:h-4" />
                Secure payment through CitiTour
              </div>
            </div>

            {/* Seller Profile Card */}
            <div className="p-4 rounded-xl bg-card border border-border flex items-center justify-between group transition-all hover:shadow-soft">
              <div className="flex items-center gap-4">
                <StampIcon icon={User} tone="primary" size="md" />
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <h3 className="font-display font-bold text-foreground">{item.seller.name}</h3>
                    {item.seller.verified && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/15 text-success">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary mb-0.5" />
                    <span className="font-bold text-foreground">{item.seller.rating}</span>
                    <span className="text-muted-foreground">({item.seller.reviews} reviews)</span>
                  </div>
                </div>
              </div>
              <span className="text-primary text-xs font-bold uppercase tracking-wider group-hover:underline hidden sm:block">
                View Profile
              </span>
            </div>

            {/* Description & Features */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-foreground">Description</h4>
              <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                {item.description}
              </p>
              
              {item.features && item.features.length > 0 && (
                <div className="pt-3">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    {item.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="leading-tight mt-0.5">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Sticky contact CTA */}
            <div className="sticky bottom-4 grid grid-cols-2 gap-3 lg:gap-4 mt-auto pt-4 lg:pt-0 z-10">
              <Button className="w-full h-12 lg:h-14 text-sm lg:text-base font-bold rounded-full bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </Button>
              <Button variant="outline" className="w-full h-12 lg:h-14 text-sm lg:text-base font-bold rounded-full border-2 border-border bg-card gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact seller
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-between items-center px-4 lg:px-5 py-3 lg:py-4 rounded-xl bg-card/40 border border-border/50 mt-2">
              <div className="flex flex-col sm:flex-row items-center gap-1.5 lg:gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-center sm:text-left leading-tight">Buyer<br className="hidden sm:block lg:hidden"/> Protection</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 lg:gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-center sm:text-left leading-tight">Fast<br className="hidden sm:block lg:hidden"/> Delivery</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-1.5 lg:gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <RefreshCcw className="w-5 h-5 text-primary" />
                <span className="text-[9px] lg:text-[10px] font-bold uppercase tracking-wider text-center sm:text-left leading-tight">Easy<br className="hidden sm:block lg:hidden"/> Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Related items strip */}
        <section className="mt-12 pt-10 border-t border-border">
          <h2 className="font-display text-2xl font-extrabold mb-6">Related items</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {listings
              .filter((l) => l.id !== item.id && l.category === item.category)
              .slice(0, 4)
              .map((rel) => (
                <button
                  key={rel.id}
                  type="button"
                  onClick={() => navigate(`/marketplace/${rel.id}`)}
                  className="text-left rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-card transition-shadow"
                >
                  <div className="aspect-square overflow-hidden">
                    <img src={rel.images[0]} alt={rel.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{rel.title}</h3>
                    <p className="text-accent font-bold text-sm mt-1">{rel.price}</p>
                  </div>
                </button>
              ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default MarketplaceDetailPage;
