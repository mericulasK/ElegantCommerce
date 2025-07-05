import HeroSection from "@/components/home/hero-section";
import FeaturedCategories from "@/components/home/featured-categories";
import ProductShowcase from "@/components/home/product-showcase";
import PromoBanner from "@/components/home/promo-banner";
import Newsletter from "@/components/home/newsletter";

export default function Home() {
  return (
    <div className="space-y-0">
      <HeroSection />
      <FeaturedCategories />
      <ProductShowcase />
      <PromoBanner />
      <Newsletter />
    </div>
  );
}
