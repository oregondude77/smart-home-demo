# Alert 360 smart-home / business-security demo

Next.js 16.4 (Turbopack) + React 19, one static prerendered page. Commands: `npm run dev|build|start|lint`; lint gate is `npx eslint --max-warnings 0`. No test script. Build fetches Geist fonts (needs network).

## Rules
- Do not redesign. Inspect first, make the smallest clean change, no unrelated edits.
- Preserve: phone UI and scaling, house/business SVG layering and night-filter order, animation timing, camera markers/previews/full-screen playback, light layers, independent front/side door states, lock and access-control animations, garage frames, armed/disarmed behavior, scenes, day/night.
- Always commit and push completed work. Run `git status -sb` first and keep newer user changes.
- Keep `@next/next/no-img-element` off in eslint.config.mjs (stacked SVG layers and tuned camera JPEGs).
- Do not restore the deleted illustrated camera previews unless asked.

## Reading the code cheaply
- Big files: PhonePanel.jsx (~2.2k lines), HouseScene.jsx (~1.5k), demo.css (~3.5k), house-scene.css (~2.8k). Grep for the symbol, then Read a line range. Avoid whole-file reads.
- `.ignore` hides public/ and package-lock.json from search. Use `ls public/`; use `rg --no-ignore` only when needed. Never print matching lines from public/*.svg (base64 lines up to 51k chars); use `grep -l`.
- Asset paths are also built from template strings (`/car-motion-${n}.svg`, `/garage-door-${i}.svg`, `/door-lock-bolt-${n}.svg`, `/smb-base-access-${reader}-${state}.svg`). Check those before calling an asset unused.

## Files
- src/components/SmartHomeDemo.jsx: shared state, scenarios, A-360 tour (`A360_TOUR_STEPS` lines up index for index with `a360TourStepRuns`), experience toggle.
- src/components/PhonePanel.jsx: phone UI, `cameraFeeds`, carousel, `CameraGridScreen`, `BusinessVideoFeed` (used by both experiences), full-screen `.doorbell-view`, footer tabs, scenes, scenario menu.
- src/components/HouseScene.jsx: scene visuals and animations; `useDimmingLight` for business light fades.

## Conventions from past refactors
- Card components stay at module scope with props. Never define components inside PhonePanel.
- No `Date.now()` during render; action keys come from ref counters.
- Reset state when props change during render (a "previous value" useState), not with setState in effects. Timers and rAF stay in effects.
- Effects that skip the first run compare against a previous-value ref, not a "mounted" flag, because dev StrictMode re-runs them.
- Weather date uses useSyncExternalStore with server snapshot "" (avoids hydration error #418).

## Experiences
- Residential ("home") feeds: doorbell, outdoor, floodlight. Business feeds: outdoor (Building Side), floodlight (Building Entrance), loading-dock. Scenario doorbell feeds stay separate.
- Business: reader lights green when granted/unlocked, red when locked. Open scene sets day and unlocks; Close sets night and locks. The A-360 tour is hidden.
- CTAs: residential https://www.alert360.com/home-security-package-specials, business https://alert360.com/business-security-pricing/

## Validating state or animation changes
Use scripts/regression (run `npm install` there once; it uses headless Google Chrome, which you can override with CHROME_PATH):
- `npm run up [-- <ref>]` starts a baseline worktree of HEAD (or <ref>) on :3001 and the workspace on :3000. If the change is already committed, pass HEAD~1.
- `npm run compare -- <flow>` (or `compare:all`) diffs class/src/aria transitions between the two. Expect `SAME SEQUENCE: true` with timing within about 65 ms. Flows: residential, business, access, garage, kids, package, tour.
- `npm run prod`, then `npm run hydr` (hydration in 3 time zones) and `npm run sweep -- 3002` (all 12 cameras via carousel and grid, scenes, scenarios, tour). Expect 24/24 played, no errors. MP4 `ERR_ABORTED` is normal when a video closes.
- `npm run down` stops the servers and removes the worktree. Logs go to /tmp/shd-logs. macOS has no `timeout` command.
