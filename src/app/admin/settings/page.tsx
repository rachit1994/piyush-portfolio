import { AdminRoute } from "@/features/auth";
import { SettingsPanel } from "@/features/settings";

export const metadata = { title: "Settings" };

export default function AdminSettingsPage() {
  return (
    <AdminRoute>
      <SettingsPanel />
    </AdminRoute>
  );
}
