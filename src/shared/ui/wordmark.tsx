import Link from "next/link";

export function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="Piyush Sitholey home">
      <span className="wordmark-title">Piyush Sitholey</span>
      <span className="wordmark-handle">@eyelixir</span>
    </Link>
  );
}
