// Bundle the built app into ONE self-contained .html (JS + CSS + logo inlined),
// inject the per-restaurant backup config, and drop it in package/ with a README.
// Usage: node package-single.cjs <restaurantId> "<Restaurant Name>" <backupUrl>
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'package');

const restaurantId = process.argv[2] || 'olive-branch-cafe';
const restaurantName = process.argv[3] || 'Olive Branch Café';
const backupUrl = process.argv[4] || 'https://servermac.tailaad45c.ts.net/menus';

const html = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
const cssFile = fs.readdirSync(path.join(DIST, 'assets')).find((f) => f.endsWith('.css'));
const jsFile = fs.readdirSync(path.join(DIST, 'assets')).find((f) => f.endsWith('.js'));
const css = fs.readFileSync(path.join(DIST, 'assets', cssFile), 'utf8');
let js = fs.readFileSync(path.join(DIST, 'assets', jsFile), 'utf8');

// inline the logo as a data URI wherever the JS references it
const logo = fs.readFileSync(path.join(DIST, 'olive-branch-logo.png'));
const logoDataUri = 'data:image/png;base64,' + logo.toString('base64');
js = js.split('/olive-branch-logo.png').join(logoDataUri);
// make the inlined module script safe inside <script>
js = js.split('</script').join('<\\/script');

const config =
  `<script>window.OB_CONFIG=${JSON.stringify({ backupUrl, restaurantId, restaurantName })};</script>`;

// Load the bundle as a base64 data: module — immune to </script>, quotes, etc.
const jsB64 = Buffer.from(js, 'utf8').toString('base64');
const scriptTag = `${config}\n<script type="module" src="data:text/javascript;base64,${jsB64}"></script>`;

let out = html
  .replace(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]+"[^>]*>/, `<style>\n${css}\n</style>`)
  .replace(/<script type="module"[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/, scriptTag);

// inline the favicon (browser-tab icon) as a data URI so it travels with the file
const favPath = path.join(DIST, 'olive-branch-favicon.png');
let faviconInlined = false;
if (fs.existsSync(favPath)) {
  const faviconDataUri = 'data:image/png;base64,' + fs.readFileSync(favPath).toString('base64');
  out = out.split('/olive-branch-favicon.png').join(faviconDataUri);
  faviconInlined = true;
}

if (out.includes('/assets/')) { console.error('ERROR: /assets/ reference still present — replace failed'); process.exit(1); }

fs.mkdirSync(OUT, { recursive: true });
const safeName = restaurantName.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, ' ').trim();
const outFile = path.join(OUT, `${safeName} Menu Editor.html`);
fs.writeFileSync(outFile, out);

const bytes = Buffer.byteLength(out);
console.log(`wrote ${outFile} (${(bytes / 1024).toFixed(0)} KB)`);
console.log(`  restaurantId : ${restaurantId}`);
console.log(`  backupUrl    : ${backupUrl}`);
console.log(`  inlined      : css ${cssFile}, js ${jsFile}, logo ${(logo.length / 1024).toFixed(0)} KB${faviconInlined ? ', favicon' : ''}`);
if (!faviconInlined) console.warn('  note         : no olive-branch-favicon.png in dist — favicon not inlined');
