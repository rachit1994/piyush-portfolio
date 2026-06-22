"use client";

import { useRecoilState } from "recoil";

import { themeState } from "@/features/theme/state/theme-state";

export function ThemeToggle() {
  const [theme, setTheme] = useRecoilState(themeState);
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      aria-label={`Use ${nextTheme} theme`}
      className="theme-toggle"
      onClick={() => setTheme(nextTheme)}
      type="button"
    >
      <span aria-hidden="true">{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
