// Render a full-page preview of the built article for visual QC.
// Usage: NODE_PATH=<playwright node_modules> node render_preview.js file.html out.png
// file:// needs no proxy. Inspect out.png yourself: title card, every image,
// sources list -- "all green" from tagcheck is not enough.
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const [file, out] = process.argv.slice(2);
  if (!file || !out) { console.error('usage: node render_preview.js file.html out.png'); process.exit(2); }
  const b = await chromium.launch({ headless: true,
    args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
  const p = await (await b.newContext({ viewport: { width: 760, height: 900 } })).newPage();
  await p.goto('file://' + path.resolve(file), { waitUntil: 'networkidle' });
  const imgs = await p.evaluate(() => [...document.querySelectorAll('img')]
    .map(i => ({ src: i.src.slice(0, 32), w: i.naturalWidth, h: i.naturalHeight })));
  console.log('images:', JSON.stringify(imgs, null, 1));
  const broken = imgs.filter(i => i.w === 0);
  if (broken.length) console.log('!! BROKEN IMAGES:', broken.length);
  await p.screenshot({ path: out, fullPage: true });
  console.log('saved', out);
  await b.close();
  if (broken.length) process.exit(1);
})();
