import OrderList from "./order-list";
import { getAdminOrders } from "@/lib/admin-queries";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
  return <OrderList orders={orders} />;
}
