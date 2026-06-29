const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox','--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const errs=[], failed=[];
  page.on('pageerror',e=>errs.push(e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push('con:'+m.text());});
  page.on('requestfailed',r=>{ if(!/favicon/.test(r.url())) failed.push(r.url()); });
  await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 1 });
  await page.goto('file:///home/elizabethcorley/olive-branch-editor/package/_filetest.html', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await sleep(600);
  const pre = await page.evaluate(() => ({
    config: !!window.OB_CONFIG,
    logoInlined: (document.querySelector('.cover-logo')?.getAttribute('src')||'').startsWith('data:'),
    hasBackupBtns: [...document.querySelectorAll('.toolbar button')].some(b=>/Restore from server/.test(b.textContent)),
  }));
  // edit + save
  await page.evaluate(() => { const b=[...document.querySelectorAll('.tab')].find(e=>/page 2/i.test(e.textContent)); b&&b.click(); });
  await sleep(400);
  await page.click('.section .item .item-name');
  await page.keyboard.down('Control'); await page.keyboard.press('KeyA'); await page.keyboard.up('Control');
  await page.keyboard.type('FILE-PROTO-SAVE');
  await page.keyboard.press('Enter'); await sleep(300);
  const saveBtn = await page.evaluateHandle(() => [...document.querySelectorAll('.toolbar button')].find(b=>/^Save$/.test(b.textContent)));
  await saveBtn.asElement().click();
  await sleep(1500);
  const sync = await page.evaluate(() => document.querySelector('.toolbar .sync')?.textContent);
  console.log('checks:', JSON.stringify(pre));
  console.log('sync after save:', JSON.stringify(sync));
  console.log('errors:', errs.length?errs:'none');
  console.log('failed non-font requests:', failed.length?[...new Set(failed)]:'none');
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
