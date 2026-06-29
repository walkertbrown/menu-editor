const puppeteer = require('puppeteer');
(async () => {
  const url = process.argv[2] || 'http://localhost:5173/';
  const out = process.argv[3] || '/tmp/ob_page2.png';
  const sel = process.argv[4] || '.menu';
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 1500, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await new Promise((r) => setTimeout(r, 1000));
  const el = await page.$(sel);
  if (el) await el.screenshot({ path: out });
  else await page.screenshot({ path: out, fullPage: true });
  await browser.close();
  console.log('shot saved:', out);
})().catch((e) => { console.error('SHOT ERROR:', e.message); process.exit(1); });
