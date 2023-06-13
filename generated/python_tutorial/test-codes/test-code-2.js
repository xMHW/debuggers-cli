// This E2E test code tests the second business logic of the test scenario

// Test Scenario:
// 2. Test that the color picker tool accurately displays RGB, HEX, and HSL values and allows for easy color selection.

const puppeteer = require('puppeteer');
const assert = require('assert');

describe('Color Picker Tool Test', function() {
  let browser;
  let page;

  before(async function() {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto('https://www.w3schools.com/colors/colors_picker.asp');
  });

  after(async function() {
    await browser.close();
  });

  it('should display RGB, HEX, and HSL values', async function() {
    const HEXRegex = /^#[0-9A-F]{6}$/i;
    const RGBRegex = /^rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)$/i;
    const HSLRegex = /^hsl\((\d{1,3}), (\d{1,3})%, (\d{1,3})%\)$/i;

    // Wait for the color picker to fully load
    await page.waitForSelector('#display');

    // Test HEX color format
    let colorHEX = await page.$eval('#HEX', el => el.value);
    assert(HEXRegex.test(colorHEX), 'Hexadecimal color is not valid.');

    // Test RGB color format
    let colorRGB = await page.$eval('#RGB', el => el.value);
    assert(RGBRegex.test(colorRGB), 'RGB color is not valid.');

    // Test HSL color format
    let colorHSL = await page.$eval('#HSL', el => el.value);
    assert(HSLRegex.test(colorHSL), 'HSL color is not valid.');
  });

  it('should allow easy color selection', async function() {
    // Wait for the color picker to fully load
    await page.waitForSelector('#display');

    // Select a color and check if it was applied to the display box
    await page.click('#R0_C1');
    await page.waitFor(500); // Wait for color to be applied
    let displayColor = await page.$eval('#display', el => el.style.backgroundColor);
    assert.strictEqual(displayColor, 'rgb(255, 0, 0)', 'Selected color was not applied to display box.');
  });
});