const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(() => { const b=[...document.querySelectorAll('.tab')].find(e=>/outside/i.test(e.textContent||'')); if(b)b.click(); });
  await sleep(1000);
  const el = await page.$('.sheet');
  await el.screenshot({ path: '/tmp/ob_outside.png' });
  await browser.close();
  console.log('saved /tmp/ob_outside.png');
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
