"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { readTheme, writeTheme } from "@/features/theme/lib/theme-storage";
import { themeState } from "@/features/theme/state/theme-state";

export function ThemeSync() {
  const [theme, setTheme] = useRecoilState(themeState);

  useEffect(() => {
    setTheme(readTheme());
  }, [setTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeTheme(theme);
  }, [theme]);

  return null;
}
