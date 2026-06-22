import { LogoutButton } from "./components/logout-button";
import { PrivateRoute } from "./components/private-route";

export function PrivatePage() {
  return (
    <PrivateRoute>
      <section className="editorial-page">
        <header className="page-intro">
          <p>Client-space demonstration</p>
          <h1>
            A calm place for
            <br />
            work in <em>progress.</em>
          </h1>
        </header>
        <div className="access-panel">
          <p>
            Static hosting cannot protect sensitive data. Real client work
            requires authenticated infrastructure and server-side authorization.
          </p>
          <LogoutButton />
        </div>
      </section>
    </PrivateRoute>
  );
}
