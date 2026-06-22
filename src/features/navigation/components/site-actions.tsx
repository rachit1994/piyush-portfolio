import { ThemeToggle } from "@/features/theme";

export function SiteActions() {
  return (
    <div className="site-actions">
      <p className="availability">
        <span aria-hidden="true" className="availability-dot" />
        Available for select projects
      </p>
      <ThemeToggle />
    </div>
  );
}
