"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

import { signInDemo } from "@/lib/demo-auth";

export function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    signInDemo();
    router.push("/private");
  }

  return (
    <form
      aria-label="Demo access"
      className="space-y-5"
      onSubmit={handleSubmit}
    >
      <div>
        <label
          className="mb-2 block text-sm font-medium text-slate-800"
          htmlFor="access-code"
        >
          Demo access code
        </label>
        <input
          autoComplete="off"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 transition outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          defaultValue="portfolio-demo"
          id="access-code"
          name="access-code"
          readOnly
          type="text"
        />
      </div>
      <button
        className="w-full rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        type="submit"
      >
        Continue to private route
      </button>
    </form>
  );
}
