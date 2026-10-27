import { readFileSync } from "node:fs";
import { launch, openPage } from "./common.mjs";
import { flows } from "./flows.mjs";
// Usage: node compare.mjs <flow> [newPort=3000] [baselinePort=3001]
const name = process.argv[2];
if (!flows[name]) { console.error(`flows: ${Object.keys(flows).join(", ")}`); process.exit(1); }
const ports = [+process.argv[3] || 3000, +process.argv[4] || 3001];
const recorder = readFileSync(new URL("./recorder.js", import.meta.url), "utf8");
async function run(port) {
  const b = await launch();
  const { page, errors, failed } = await openPage(b, port);
  await page.evaluate(recorder);
  await page.evaluate(() => window.__recMark());
  await flows[name](page);
  const log = await page.evaluate(() => window.__rec.log);
  await b.close();
  return { log, errors, failed };
}
const [a, b] = await Promise.all(ports.map(run));
const byKey = (log) => { const m = new Map(); let last = 0; for (let [t, k, v] of log) { if (k === "__click") { last = t; continue; } t = t - last; if (!m.has(k)) m.set(k, []); m.get(k).push([t, v]); } return m; };
const A = byKey(a.log), B = byKey(b.log);
let same = true, maxDelta = 0, worst = "";
const diffs = [];
for (const k of new Set([...A.keys(), ...B.keys()])) {
  const x = A.get(k) || [], y = B.get(k) || [];
  const sx = x.map((e) => e[1]).join(","), sy = y.map((e) => e[1]).join(",");
  if (sx !== sy) { same = false; diffs.push(`  ${k}\n    ${ports[0]}: ${x.map((e) => e.join("@")).join(" ")}\n    ${ports[1]}: ${y.map((e) => e.join("@")).join(" ")}`); continue; }
  x.forEach((e, i) => { const d = Math.abs(e[0] - y[i][0]); if (d > maxDelta) { maxDelta = d; worst = `${k} #${i} (${e[0]} vs ${y[i][0]})`; } });
}
console.log(`flow=${name} events ${ports[0]}=${a.log.length} ${ports[1]}=${b.log.length} tokens=${A.size}/${B.size}`);
console.log(`SAME SEQUENCE: ${same}`);
console.log(`max timing delta: ${maxDelta} ms  ${worst}`);
if (diffs.length) console.log(`differences (${diffs.length}):\n${diffs.slice(0, 15).join("\n")}`);
for (const [i, r] of [a, b].entries()) {
  const errs = r.errors.filter((e) => !/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(e));
  if (errs.length || r.failed.length) console.log(`:${ports[i]} errors=${JSON.stringify(errs)} failed=${JSON.stringify(r.failed)}`);
}
