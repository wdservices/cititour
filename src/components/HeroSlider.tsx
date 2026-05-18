import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import hero images
import heroCityscape from "@/assets/hero-cityscape.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroNightlife from "@/assets/hero-nightlife.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";

const heroSlides = [
  {
    id: 1,
    src: heroCityscape,
    title: "Discover Nigeria",
    subtitle:
      "Explore the best of urban lifestyle, from the high-energy pulse of Lagos to the refined elegance of Port Harcourt.",
    cta: { label: "Start Exploring", path: "/events" },
    ctaSecondary: { label: "View Categories", path: "/explore" },
  },
  {
    id: 2,
    src: heroRestaurant,
    title: "Fine Dining Experiences",
    subtitle:
      "Savor culinary excellence from top-rated restaurants and hidden local gems across the city.",
    cta: { label: "Explore Restaurants", path: "/restaurants" },
    ctaSecondary: { label: "See Hotels", path: "/hotels" },
  },
  {
    id: 3,
    src: heroNightlife,
    title: "Vibrant Nightlife",
    subtitle:
      "Experience the city after dark — live music, rooftop lounges, and unforgettable nights out.",
    cta: { label: "Find Events", path: "/events" },
    ctaSecondary: { label: "Fun Places", path: "/fun-places" },
  },
  {
    id: 4,
    src: heroHotel,
    title: "Luxury Accommodations",
    subtitle:
      "Stay in comfort and style at handpicked hotels, resorts, and Airbnb properties.",
    cta: { label: "Browse Hotels", path: "/hotels" },
    ctaSecondary: { label: "View Airbnb", path: "/airbnb" },
  },
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <section className="px-4 md:px-6 pt-2 pb-2">
      <div className="relative h-[420px] md:h-[520px] lg:h-[600px] w-full rounded-[28px] md:rounded-[32px] overflow-hidden shadow-hero group">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentIndex
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.src}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
            />
            {/* Multi-layer gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
          </div>
        ))}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 z-10">
          <div className="max-w-3xl">
            <h2
              key={`title-${currentIndex}`}
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3 md:mb-4 animate-fade-in"
              style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              {heroSlides[currentIndex].title}
            </h2>
            <p
              key={`sub-${currentIndex}`}
              className="text-base md:text-lg lg:text-xl text-white/80 max-w-xl mb-6 md:mb-8 animate-fade-in"
              style={{ animationDelay: "0.15s" }}
            >
              {heroSlides[currentIndex].subtitle}
            </p>
            <div
              className="flex flex-wrap gap-3 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <button
                onClick={() =>
                  navigate(heroSlides[currentIndex].cta.path)
                }
                className="bg-primary text-primary-foreground px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base hover:scale-105 active:scale-95 transition-transform shadow-lg"
              >
                {heroSlides[currentIndex].cta.label}
              </button>
              <button
                onClick={() =>
                  navigate(heroSlides[currentIndex].ctaSecondary.path)
                }
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold text-sm md:text-base hover:bg-white/20 active:scale-95 transition-all"
              >
                {heroSlides[currentIndex].ctaSecondary.label}
              </button>
            </div>
          </div>
        </div>

        {/* Pill Indicators — bottom right */}
        <div className="absolute bottom-6 right-6 md:bottom-8 md:right-12 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Nav Arrows — glassmorphic */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all z-10 opacity-0 group-hover:opacity-100"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all z-10 opacity-0 group-hover:opacity-100"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;