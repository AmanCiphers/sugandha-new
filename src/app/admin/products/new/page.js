import ProductForm from "./product-form";
import { getAdminCategories } from "@/lib/admin-queries";

export default async function NewProductPage() {
  const categories = await getAdminCategories();
  return <ProductForm categories={categories} />;
}
