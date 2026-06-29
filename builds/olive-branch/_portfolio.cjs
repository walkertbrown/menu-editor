const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const tab = (page, re) => page.evaluate((rs) => { const b=[...document.querySelectorAll('.tab')].find(e=>new RegExp(rs,'i').test(e.textContent||'')); if(b)b.click(); }, re);
const shot = async (page, sel, out) => { const el = await page.$(sel); if(el){ await el.screenshot({path: out}); console.log('saved', out);} else console.log('NO EL', sel); };
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1500, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  const dir='/home/elizabethcorley/menu-site/img/';
  await tab(page,'cover'); await sleep(900); await shot(page,'.page.cover', dir+'cover.png');
  await tab(page,'page 2'); await sleep(900); await shot(page,'.page.content', dir+'page2.png');
  await tab(page,'page 3'); await sleep(900); await shot(page,'.page.content', dir+'page3.png');
  await tab(page,'outside'); await sleep(900); await shot(page,'.sheet', dir+'trifold-out.png');
  await tab(page,'inside'); await sleep(1100); await shot(page,'.sheet', dir+'trifold-in.png');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
