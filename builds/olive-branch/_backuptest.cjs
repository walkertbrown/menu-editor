const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errs=[]; page.on('pageerror',e=>errs.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon|404/.test(m.text()))errs.push('con:'+m.text());});
  await page.evaluateOnNewDocument(() => {
    window.OB_CONFIG = { backupUrl: 'http://127.0.0.1:9120', restaurantId: 'olive-branch-wire-test', restaurantName: 'Olive Branch Café' };
  });
  await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await sleep(500);
  // edit first item on page 2 to make it dirty + identifiable
  await page.evaluate(() => { const b=[...document.querySelectorAll('.tab')].find(e=>/page 2/i.test(e.textContent)); b&&b.click(); });
  await sleep(400);
  await page.click('.section .item .item-name');
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
  await page.keyboard.type('BACKUP-TEST-ITEM');
  await page.keyboard.press('Enter');
  await sleep(300);
  // click Save
  const saveBtn = await page.evaluateHandle(() => [...document.querySelectorAll('.toolbar button')].find(b=>/^Save$/.test(b.textContent)));
  await saveBtn.asElement().click();
  await sleep(1200);
  const syncText = await page.evaluate(() => document.querySelector('.toolbar .sync')?.textContent);
  const buttons = await page.evaluate(() => [...document.querySelectorAll('.toolbar button')].map(b=>b.textContent));
  console.log('sync status:', JSON.stringify(syncText));
  console.log('toolbar buttons:', JSON.stringify(buttons));
  console.log('errors:', errs.length?errs:'none');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
