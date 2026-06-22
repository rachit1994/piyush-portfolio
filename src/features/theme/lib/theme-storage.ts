export type Theme = "light" | "dark";

const THEME_KEY = "piyush-theme";

type Reader = Pick<Storage, "getItem">;
type Writer = Pick<Storage, "setItem">;

export function readTheme(
  storage: Reader | undefined = window.localStorage,
): Theme {
  return storage?.getItem(THEME_KEY) === "light" ? "light" : "dark";
}

export function writeTheme(
  theme: Theme,
  storage: Writer | undefined = window.localStorage,
) {
  storage?.setItem(THEME_KEY, theme);
}
