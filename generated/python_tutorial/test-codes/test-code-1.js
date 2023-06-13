// Test Scenario:
// 1. Verify that the HTML tutorial page loads properly and all links are functional.

const puppeteer = require('puppeteer');
const assert = require('assert');

describe('HTML tutorial page', () => {
  let browser;
  let page;

  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
  });

  after(async () => {
    await browser.close();
  });

  it('should load the page without errors', async () => {
    await page.goto('https://www.w3schools.com/html/default.asp');
    const pageTitle = await page.title();
    assert.strictEqual(pageTitle, 'HTML Tutorial');
  });

  it('should have all links functional', async () => {
    const linkCount = await page.evaluate(() =>
      document.querySelectorAll('a').length
    );
    assert.ok(linkCount > 0, 'No links found on the page.');

    for (let i = 0; i < linkCount; i++) {
      let href = await page.evaluate((index) =>
        document.querySelectorAll('a')[index].getAttribute('href')
      , i);
      href = href.trim();
      if (href === '' || href === '#' || href.startsWith('javascript:')) {
        continue;
      }
      const response = await page.goto(href, { waitUntil: 'networkidle0' });
      const status = response.status();
      assert.ok(
        status === 200 || status === 301 || status === 302,
        `Invalid response status for link ${href}.`
      );
    }
  });
});

// End of code.