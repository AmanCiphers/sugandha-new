import ShopContent from "./shop-content";
import { getPublishedProducts, getCategories } from "@/lib/queries";

export default async function ShopPage({ searchParams }) {
  const { q } = await searchParams;
  const [products, categories] = await Promise.all([
    getPublishedProducts({ search: q }),
    getCategories(),
  ]);

  return <ShopContent initialProducts={products} categories={categories} searchQuery={q || ""} />;
}
