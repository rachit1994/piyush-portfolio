import Link from "next/link";

export function ClosingSection() {
  return (
    <section className="closing-section">
      <p>Let&apos;s build the shortcut together.</p>
      <Link className="dark-button" href="/login">
        Let&apos;s begin
      </Link>
      <a className="nav-pill" href="mailto:hello@example.com">
        Email Piyush
      </a>
    </section>
  );
}
