import { spawn } from "node:child_process";

import puppeteer from "puppeteer";

const PORT = 4180;
const ORIGIN = `http://localhost:${PORT}`;

// Budgets guard the homepage against the YouTube-iframe-wall regression that
// pushed browser memory to ~1.8 GB. `iframes`/`frames`/`documents` are the
// decisive signals: every embedded player adds a frame + document + heap.
const BUDGET = {
  iframes: 0,
  frames: 10,
  documents: 10,
  jsHeapMb: 60,
  domNodes: 3000,
};

async function waitForServer() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      if ((await fetch(ORIGIN)).ok) return;
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("static server did not start");
}

async function measure() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  try {
    const page = await browser.newPage();
    await page.goto(ORIGIN, { waitUntil: "networkidle2", timeout: 60000 });
    const iframes = await page.$$eval("iframe", (nodes) => nodes.length);
    const m = await page.metrics();
    return {
      iframes,
      frames: m.Frames,
      documents: m.Documents,
      jsHeapMb: Number((m.JSHeapUsedSize / 1024 / 1024).toFixed(1)),
      domNodes: m.Nodes,
    };
  } finally {
    await browser.close();
  }
}

const server = spawn(
  "npx",
  ["serve", "out", "-l", String(PORT), "--no-clipboard", "--no-port-switching"],
  { stdio: "ignore" },
);

try {
  await waitForServer();
  const measured = await measure();
  console.table(
    Object.keys(BUDGET).map((metric) => ({
      metric,
      value: measured[metric],
      budget: BUDGET[metric],
    })),
  );
  const failures = Object.keys(BUDGET).filter((k) => measured[k] > BUDGET[k]);
  if (failures.length > 0) {
    throw new Error(`Memory budget exceeded: ${failures.join(", ")}`);
  }
  console.log("Memory budget OK");
} finally {
  server.kill();
}
