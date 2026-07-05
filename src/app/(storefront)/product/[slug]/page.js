import { notFound } from "next/navigation";
import ProductContent from "./product-content";
import { getProductBySlug, getPublishedProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getPublishedProducts({
    categorySlug: product.category?.slug,
    excludeSlug: slug,
    limit: 3,
  });

  return <ProductContent product={product} relatedProducts={relatedProducts} />;
}
