import { LoginForm } from "./components/login-form";

export function AccessPage() {
  return (
    <section className="editorial-page access-page">
      <header className="page-intro">
        <p>New project inquiry</p>
        <h1>
          Let&apos;s make the
          <br />
          important <em>obvious.</em>
        </h1>
      </header>
      <div className="access-panel">
        <p>
          This static demo stores a browser-only access flag. It is not a
          security boundary and contains no private information.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
