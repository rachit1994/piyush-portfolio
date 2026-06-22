import { AdminRoute } from "@/features/auth";
import { ProjectsPanel } from "@/features/projects";

export const metadata = { title: "Projects" };

export default function AdminProjectsPage() {
  return (
    <AdminRoute>
      <ProjectsPanel />
    </AdminRoute>
  );
}
