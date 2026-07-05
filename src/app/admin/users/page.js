import UserList from "./user-list";
import { getAdminUsers } from "@/lib/admin-queries";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <UserList users={users} />;
}
