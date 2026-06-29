const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 45000 });
  await page.evaluate(async () => { await document.fonts.ready; });
  // click the trifold tab
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('button,.tab')].find(e => /to-go|trifold|inside/i.test(e.textContent||''));
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  const data = await page.evaluate(() => {
    const sheet = document.querySelector('.sheet');
    const fs = sheet ? getComputedStyle(sheet).getPropertyValue('--fs') : 'n/a';
    const out = [];
    const tis = [...document.querySelectorAll('.ti')].slice(0, 6);
    for (const ti of tis) {
      const tih = ti.querySelector('.tih');
      const tid = ti.querySelector('.tid');
      const name = ti.querySelector('.tin')?.textContent?.slice(0,18);
      const cs = getComputedStyle(ti);
      const r = {
        name,
        tiH: +ti.getBoundingClientRect().height.toFixed(1),
        tiMarginBottom: cs.marginBottom,
      };
      if (tih) { const x = tih.getBoundingClientRect(); r.tihTop=+x.top.toFixed(1); r.tihBottom=+x.bottom.toFixed(1); r.tihH=+x.height.toFixed(1);
        const tihcs = getComputedStyle(tih); r.tihLH = tihcs.lineHeight; }
      if (tid) { const y = tid.getBoundingClientRect(); r.tidTop=+y.top.toFixed(1); r.tidH=+y.height.toFixed(1);
        const tidcs = getComputedStyle(tid); r.tidLH=tidcs.lineHeight; r.tidMT=tidcs.marginTop;
        r.GAP_name_to_desc = +(y.top - r.tihBottom).toFixed(1);
      }
      out.push(r);
    }
    return { fs, panelEmpty: (() => { const p = document.querySelector('.panel'); if(!p) return null; return +(p.clientHeight - p.scrollHeight).toFixed(1);})(), out };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
