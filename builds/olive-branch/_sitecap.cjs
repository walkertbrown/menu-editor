const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 1 });
  await page.goto('file:///home/elizabethcorley/menu-site/index.html', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await new Promise(r=>setTimeout(r,600));
  await page.screenshot({ path: '/tmp/site_full.png', fullPage: true });
  // also a mobile shot
  await page.setViewport({ width: 390, height: 800, deviceScaleFactor: 1 });
  await new Promise(r=>setTimeout(r,300));
  await page.screenshot({ path: '/tmp/site_mobile.png', fullPage: true });
  console.log('errors:', errs.length?errs:'none');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
