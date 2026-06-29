const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 800));
  const counts = await page.evaluate(() => ({
    sections: document.querySelectorAll('.section').length,
    items: document.querySelectorAll('.item').length,
    sidebar: !!document.querySelector('.sidebar'),
    errorOverlay: !!document.querySelector('vite-error-overlay'),
  }));
  console.log('counts:', JSON.stringify(counts));
  console.log('console errors:', errors.length ? errors.slice(0, 5) : 'none');
  await browser.close();
})().catch((e) => { console.error('CHECK ERROR:', e.message); process.exit(1); });
