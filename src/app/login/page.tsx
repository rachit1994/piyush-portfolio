import type { Metadata } from "next";

import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Demo access",
};

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-lg">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
          Demo private route
        </h1>
        <p className="mt-3 mb-8 leading-7 text-slate-600">
          This login stores a browser-only flag. It demonstrates guarded
          navigation, but it does not secure data on a static website.
        </p>
        <LoginForm />
      </div>
    </section>
  );
}
