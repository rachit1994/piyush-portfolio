import Link from "next/link";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/private", label: "Private" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link
          className="text-lg font-semibold tracking-tight text-slate-950"
          href="/"
        >
          Piyush
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-5 text-sm font-medium text-slate-600">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  className="transition-colors hover:text-blue-700 focus-visible:text-blue-700"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
