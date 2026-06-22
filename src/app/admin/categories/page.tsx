import { AdminRoute } from "@/features/auth";
import { CategoriesPanel } from "@/features/categories";

export const metadata = { title: "Categories" };

export default function CategoriesAdminPage() {
  return (
    <AdminRoute>
      <CategoriesPanel />
    </AdminRoute>
  );
}
