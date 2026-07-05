import ShopContent from "./shop-content";
import { getPublishedProducts, getCategories } from "@/lib/queries";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getCategories(),
  ]);

  return <ShopContent initialProducts={products} categories={categories} />;
}
