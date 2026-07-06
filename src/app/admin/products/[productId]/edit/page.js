import { notFound } from "next/navigation";
import { getAdminProductById, getAdminCategories } from "@/lib/admin-queries";
import EditProductForm from "./edit-product-form";

export default async function EditProductPage({ params }) {
  const { productId } = await params;

  const [product, categories] = await Promise.all([
    getAdminProductById(productId),
    getAdminCategories(),
  ]);

  if (!product) notFound();

  return <EditProductForm product={product} categories={categories} />;
}
