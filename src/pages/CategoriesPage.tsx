import CategoryGrid from "@/components/CategoryGrid";
import HeroSlider from "@/components/HeroSlider";

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <main className="pb-12">
        <HeroSlider />
        <CategoryGrid />
      </main>
    </div>
  );
};

export default CategoriesPage;