/* Screenshot harness for visual QA. Not part of the app. */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "/tmp/shots";
fs.mkdirSync(OUT, { recursive: true });

const routes = [
  ["concepts", "/concepts"],
  ["c01", "/concepts/01"],
  ["c02", "/concepts/02"],
  ["c03", "/concepts/03"],
  ["c04", "/concepts/04"],
  ["c05", "/concepts/05"],
  ["compare", "/compare"],
];

const viewports = [
  ["m390", { width: 390, height: 844 }],
  ["m430", { width: 430, height: 932 }],
  ["t768", { width: 768, height: 1024 }],
  ["d1440", { width: 1440, height: 900 }],
];

const browser = await chromium.launch();
for (const [vpName, vp] of viewports) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: vp.width < 500,
    hasTouch: vp.width < 800,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[${vpName}] ${m.text()}`);
  });
  for (const [name, route] of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${OUT}/${name}-${vpName}-top.png` });
    // overflow check
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    if (overflow > 1) console.log(`OVERFLOW ${name} ${vpName}: ${overflow}px`);
    // mid + bottom scroll shots for scrollable pages
    if (name !== "c04") {
      const h = await page.evaluate(() => document.body.scrollHeight);
      await page.mouse.wheel(0, h * 0.45);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${OUT}/${name}-${vpName}-mid.png` });
      await page.mouse.wheel(0, h);
      await page.waitForTimeout(1400);
      await page.screenshot({ path: `${OUT}/${name}-${vpName}-end.png` });
    }
  }
  if (errors.length) console.log(errors.join("\n"));
  await ctx.close();
}
await browser.close();
console.log("done");
