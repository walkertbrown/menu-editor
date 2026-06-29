const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1100, height: 1500, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await new Promise((r) => setTimeout(r, 1000));
  const shot = async (p) => { const el = await page.$('.menu'); await el.screenshot({ path: p }); };

  await shot('/tmp/ob_before.png');

  // Remove 3 items (first item of the first section, three times) to force a re-fit.
  for (let i = 0; i < 3; i++) {
    const btn = await page.$('.section .item .rm');
    if (btn) { await btn.click(); await new Promise((r) => setTimeout(r, 250)); }
  }
  await new Promise((r) => setTimeout(r, 500));
  await shot('/tmp/ob_after.png');

  await browser.close();
  console.log('demo done');
})().catch((e) => { console.error('DEMO ERROR:', e.message); process.exit(1); });
