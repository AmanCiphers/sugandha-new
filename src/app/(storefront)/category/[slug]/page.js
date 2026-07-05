import { notFound } from "next/navigation";
import CategoryContent from "./category-content";
import { getCategoryBySlug, getPublishedProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getPublishedProducts({ categorySlug: slug });

  return <CategoryContent products={products} category={category} />;
}
