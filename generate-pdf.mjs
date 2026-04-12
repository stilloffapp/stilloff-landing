import puppeteer from 'C:/tmp/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();

// Full-page desktop viewport
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

console.log('Navigating to http://localhost:3002/ ...');
await page.goto('http://localhost:3002/', {
  waitUntil: 'networkidle0',
  timeout: 30000,
});

// Let animations settle
await new Promise(r => setTimeout(r, 3000));

console.log('Generating PDF...');
await page.pdf({
  path: 'C:/Users/Eddy0/stilloff-web/preview.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
});

await browser.close();
console.log('Done — preview.pdf saved.');
