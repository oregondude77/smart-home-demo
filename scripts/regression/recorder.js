// Injected into the page: records class/src/aria token changes over .demo every frame,
// plus a marker on each click so compare.mjs can time events from the last click.
(() => {
  const FRAME_RE = /\/(car-motion|garage-door|door-lock-bolt)-\d+\.svg/;
  const sig = () => {
    const m = new Map();
    const root = document.querySelector(".demo");
    if (!root) return m;
    for (const el of root.querySelectorAll("*")) {
      const cls = typeof el.className === "string" ? el.className : el.getAttribute("class") || "";
      let src = el.getAttribute("src") || "";
      if (FRAME_RE.test(src)) src = src.replace(/-\d+\.svg/, "-N.svg");
      const aria = [el.getAttribute("aria-label"), el.getAttribute("aria-pressed"), el.getAttribute("aria-selected"), el.getAttribute("aria-current")].filter((x) => x != null).join("/");
      if (!cls && !src && !aria) continue;
      const k = `${el.tagName.toLowerCase()}.${cls.trim().replace(/\s+/g, ".")}${src ? ` src=${src}` : ""}${aria ? ` aria=${aria}` : ""}`;
      m.set(k, (m.get(k) || 0) + 1);
    }
    return m;
  };
  window.__rec = { t0: performance.now(), log: [], prev: sig() };
  window.__recMark = () => { window.__rec.t0 = performance.now(); window.__rec.log = []; };
  const tick = () => {
    const r = window.__rec, cur = sig(), t = Math.round(performance.now() - r.t0);
    for (const [k, v] of cur) if ((r.prev.get(k) || 0) !== v) r.log.push([t, k, v]);
    for (const [k] of r.prev) if (!cur.has(k)) r.log.push([t, k, 0]);
    r.prev = cur;
    requestAnimationFrame(tick);
  };
  document.addEventListener("click", () => { const r = window.__rec; r.log.push([Math.round(performance.now() - r.t0), "__click", r.log.length]); }, true);
  requestAnimationFrame(tick);
})();
