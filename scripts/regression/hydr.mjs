import { launch } from "./common.mjs";
// Usage: node hydr.mjs [port=3002] against `next start`; checks hydration in other time zones.
const port = +process.argv[2] || 3002;
const b = await launch();
for (const timezoneId of ["Pacific/Kiritimati", "America/Los_Angeles", "Asia/Kolkata"]) {
  const ctx = await b.newContext({ timezoneId, locale: "en-US" });
  const page = await ctx.newPage(); const errs = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text().slice(0, 200)); });
  page.on("pageerror", (e) => errs.push(e.message.slice(0, 200)));
  await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" }); await page.waitForTimeout(2000);
  const date = await page.$eval('section[aria-label="Weather"]', (s) => s.innerText.replace(/\s+/g, " ").slice(0, 60)).catch(() => "?");
  console.log(timezoneId.padEnd(22), errs.length ? `ERRORS ${JSON.stringify(errs)}` : "no hydration/console errors", "|", date);
  await ctx.close();
}
await b.close();
