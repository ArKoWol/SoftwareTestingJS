import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/TextBoxPage.js';
import { DataGenerator } from '../utils/DataGenerator.js';
import { textBoxTestData } from '../test-data/textBoxTestData.js';

// Generate multiple random data sets for parameterized testing
const randomDataSets = [
  DataGenerator.generateRandomTextBoxData(),
  DataGenerator.generateRandomTextBoxData(),
  DataGenerator.generateRandomTextBoxData(),
  DataGenerator.generateRandomTextBoxData(),
  DataGenerator.generateRandomTextBoxData(),
];

test.describe('Text Box Tests', () => {
  let textBoxPage;

  test.beforeEach(async({ page }) => {
    textBoxPage = new TextBoxPage(page);
    await textBoxPage.navigateToTextBoxPage();
  });

  // Parameterized tests with automatically generated random data
  randomDataSets.forEach((randomData, index) => {
    test(`Should fill text box with random data set ${index + 1}`, async() => {
      // Fill text boxes with random data
      await textBoxPage.fillTextBoxes(
        randomData.fullName,
        randomData.email,
        randomData.currentAddress,
        randomData.permanentAddress,
      );

      // Submit form
      await textBoxPage.submitForm();

      // Validate results
      await textBoxPage.validateTextBoxSubmission(randomData);
    });
  });

  test('Should fill text box with specific test data for edge cases', async() => {
    await textBoxPage.fillTextBoxes(
      textBoxTestData.edgeCases.fullName,
      textBoxTestData.edgeCases.email,
      textBoxTestData.edgeCases.currentAddress,
      textBoxTestData.edgeCases.permanentAddress,
    );

    await textBoxPage.submitForm();
    await textBoxPage.validateTextBoxSubmission(textBoxTestData.edgeCases);
  });

  test('Should handle empty fields properly', async() => {
    await textBoxPage.fillTextBoxes(
      textBoxTestData.emptyFields.fullName,
      textBoxTestData.emptyFields.email,
      textBoxTestData.emptyFields.currentAddress,
      textBoxTestData.emptyFields.permanentAddress,
    );

    // Submit form without waiting for output since empty fields might not show output
    await textBoxPage.submitForm(false);

    // Just check that the page is still responsive after clicking submit
    const isVisible = await textBoxPage.isVisible(textBoxPage.submitButton);
    expect(isVisible).toBe(true);
  });

  test('Should fill text box with special characters', async() => {
    await textBoxPage.fillTextBoxes(
      textBoxTestData.specialCharacters.fullName,
      textBoxTestData.specialCharacters.email,
      textBoxTestData.specialCharacters.currentAddress,
      textBoxTestData.specialCharacters.permanentAddress,
    );

    await textBoxPage.submitForm();
    await textBoxPage.validateTextBoxSubmission(textBoxTestData.specialCharacters);
  });
});
