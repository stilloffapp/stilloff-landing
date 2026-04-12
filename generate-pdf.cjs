const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  console.log('Navigating...');
  await page.goto('http://localhost:3000/', {
    waitUntil: 'load',   // 'load' not 'networkidle0' — dev server has persistent websockets
    timeout: 30000,
  });

  // Wait for React hydration + animations to start
  await new Promise(r => setTimeout(r, 4000));

  console.log('Generating PDF...');
  await page.pdf({
    path: 'C:/Users/Eddy0/stilloff-web/preview.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });

  await browser.close();
  console.log('Done — preview.pdf saved.');
})();
