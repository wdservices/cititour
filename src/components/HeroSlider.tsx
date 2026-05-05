import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import hero images
import heroCityscape from "@/assets/hero-cityscape.jpg";
import heroRestaurant from "@/assets/hero-restaurant.jpg";
import heroNightlife from "@/assets/hero-nightlife.jpg";
import heroHotel from "@/assets/hero-hotel.jpg";

const heroImages = [
  {
    id: 1,
    src: heroCityscape,
    title: "Discover Nigeria",
    subtitle: "Explore the best of urban lifestyle"
  },
  {
    id: 2,
    src: heroRestaurant,
    title: "Fine Dining Experiences",
    subtitle: "Savor culinary excellence"
  },
  {
    id: 3,
    src: heroNightlife,
    title: "Vibrant Nightlife",
    subtitle: "Experience the city after dark"
  },
  {
    id: 4,
    src: heroHotel,
    title: "Luxury Accommodations",
    subtitle: "Stay in comfort and style"
  }
];

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-hero bg-gradient-hero">
      {/* Image Container */}
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-700"
              onClick={() => {
                // Navigate to relevant category or detail page
                console.log(`Clicked on ${image.title}`);
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
                {image.title}
              </h2>
              <p className="text-sm md:text-base opacity-90 animate-slide-up">
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm"
        onClick={goToNext}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? "bg-white w-6" 
                : "bg-white/50 hover:bg-white/75"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;