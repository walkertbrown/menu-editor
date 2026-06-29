const puppeteer = require('puppeteer');
const sleep = ms => new Promise(r=>setTimeout(r,ms));
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errs=[]; const failed=[];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type()==='error') errs.push('console:'+m.text()); });
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => { if (r.status()>=400) failed.push(r.status()+' '+r.url()); });
  await page.setViewport({ width: 1300, height: 950, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(() => { const b=[...document.querySelectorAll('.tab')].find(e=>/outside/i.test(e.textContent||'')); if(b)b.click(); });
  await sleep(900);
  const r = await page.evaluate(() => ({
    panels: document.querySelectorAll('.sheet .panel').length,
    visitH: document.querySelector('.bk-h')?.textContent,
    cater: document.querySelector('.ab-h')?.textContent,
    togo: document.querySelector('.cov-togo')?.textContent,
    logo: !!document.querySelector('.cov-logo'),
    logoComplete: document.querySelector('.cov-logo')?.complete && document.querySelector('.cov-logo')?.naturalWidth>0,
    overflow: [...document.querySelectorAll('.panel')].map(p=>p.scrollHeight-p.clientHeight),
  }));
  console.log('ERRORS:', errs.length?errs:'none');
  console.log('FAILED REQ:', failed.length?[...new Set(failed)]:'none');
  console.log(JSON.stringify(r,null,2));
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
