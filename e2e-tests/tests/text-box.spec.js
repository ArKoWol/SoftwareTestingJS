import { test, expect } from '@playwright/test';
import { TextBoxPage } from '../pages/TextBoxPage.js';
import { DataGenerator } from '../utils/DataGenerator.js';

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
  //TODO Separate test data from test.
  test('Should fill text box with specific test data for edge cases', async() => {
    const testData = {
      fullName: 'John Doe Smith',
      email: 'john.doe.smith@testmail.com',
      currentAddress: '123 Main Street, New York, NY 10001',
      permanentAddress: '456 Oak Avenue, Los Angeles, CA 90210',
    };

    await textBoxPage.fillTextBoxes(
      testData.fullName,
      testData.email,
      testData.currentAddress,
      testData.permanentAddress,
    );

    await textBoxPage.submitForm();
    await textBoxPage.validateTextBoxSubmission(testData);
  });

  test('Should handle empty fields properly', async() => {
    const testData = {
      fullName: '',
      email: '',
      currentAddress: '',
      permanentAddress: '',
    };

    await textBoxPage.fillTextBoxes(
      testData.fullName,
      testData.email,
      testData.currentAddress,
      testData.permanentAddress,
    );

    // Submit form without waiting for output since empty fields might not show output
    await textBoxPage.submitForm(false);

    // Just check that the page is still responsive after clicking submit
    const isVisible = await textBoxPage.isVisible(textBoxPage.submitButton);
    expect(isVisible).toBe(true);
  });

  test('Should fill text box with special characters', async() => {
    const testData = {
      fullName: 'José María González-López',
      email: 'jose.maria@domain-test.co.uk',
      currentAddress: '123 Main St. Apt 5B, São Paulo, SP 01234-567',
      permanentAddress: '456 Oak Ave. Suite 10C, México D.F., MX 12345',
    };

    await textBoxPage.fillTextBoxes(
      testData.fullName,
      testData.email,
      testData.currentAddress,
      testData.permanentAddress,
    );

    await textBoxPage.submitForm();
    await textBoxPage.validateTextBoxSubmission(testData);
  });
});
