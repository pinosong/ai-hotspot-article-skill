// Article screenshot batch. Requires relay.js running on 127.0.0.1:18080.
// Usage: node shoot.js jobs.json
// jobs.json: [{ "name": "reuters-top", "urls": ["https://..."], "mode": "clip"|"element",
//               "clip": {"x":0,"y":0,"w":1280,"h":1050},   // css px, for mode=clip
//               "selector": "article table" }]            // for mode=element
// Output: <outdir>/<name>.png at deviceScaleFactor 2.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

async function main() {
  const jobsPath = process.argv[2];
  if (!jobsPath) { console.error('usage: node shoot.js jobs.json'); process.exit(2); }
  const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
  const outdir = process.env.SHOT_OUTDIR || path.join(process.cwd(), 'screenshots');
  fs.mkdirSync(outdir, { recursive: true });

  const browser = await chromium.launch({ headless: true, args: [
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader',
    '--disable-blink-features=AutomationControlled',
    '--proxy-server=http://127.0.0.1:18080', '--ignore-certificate-errors',
  ]});

  for (const job of jobs) {
    let ok = false;
    for (const url of job.urls) {
      if (ok) break;
      const ctx = await browser.newContext({
        viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, userAgent: UA, locale: 'en-US',
      });
      const page = await ctx.newPage();
      try {
        console.log('GET', url);
        const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('  status:', resp && resp.status());
        if (resp && resp.status() >= 400) throw new Error('bad status ' + resp.status());
        await page.waitForTimeout(3000);
        const out = path.join(outdir, job.name + '.png');
        if (job.mode === 'element' && job.selector) {
          const loc = page.locator(job.selector);
          const n = await loc.count();
          console.log('  selector matches:', n);
          if (n === 0) throw new Error('selector matched nothing');
          await loc.first().scrollIntoViewIfNeeded();
          await page.waitForTimeout(800);
          await loc.first().screenshot({ path: out });
        } else {
          const c = job.clip || { x: 0, y: 0, w: 1280, h: 1050 };
          await page.screenshot({ path: out, clip: { x: c.x, y: c.y, width: c.w, height: c.h } });
        }
        console.log('  saved', job.name);
        ok = true;
      } catch (e) {
        console.log('  FAILED:', String(e.message).split('\n')[0]);
      }
      await ctx.close();
    }
    if (!ok) console.log('!! all urls failed for', job.name);
  }
  await browser.close();
  console.log('done');
}

main().catch(e => { console.error(e); process.exit(1); });
