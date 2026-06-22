import Link from "next/link";

export function AboutPage() {
  return (
    <div className="editorial-page">
      <header className="page-intro">
        <p>Independent product and design practice</p>
        <h1>
          Clear systems.
          <br />
          Memorable <em>experiences.</em>
        </h1>
      </header>
      <section className="about-grid">
        <h2>How the work moves</h2>
        <div>
          <p>
            Strategy, product structure, interface craft, and engineering are
            treated as one connected system—not separate hand-offs.
          </p>
          <p>
            Every engagement starts by reducing ambiguity, defining the
            highest-leverage decisions, and building only what earns its place.
          </p>
        </div>
      </section>
      <section className="principles">
        <p>→ Direction before decoration.</p>
        <p>→ Independent components and explicit boundaries.</p>
        <p>→ Evidence before confidence.</p>
      </section>
      <Link className="dark-button" href="/login">
        Start a conversation
      </Link>
    </div>
  );
}
