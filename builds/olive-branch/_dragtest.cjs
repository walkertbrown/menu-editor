const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(() => { const b=[...document.querySelectorAll('button,.tab')].find(e=>/to-go|trifold|inside/i.test(e.textContent||'')); if(b)b.click(); });
  await sleep(1000);

  const before = await page.evaluate(() => ({
    firstItem: document.querySelector('.ti .tin')?.textContent,
    parked: document.querySelector('.side-title')?.textContent,
  }));

  // grab first item's grip, drag to the sidebar (parking lot)
  const grip = await page.$('.ti .item-tools .grip');
  const gb = await grip.boundingBox();
  const side = await page.$('.sidebar');
  const sb = await side.boundingBox();
  await page.mouse.move(gb.x+gb.width/2, gb.y+gb.height/2);
  await page.mouse.down();
  // move in steps past the 5px activation distance
  for (let i=1;i<=10;i++){ await page.mouse.move(gb.x + (sb.x+40-gb.x)*i/10, gb.y + (sb.y+80-gb.y)*i/10); await sleep(30); }
  await page.mouse.move(sb.x+40, sb.y+90); await sleep(80);
  await page.mouse.up();
  await sleep(400);

  const after = await page.evaluate(() => ({
    firstItem: document.querySelector('.ti .tin')?.textContent,
    parked: document.querySelector('.side-title')?.textContent,
    parkRows: document.querySelectorAll('.park').length,
  }));
  console.log('BEFORE', before);
  console.log('AFTER ', after);
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
