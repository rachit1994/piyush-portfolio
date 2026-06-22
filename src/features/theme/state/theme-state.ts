import { atom } from "recoil";

import type { Theme } from "@/features/theme/lib/theme-storage";

export const themeState = atom<Theme>({
  key: "portfolio/theme",
  default: "dark",
});
