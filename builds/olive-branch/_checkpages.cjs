const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push('PAGEERR: ' + e.message));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 600));
  const tabs = ['Cover', 'Page2', 'Page3', 'Back'];
  const out = {};
  const btns = await p.$$('.tab');
  for (let i = 0; i < btns.length; i++) {
    await btns[i].click();
    await new Promise((r) => setTimeout(r, 400));
    out[tabs[i]] = await p.evaluate(() => ({
      pages: document.querySelectorAll('.page').length,
      cover: !!document.querySelector('.cover-logo'),
      buildGrid: !!document.querySelector('.byo-grid'),
      back: !!document.querySelector('.about-h'),
      sections: document.querySelectorAll('[data-sid]').length,
      overlay: !!document.querySelector('vite-error-overlay'),
    }));
  }
  console.log(JSON.stringify(out));
  console.log('errors:', errs.length ? errs.slice(0, 3) : 'none');
  await b.close();
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
