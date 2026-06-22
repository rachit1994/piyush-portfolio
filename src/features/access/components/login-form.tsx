"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { signInDemo } from "@/features/access/lib/demo-auth";

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
      className="access-form"
      onSubmit={handleSubmit}
    >
      <label className="access-label" htmlFor="access-code">
        Demo access code
      </label>
      <input
        className="access-input"
        defaultValue="portfolio-demo"
        id="access-code"
        readOnly
      />
      <button className="dark-button" type="submit">
        Continue to private route
      </button>
    </form>
  );
}
