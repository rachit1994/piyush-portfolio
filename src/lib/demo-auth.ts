export const DEMO_AUTH_STORAGE_KEY = "piyush-portfolio-demo-auth";

const AUTHENTICATED_VALUE = "authenticated";

type StorageReader = Pick<Storage, "getItem">;
type StorageWriter = Pick<Storage, "setItem" | "removeItem">;

export function isDemoAuthenticated(
  storage: StorageReader = window.localStorage,
): boolean {
  return storage.getItem(DEMO_AUTH_STORAGE_KEY) === AUTHENTICATED_VALUE;
}

export function signInDemo(
  storage: Pick<StorageWriter, "setItem"> = window.localStorage,
): void {
  storage.setItem(DEMO_AUTH_STORAGE_KEY, AUTHENTICATED_VALUE);
}

export function signOutDemo(
  storage: Pick<StorageWriter, "removeItem"> = window.localStorage,
): void {
  storage.removeItem(DEMO_AUTH_STORAGE_KEY);
}
