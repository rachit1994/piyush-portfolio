import Link from "next/link";

import { AdminRoute } from "./components/admin-route";

const SECTIONS = [
  {
    href: "/admin/categories",
    title: "Categories",
    note: "Create and reorder your work.",
  },
  {
    href: "/admin/media",
    title: "Media",
    note: "Upload and organize photos and video.",
  },
  {
    href: "/admin/projects",
    title: "Projects",
    note: "Group shoots into case studies.",
  },
  {
    href: "/admin/settings",
    title: "Settings",
    note: "Contacts, links, and SEO.",
  },
];

export function AdminDashboardPage() {
  return (
    <AdminRoute>
      <section className="admin-dash">
        <h1>Dashboard</h1>
        <p className="admin-dash__lead">
          Manage your portfolio without a developer.
        </p>
        <div className="admin-dash__grid">
          {SECTIONS.map((section) => (
            <Link className="admin-card" href={section.href} key={section.href}>
              <h2>{section.title}</h2>
              <p>{section.note}</p>
            </Link>
          ))}
        </div>
      </section>
    </AdminRoute>
  );
}
