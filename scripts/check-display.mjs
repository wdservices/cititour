import puppeteer from 'puppeteer';

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
const consoleMsgs = [];

page.on('console', msg => consoleMsgs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => errors.push('PAGE_ERROR: ' + err.message));
page.on('requestfailed', req => errors.push('FAILED_REQ: ' + req.url() + ' ' + (req.failure()?.errorText || '')));

try {
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle2', timeout: 30000 });
} catch(e) {
  errors.push('NAV_ERROR: ' + e.message);
}

await new Promise(r => setTimeout(r, 5000));

console.log('=== CONSOLE MESSAGES ===');
consoleMsgs.forEach(m => console.log(m));
console.log('=== ERRORS ===');
errors.forEach(e => console.log(e));
console.log('=== PAGE TITLE ===');
console.log(await page.title());

const rootHTML = await page.evaluate(() => document.getElementById('root')?.innerHTML?.substring(0, 1000));
console.log('=== ROOT HTML (first 1000 chars) ===');
console.log(rootHTML || 'EMPTY');

await browser.close();
