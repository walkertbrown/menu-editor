const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox','--allow-file-access-from-files'] });
  const page = await browser.newPage();
  const errs=[];
  page.on('pageerror',e=>errs.push('PAGEERR:'+e.message));
  page.on('console',m=>{if(m.type()==='error'&&!/favicon/.test(m.text()))errs.push('con:'+m.text());});
  await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 1 });
  await page.goto('file:///home/elizabethcorley/olive-branch-editor/package/_filetest.html', { waitUntil: 'load', timeout: 45000 });
  await sleep(1500);
  const probe = await page.evaluate(() => ({
    config: window.OB_CONFIG || null,
    rootChildren: document.getElementById('root')?.children.length,
    editorEl: !!document.querySelector('.editor'),
    tabs: [...document.querySelectorAll('.tab')].map(t=>t.textContent),
    items: document.querySelectorAll('.item').length,
    itemName: !!document.querySelector('.item-name'),
    bodyText: document.body.innerText.slice(0,200),
  }));
  console.log(JSON.stringify(probe,null,2));
  console.log('errors:', errs.length?errs:'none');
  await page.screenshot({ path: '/tmp/filetest.png' });
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
