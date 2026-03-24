import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProductList } from "@/components/ProductList";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <ProductList />
    </div>
  );
}
