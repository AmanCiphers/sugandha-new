import CategoryList from "./category-list";
import { getAdminCategories } from "@/lib/admin-queries";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <CategoryList categories={categories} />;
}
