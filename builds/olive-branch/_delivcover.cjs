const puppeteer=require('puppeteer'); const sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--allow-file-access-from-files']});
const p=await b.newPage(); await p.setViewport({width:1000,height:1300,deviceScaleFactor:1});
await p.goto('file:///home/elizabethcorley/olive-branch-editor/package/Olive Branch Cafe Menu Editor.html',{waitUntil:'load',timeout:45000});
await sleep(1000);
await p.evaluate(()=>{const t=[...document.querySelectorAll('.tab')].find(e=>/cover/i.test(e.textContent));t&&t.click();});
await sleep(900);
const r=await p.evaluate(()=>{const im=document.querySelector('.cover-logo');return{src:(im?.getAttribute('src')||'').slice(0,30),complete:im?.complete,w:im?.naturalWidth};});
console.log(JSON.stringify(r)); await b.close();})().catch(e=>{console.error(e.message);process.exit(1);});
