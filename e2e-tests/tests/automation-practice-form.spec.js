import { test, expect } from '@playwright/test';
import { AutomationPracticeFormPage } from '../pages/AutomationPracticeFormPage.js';
import { DataGenerator } from '../utils/DataGenerator.js';

// Generate random test data sets for parameterized testing
const randomTestDataSets = [
  { name: 'Random data set 1', data: DataGenerator.generateRandomFormData() },
  { name: 'Random data set 2', data: DataGenerator.generateRandomFormData() },
  { name: 'Random data set 3', data: DataGenerator.generateRandomFormData() },
  { name: 'Random data set 4', data: DataGenerator.generateRandomFormData() },
  { name: 'Random data set 5', data: DataGenerator.generateRandomFormData() },
];

// Predefined test data sets for edge cases
const edgeCaseTestDataSets = [
  {
    name: 'Long names test',
    data: {
      firstName: 'Christopher',
      lastName: 'Willoughby-Thompson',
      email: 'christopher.willoughby@longdomain.example.com',
      gender: 'Male',
      mobileNumber: '1111222233',
    },
  },
  {
    name: 'Special characters test',
    data: {
      firstName: 'José',
      lastName: 'O\'Connor',
      email: 'jose.oconnor@domain.co.uk',
      gender: 'Female',
      mobileNumber: '9999888877',
    },
  },
];

// Combine random and edge case data
const allTestDataSets = [...randomTestDataSets, ...edgeCaseTestDataSets];

test.describe('Automation Practice Form Tests', () => {
  let formPage;

  test.beforeEach(async({ page }) => {
    formPage = new AutomationPracticeFormPage(page);
    await formPage.navigateToFormPage();
  });

  // Parameterized test using forEach for both random and edge case data
  allTestDataSets.forEach(({ name, data }) => {
    test(`Should fill and submit form - ${name}`, async() => {
      // Fill mandatory fields
      await formPage.fillMandatoryFields(
        data.firstName,
        data.lastName,
        data.email,
        data.gender,
        data.mobileNumber,
      );

      // Submit form
      await formPage.submitForm();

      // Validate submission result
      const submittedData = await formPage.validateFormSubmission(data);

      // Verify all required fields are present in the result
      expect(submittedData).toHaveProperty('Student Name');
      expect(submittedData).toHaveProperty('Student Email');
      expect(submittedData).toHaveProperty('Gender');
      expect(submittedData).toHaveProperty('Mobile');

      // Close modal
      await formPage.closeModal();
    });
  });

  // Additional test with validation requirements
  test('Should validate form with empty fields handling', async() => {
    // Try to submit without filling mandatory fields
    await formPage.submitForm(false); // Don't wait for modal since none should appear

    // Form should not be submitted and modal should not appear
    const isModalVisible = await formPage.isModalDisplayed();
    expect(isModalVisible).toBe(false);
  });
});
