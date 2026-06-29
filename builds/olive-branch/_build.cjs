const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  page.on('console', m => { if (m.type()==='error') errs.push('console:'+m.text()); });
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.evaluate(() => { const b=[...document.querySelectorAll('button,.tab')].find(e=>/to-go|trifold|inside/i.test(e.textContent||'')); if(b)b.click(); });
  await new Promise(r=>setTimeout(r,1200));
  const r = await page.evaluate(() => {
    const grids=[...document.querySelectorAll('.tbyo-grid')].map(g=>g.textContent.replace(/\s+/g,' ').trim());
    const sep=document.querySelector('.tbsep')?.textContent;
    const lines=[...document.querySelectorAll('.panel:last-child .byo-l')].map(l=>l.textContent.trim());
    const fs=getComputedStyle(document.querySelector('.sheet')).getPropertyValue('--fs');
    const overflow=[...document.querySelectorAll('.panel')].map(p=>p.scrollHeight-p.clientHeight);
    return {grids,sep,lines,fs,overflow};
  });
  console.log('ERRORS:', errs.length?errs:'none');
  console.log(JSON.stringify(r,null,2));
  await browser.close();
})().catch(e=>{console.error('ERR',e.message);process.exit(1);});
