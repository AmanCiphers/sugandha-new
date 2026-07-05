import CouponList from "./coupon-list";
import { getAdminCoupons } from "@/lib/admin-queries";

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();
  return <CouponList coupons={coupons} />;
}
