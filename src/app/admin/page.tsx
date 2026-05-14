import { redirect } from "next/navigation";
import { verifyAdmin } from "@/lib/auth";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductList } from "@/components/ProductList";

export default async function AdminPage() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <ProductList />
    </div>
  );
}
