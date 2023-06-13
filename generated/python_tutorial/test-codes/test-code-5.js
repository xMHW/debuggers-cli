// This is the E2E test code for the 5th business logic of the W3Schools website.

// Scenario: Check that the Python exercises accurately test knowledge of arrays and classes.

// Import necessary packages
const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');

// Set up the driver and navigate to the Python exercises page
let driver = new Builder().forBrowser('chrome').build();
driver.get('https://www.w3schools.com/python/exercise.asp');

// Find the array exercise and click on it
driver.wait(until.elementLocated(By.linkText('Arrays')), 3000);
driver.findElement(By.linkText('Arrays')).click();

// Wait for the exercise page to load and check the title
driver.wait(until.titleContains('Array Exercises'), 3000);
driver.getTitle().then(title => {
    assert.equal(title, 'Python Array Exercises');
});

// Find the instructions for the first exercise and check that it's about arrays
driver.wait(until.elementLocated(By.className('w3-center w3-padding')), 3000);
driver.findElement(By.className('w3-center w3-padding')).getText().then(text => {
    assert.ok(text.includes('arrays'));
});

// Find the code editor and enter the necessary code to complete the exercise
driver.wait(until.elementLocated(By.id('textareaCode')), 3000);
driver.findElement(By.id('textareaCode')).sendKeys('arr = [1, 2, 3]\nprint(arr)');

// Find the Run button and click on it
driver.wait(until.elementLocated(By.id('runbtn')), 3000);
driver.findElement(By.id('runbtn')).click();

// Wait for the code to execute and check the output
driver.wait(until.elementLocated(By.id('output')), 3000);
driver.findElement(By.id('output')).getText().then(text => {
    assert.equal(text, '[1, 2, 3]');
});

// Navigate back to the exercise page and find the class exercise
driver.get('https://www.w3schools.com/python/exercise.asp');
driver.wait(until.elementLocated(By.linkText('Classes')), 3000);
driver.findElement(By.linkText('Classes')).click();

// Wait for the exercise page to load and check the title
driver.wait(until.titleContains('Class Exercises'), 3000);
driver.getTitle().then(title => {
    assert.equal(title, 'Python Class Exercises');
});

// Find the instructions for the first exercise and check that it's about classes
driver.wait(until.elementLocated(By.className('w3-center w3-padding')), 3000);
driver.findElement(By.className('w3-center w3-padding')).getText().then(text => {
    assert.ok(text.includes('classes'));
});

// Find the code editor and enter the necessary code to complete the exercise
driver.wait(until.elementLocated(By.id('textareaCode')), 3000);
driver.findElement(By.id('textareaCode')).sendKeys('class MyClass:\n  x = 5');

// Find the Run button and click on it
driver.wait(until.elementLocated(By.id('runbtn')), 3000);
driver.findElement(By.id('runbtn')).click();

// Wait for the code to execute and check the output
driver.wait(until.elementLocated(By.id('output')), 3000);
driver.findElement(By.id('output')).getText().then(text => {
    assert.ok(text.includes('<class'));
});

// Quit the driver
driver.quit();