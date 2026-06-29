/**
 * render.ts — Puppeteer render + measure
 * Renders HTML to a PNG at US-letter 96dpi (816 × 1056 px) and measures overflow.
 */
import puppeteer from "puppeteer";
import { writeFile } from "node:fs/promises";

export interface RenderResult {
  pngPath: string;
  overflowPx: number;
  fits: boolean;
}

const LETTER_W = 816;
const LETTER_H = 1056;

export async function renderMenu(html: string, outputPath: string): Promise<RenderResult> {
  console.log("[RENDER] Launching puppeteer...");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (e) {
    console.log("[RENDER] Browser launch failed, trying to install chrome...");
    const { execSync } = await import("child_process");
    execSync("npx puppeteer browsers install chrome", { stdio: "inherit" });
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  const page = await browser.newPage();

  // Set viewport to US letter at 96dpi
  await page.setViewport({ width: LETTER_W, height: LETTER_H, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  // Measure scroll height
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflowPx   = Math.max(0, scrollHeight - LETTER_H);
  const fits         = overflowPx === 0;

  console.log(`[RENDER] scrollHeight=${scrollHeight}px, overflow=${overflowPx}px, fits=${fits}`);

  // Screenshot full page
  const screenshot = await page.screenshot({ fullPage: true });
  await writeFile(outputPath, screenshot as Buffer);
  console.log(`[RENDER] PNG saved: ${outputPath}`);

  await browser.close();

  return { pngPath: outputPath, overflowPx, fits };
}
