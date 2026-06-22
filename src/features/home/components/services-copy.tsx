import Link from "next/link";

export function ServicesCopy() {
  return (
    <div className="services-copy">
      <h2>
        Product direction in <em>two weeks</em>
        <br />
        or continuously improved.
      </h2>
      <p>
        For teams who want high-quality product and brand thinking delivered
        fast. A system that makes your work understandable, useful, and
        memorable.
      </p>
      <Link className="dark-button" href="/about">
        Process + Approach
      </Link>
      <div className="founder-reasons">
        <strong>Why teams choose this practice</strong>
        <p>→ Senior-level, hands-on. One owner across the whole system.</p>
        <p>→ Product, engineering, and visual craft held to one standard.</p>
        <p>→ Fast decisions, explicit trade-offs, durable foundations.</p>
      </div>
    </div>
  );
}
