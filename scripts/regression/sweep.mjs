import { launch, openPage } from "./common.mjs";
// Usage: node sweep.mjs [port=3000]. Plays every camera from the carousel and grid in both
// experiences and modes, runs scenes, access control, scenarios, and the tour.
const port = +process.argv[2] || 3000;
const b = await launch();
const { page, errors, failed } = await openPage(b, port);
const results = [];
async function playCheck(label, how) {
  await page.waitForSelector(".doorbell-view video", { timeout: 8000 });
  const r = await page.waitForFunction(() => {
    const v = document.querySelector(".doorbell-view video");
    return v && !v.error && v.currentTime > 0.4 && !v.paused ? { src: v.currentSrc.replace(location.origin, ""), t: v.currentTime } : null;
  }, null, { timeout: 15000 }).then((h) => h.jsonValue()).catch(async () => ({ fail: await page.evaluate(() => { const v = document.querySelector(".doorbell-view video"); return v ? `err=${v.error?.code} rs=${v.readyState} t=${v.currentTime} paused=${v.paused} src=${v.currentSrc}` : "no video"; }) }));
  results.push({ label, how, ...r });
  await page.click('button[aria-label="Close camera view"]');
  await page.waitForSelector(".doorbell-view", { state: "detached", timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(300);
}
async function sweepExperience(exp) {
  for (const mode of ["day", "night"]) {
    const labels = await page.$$eval('.video-carousel button[aria-label^="Expand "]', (bs) => bs.map((x) => x.getAttribute("aria-label").slice(7)));
    for (const l of labels) { await page.click(`button[aria-label="Expand ${l}"]`); await playCheck(`${exp}/${mode}/${l}`, "carousel"); }
    await page.click('button[aria-label="Video"]'); await page.waitForTimeout(600);
    const grid = await page.$$eval('button[aria-label^="Play "][aria-label$=" full screen"]', (bs) => bs.map((x) => x.getAttribute("aria-label").slice(5, -12)));
    for (const l of grid) { await page.click(`button[aria-label="Play ${l} full screen"]`); await playCheck(`${exp}/${mode}/${l}`, "grid"); }
    const broken = await page.$$eval(".demo img", (is) => is.filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("loading") !== "lazy").map((i) => i.getAttribute("src")));
    if (broken.length) results.push({ label: `${exp}/${mode}`, how: "broken-img", fail: broken.join(",") });
    await page.click('button[aria-label="Home"]'); await page.waitForTimeout(600);
    if (mode === "day") { await page.locator('button:has-text("DAY MODE")').first().click(); await page.waitForTimeout(1200); }
  }
  await page.locator('button:has-text("NIGHT MODE")').first().click(); await page.waitForTimeout(1200);
}
await sweepExperience("home");
for (const s of ["Home", "Away", "Sleep", "Wake Up"]) { await page.click(`button[aria-label="Run ${s} scene"]`); await page.waitForTimeout(9000); }
await page.click('button[aria-label="Switch to business demo"]'); await page.waitForTimeout(1500);
await sweepExperience("business");
for (const s of ["Close", "Open"]) { await page.click(`button[aria-label="Run ${s} scene"]`); await page.waitForTimeout(11000); }
await page.click('button[aria-label="Grant access at Main Entrance"]'); await page.waitForTimeout(1500);
await page.click('button[aria-label="Grant access at Side Entrance"]'); await page.waitForTimeout(7000);
await page.click('button[aria-label="Switch to residential demo"]'); await page.waitForTimeout(1500);
for (const s of ["Garage Left Open", "Kids Arriving Home", "Package Delivered"]) {
  await page.click('button[aria-label="Open scenario menu"]'); await page.waitForTimeout(400);
  await page.locator(`#scenario-menu button:has-text("${s}")`).click();
  await page.locator(".ios-alert360-notification-stack").waitFor({ timeout: 30000 }); await page.waitForTimeout(800);
  await page.click(".ios-alert360-notification-stack"); await page.waitForTimeout(16000);
  if (await page.locator(".doorbell-view").count()) await page.click('button[aria-label="Close camera view"]');
  await page.waitForTimeout(800);
}
await page.locator('button:has-text("Start Tour")').first().click().catch(() => results.push({ label: "tour", fail: "no Start Tour button" }));
await page.locator('button:has-text("Start Tour")').first().waitFor({ state: "visible", timeout: 150000 }).catch(() => results.push({ label: "tour", fail: "did not finish" }));
for (const r of results) console.log(r.fail ? "FAIL" : "ok  ", r.label.padEnd(36), (r.how || "").padEnd(9), r.fail || `${r.src} t=${r.t.toFixed(2)}`);
const played = results.filter((r) => r.src).length;
console.log(`played ${played}/${results.filter((r) => r.how === "carousel" || r.how === "grid").length}; failures ${results.filter((r) => r.fail).length}`);
console.log("console errors:", JSON.stringify(errors.filter((e) => !/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(e)), null, 1));
console.log("failed requests (excluding aborted MP4 streams):", JSON.stringify(failed.filter((f) => !/\.mp4 net::ERR_ABORTED/.test(f)), null, 1));
await b.close();
