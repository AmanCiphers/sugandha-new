import ProductList from "./product-list";
import { getAdminProducts } from "@/lib/admin-queries";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();
  return <ProductList products={products} />;
}
