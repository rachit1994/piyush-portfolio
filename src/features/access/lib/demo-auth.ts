export const DEMO_AUTH_STORAGE_KEY = "piyush-portfolio-demo-auth";
const AUTHENTICATED_VALUE = "authenticated";

type Reader = Pick<Storage, "getItem">;
type Writer = Pick<Storage, "setItem" | "removeItem">;

export function isDemoAuthenticated(storage: Reader = window.localStorage) {
  return storage.getItem(DEMO_AUTH_STORAGE_KEY) === AUTHENTICATED_VALUE;
}

export function signInDemo(
  storage: Pick<Writer, "setItem"> = window.localStorage,
) {
  storage.setItem(DEMO_AUTH_STORAGE_KEY, AUTHENTICATED_VALUE);
}

export function signOutDemo(
  storage: Pick<Writer, "removeItem"> = window.localStorage,
) {
  storage.removeItem(DEMO_AUTH_STORAGE_KEY);
}
