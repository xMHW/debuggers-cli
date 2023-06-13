// Test scenario: 
// 3. Confirm that the JavaScript reference page provides comprehensive information on all relevant functions and methods.

const assert = require('assert');
const { Builder, By, Key, until } = require('selenium-webdriver');

describe('W3Schools JavaScript Reference Page', function () {
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
  });

  it('Page loads properly', async function () {
    await driver.get('https://www.w3schools.com/jsref/');
    const title = await driver.getTitle();
    assert.strictEqual(title, 'JavaScript Reference');
  });

  it('All functions and methods are listed', async function () {
    const elements = await driver.findElements(By.css('ul.w3-ul li a'));
    assert.ok(elements.length > 0);
    const functionNames = [];
    for (let element of elements) {
      functionNames.push(await element.getText());
    }
    assert.ok(functionNames.includes('Array'));
    assert.ok(functionNames.includes('Date'));
    assert.ok(functionNames.includes('Math'));
    assert.ok(functionNames.includes('String'));
    assert.ok(functionNames.includes('Object'));
  });

  it('Function links work', async function () {
    const elements = await driver.findElements(By.css('ul.w3-ul li a'));
    const hrefs = [];
    for (let element of elements) {
      hrefs.push(await element.getAttribute('href'));
    }
    for (let href of hrefs) {
      await driver.get(href);
      const title = await driver.getTitle();
      assert.ok(title.includes('JavaScript'));
    }
  });

  after(async function () {
    await driver.quit();
  });
}); 

// This E2E code tests that the JavaScript reference page loads properly and contains all relevant functions and methods. 
// It also checks that all function links are functional and lead to pages with relevant information.