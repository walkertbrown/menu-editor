const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  // dine-in page 2 is default (food). ensure:
  await page.evaluate(() => { const b=[...document.querySelectorAll('.tab')].find(e=>/page 2/i.test(e.textContent||'')); if(b)b.click(); });
  await sleep(800);
  const before = await page.evaluate(() => document.querySelector('.side-title')?.textContent);
  const grip = await page.$('.item .item-tools .grip');
  const gb = await grip.boundingBox();
  const side = await page.$('.sidebar'); const sb = await side.boundingBox();
  await page.mouse.move(gb.x+gb.width/2, gb.y+gb.height/2);
  await page.mouse.down();
  for (let i=1;i<=12;i++){ await page.mouse.move(gb.x + (sb.x+40-gb.x)*i/12, gb.y + (sb.y+90-gb.y)*i/12); await sleep(30); }
  await page.mouse.move(sb.x+40, sb.y+90); await sleep(100);
  await page.mouse.up(); await sleep(400);
  const after = await page.evaluate(() => document.querySelector('.side-title')?.textContent);
  console.log('dine-in BEFORE parked:', before, '| AFTER:', after);
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
