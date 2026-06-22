const script = `
try {
  const saved = localStorage.getItem("piyush-theme");
  document.documentElement.dataset.theme = saved === "dark" ? "dark" : "light";
} catch {
  document.documentElement.dataset.theme = "light";
}`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
