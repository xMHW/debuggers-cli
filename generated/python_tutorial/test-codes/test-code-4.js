// Test Scenario: Validate that the CSS tutorial covers all essential concepts and includes clear code examples.

const { Builder, By } = require("selenium-webdriver");
const assert = require("assert");

describe("CSS Tutorial Test", function () {
  let driver;

  beforeEach(async function () {
    driver = await new Builder().forBrowser("chrome").build();
  });

  afterEach(async function () {
    await driver.quit();
  });

  it("should load CSS tutorial page", async function () {
    await driver.get("https://www.w3schools.com/css/default.asp");
    const pageTitle = await driver.findElement(By.tagName("title")).getText();
    assert.strictEqual(pageTitle, "CSS Tutorial");
  });

  it("should validate essential concepts and code examples", async function () {
    await driver.get("https://www.w3schools.com/css/default.asp");

    // Validate essential concepts
    const essentialConcepts = [
      "Selectors",
      "Backgrounds",
      "Text",
      "Fonts",
      "Links",
      "Lists",
      "Tables",
      "Box Model",
      "Layout",
      "Grids",
      "Responsive Web Design",
    ];
    for (let concept of essentialConcepts) {
      const link = await driver.findElement(By.linkText(concept));
      const href = await link.getAttribute("href");
      assert.ok(href.includes(concept.toLowerCase()));
    }

    // Validate code examples
    const codeExamplesSection = await driver.findElement(By.id("example"));
    const codeExamples = await codeExamplesSection.findElements(
      By.tagName("iframe")
    );
    assert.strictEqual(codeExamples.length, essentialConcepts.length);
  });
});