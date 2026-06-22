import { GoogleSignIn } from "./components/google-sign-in";

/**
 * Public login route. Any Google account can authenticate; only the
 * allow-listed admin gains write access (enforced by RLS + the upload
 * function). Session sync is mounted once in the admin layout.
 */
export function AdminLoginPage() {
  return (
    <section className="admin-auth">
      <h1 className="admin-auth__title">Studio admin</h1>
      <p className="admin-auth__hint">Sign in to manage the portfolio.</p>
      <GoogleSignIn />
    </section>
  );
}
