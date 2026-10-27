const w = (p, ms) => p.waitForTimeout(ms);
const click = (p, sel) => p.locator(sel).first().click();
const aria = (l) => `button[aria-label="${l}"]`;
const txt = (t) => `button:has-text("${t}")`;
async function scenario(p, label) {
  await click(p, aria("Open scenario menu")); await w(p, 400);
  await click(p, `#scenario-menu button:has-text("${label}")`);
}
export const flows = {
  async residential(p) {
    await click(p, aria("Lock Front Door")); await w(p, 3000);
    await click(p, aria("Lock Side Door")); await w(p, 3000);
    await click(p, aria("Unlock Front Door")); await w(p, 3000);
    await click(p, txt("SECURITY SYSTEM")); await w(p, 3000);
    await click(p, txt("GARAGE DOORS")); await w(p, 3000);
    await click(p, txt("GARAGE DOORS")); await w(p, 3000);
    await click(p, txt("Master Bedroom")); await w(p, 600);
    await click(p, txt("Porch Light")); await w(p, 600);
    await click(p, aria("Increase thermostat temperature")); await w(p, 600);
    await click(p, txt("DAY MODE")); await w(p, 2500);
    await click(p, txt("NIGHT MODE")); await w(p, 2500);
    for (const s of ["Away", "Wake Up", "Sleep", "Home"]) { await click(p, aria(`Run ${s} scene`)); await w(p, 11000); }
    await click(p, aria("Open Outdoor Camera")); await w(p, 2500);
    await click(p, aria("Close camera view")); await w(p, 1500);
    await click(p, aria("Video")); await w(p, 1200);
    await click(p, aria("Home")); await w(p, 1500);
  },
  async business(p) {
    await click(p, aria("Switch to business demo")); await w(p, 2500);
    await click(p, aria("Run Close scene")); await w(p, 14000);
    await click(p, aria("Run Open scene")); await w(p, 14000);
    await click(p, txt("Storefront Lights")); await w(p, 2000);
    await click(p, txt("Cafe Lights")); await w(p, 2000);
    await click(p, txt("SECURITY SYSTEM")); await w(p, 3000);
    await click(p, txt("DAY MODE")); await w(p, 2500);
    await click(p, aria("Open Loading Dock")); await w(p, 2500);
    await click(p, aria("Close camera view")); await w(p, 1500);
    await click(p, aria("Switch to residential demo")); await w(p, 2500);
  },
  async access(p) {
    await click(p, aria("Switch to business demo")); await w(p, 2000);
    await click(p, aria("Grant access at Main Entrance")); await w(p, 2500);
    await click(p, aria("Grant access at Side Entrance")); await w(p, 8000);
    await click(p, `button[aria-label$="Main Entrance"]`); await w(p, 300);
    await click(p, `button[aria-label$="Main Entrance"]`); await w(p, 8000);
  },
  async tour(p) {
    await click(p, txt("Start Tour"));
    await p.locator(txt("Start Tour")).first().waitFor({ state: "visible", timeout: 150000 }).catch(() => {});
    await w(p, 3000);
  },
  async garage(p) {
    await scenario(p, "Garage Left Open");
    await p.locator(".ios-alert360-notification-stack").waitFor({ timeout: 30000 }); await w(p, 1500);
    await click(p, ".ios-alert360-notification-stack"); await w(p, 2500);
    await click(p, txt("GARAGE DOORS")); await w(p, 8000);
  },
  async kids(p) {
    await scenario(p, "Kids Arriving Home");
    await p.locator(".ios-alert360-notification-stack").waitFor({ timeout: 30000 }); await w(p, 1500);
    await click(p, ".ios-alert360-notification-stack"); await w(p, 18000);
  },
  async package(p) {
    await scenario(p, "Package Delivered");
    await p.locator(".ios-alert360-notification-stack").waitFor({ timeout: 30000 }); await w(p, 1500);
    await click(p, ".ios-alert360-notification-stack"); await w(p, 18000);
  },
};
