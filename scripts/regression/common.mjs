import { chromium } from "playwright-core";
// Headless Google Chrome plays the H.264 camera MP4s; override with CHROME_PATH.
export const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
export async function launch(opts = {}) {
  return chromium.launch({ executablePath: CHROME, headless: true, args: ["--autoplay-policy=no-user-gesture-required"], ...opts });
}
export async function openPage(browser, port, ctxOpts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...ctxOpts });
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`[${m.type()}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });
  await page.goto(`http://localhost:${port}/`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { ctx, page, errors, failed };
}
