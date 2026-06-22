import { Wordmark } from "@/shared/ui";
import { DesktopNav } from "@/features/navigation/components/desktop-nav";
import { MobileNav } from "@/features/navigation/components/mobile-nav";
import { SiteActions } from "@/features/navigation/components/site-actions";

export function SiteHeader() {
  return (
    <header className="site-header">
      <DesktopNav />
      <MobileNav />
      <Wordmark />
      <SiteActions />
    </header>
  );
}
