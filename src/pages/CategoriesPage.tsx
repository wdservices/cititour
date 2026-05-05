import CategoryGrid from "@/components/CategoryGrid";
import HeroSlider from "@/components/HeroSlider";
import SEO from "@/components/SEO";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <SEO 
        title="Explore Categories | CititourNG"
        description="Discover restaurants, hotels, events, attractions, lifestyle, shopping, and more across Nigeria."
        keywords={["Nigeria", "restaurants", "hotels", "events", "attractions", "lifestyle", "shopping", "travel", "tourism", "fun places"]}
        canonicalUrl={`${window.location.origin}/explore`}
        ogImage="/favicon.ico"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": "Explore Categories",
          "itemListElement": [
            "Restaurants","Hotels","Events","Fun Places","Shopping","Airbnb","Attractions","Lifestyle","Others"
          ].map((name: string, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": name
          }))
        }}
      />
      <main className="pb-12">
        <HeroSlider />
        <CategoryGrid />
      </main>
    </div>
  );
};

export default CategoriesPage;