import InventoryList from "./inventory-list";
import { getAdminInventory } from "@/lib/admin-queries";

export default async function AdminInventoryPage() {
  const items = await getAdminInventory();
  return <InventoryList items={items} />;
}
