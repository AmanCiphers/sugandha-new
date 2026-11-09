import { HeroSection } from "@/components/home/hero-section";
import { BestSellers } from "@/components/home/best-sellers";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { TrendingProducts } from "@/components/home/trending-products";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { ScentFinderCTA } from "@/components/home/scent-finder-cta";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getPublishedProducts, getCategories, getTestimonials } from "@/lib/queries";

export default async function HomePage() {
  const [allProducts, categories, testimonials] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
    getTestimonials(),
  ]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <BestSellers products={allProducts} />
        <CategoriesSection categories={categories} />
        <FeaturedProducts products={allProducts} />
        <TrendingProducts products={allProducts} />
        <ScentFinderCTA />
        <WhyChooseUs />
        <TestimonialsSection testimonials={testimonials} />
      </main>
      <Footer />
    </>
  );
}
