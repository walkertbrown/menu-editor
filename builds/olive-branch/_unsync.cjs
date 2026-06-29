const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const tab = (page, re) => page.evaluate((rs) => { const b=[...document.querySelectorAll('.tab')].find(e=>new RegExp(rs,'i').test(e.textContent||'')); if(b)b.click(); }, re);
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });

  // dine-in page 2: read first appetizer item name
  await tab(page,'page 2'); await sleep(600);
  const dineBefore = await page.evaluate(() => document.querySelector('.section[data-sid="appetizers"] .item .item-name')?.textContent);

  // trifold: edit first item name
  await tab(page,'to-go'); await sleep(800);
  await page.click('.ti .tin');
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
  await page.keyboard.type('ZZZ-TRIFOLD-ONLY');
  await page.keyboard.press('Enter');
  await sleep(300);
  const triAfter = await page.evaluate(() => document.querySelector('.ti .tin')?.textContent);

  // back to dine-in: confirm unchanged
  await tab(page,'page 2'); await sleep(600);
  const dineAfter = await page.evaluate(() => document.querySelector('.section[data-sid="appetizers"] .item .item-name')?.textContent);

  console.log('dine-in first appetizer BEFORE:', JSON.stringify(dineBefore));
  console.log('trifold first item AFTER edit :', JSON.stringify(triAfter));
  console.log('dine-in first appetizer AFTER :', JSON.stringify(dineAfter));
  console.log(dineBefore === dineAfter && triAfter.includes('ZZZ') ? 'PASS: un-synced ✓' : 'FAIL: still linked ✗');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
