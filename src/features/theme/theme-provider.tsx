"use client";

import type { ReactNode } from "react";
import { RecoilRoot } from "recoil";

import { ThemeSync } from "@/features/theme/components/theme-sync";

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <RecoilRoot>
      <ThemeSync />
      {children}
    </RecoilRoot>
  );
}
