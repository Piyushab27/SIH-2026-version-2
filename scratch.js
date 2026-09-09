import puppeteer from 'puppeteer';
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  // Wait for the app to load. Let's switch to super_admin by clicking the hidden trigger if any?
  // We can just use the console to switch it if possible. No, we'll edit DemoContext again.
  
  await browser.close();
})();
