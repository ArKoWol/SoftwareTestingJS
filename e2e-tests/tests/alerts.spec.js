import { test, expect } from '@playwright/test';
import { AlertsPage } from '../pages/AlertsPage.js';
import { DataGenerator } from '../utils/DataGenerator.js';

// Test data sets for parameterized prompt testing
const promptTestData = [
  DataGenerator.generateRandomPromptText(),
  DataGenerator.generateRandomPromptText(),
  DataGenerator.generateRandomPromptText(),
  DataGenerator.generateRandomPromptText(),
  DataGenerator.generateRandomPromptText(),
];

test.describe('Alerts Page Tests', () => {
  let alertsPage;

  test.beforeEach(async({ page }) => {
    alertsPage = new AlertsPage(page);
    await alertsPage.navigateToAlertsPage();
  });

  test('Should handle simple alert', async() => {
    const dialogHandled = await alertsPage.clickAlertButton();
    expect(dialogHandled).toBe(true);
  });

  test('Should handle timer alert after 5 seconds', async() => {
    const dialogHandled = await alertsPage.clickTimerAlertButton();
    expect(dialogHandled).toBe(true);
  });

  test('Should handle confirm dialog - Accept', async() => {
    const result = await alertsPage.clickConfirmButton(true);
    expect(result.dialogHandled).toBe(true);

    // Check the result text on the page
    const confirmResult = await alertsPage.getConfirmResult();
    expect(confirmResult).toBe('You selected Ok');
  });

  test('Should handle confirm dialog - Cancel', async() => {
    const result = await alertsPage.clickConfirmButton(false);
    expect(result.dialogHandled).toBe(true);

    // Check the result text on the page
    const confirmResult = await alertsPage.getConfirmResult();
    expect(confirmResult).toBe('You selected Cancel');
  });

  // Parameterized test for prompt dialogs with random data
  promptTestData.forEach((testInput, index) => {
    test(`Should handle prompt dialog with random input - Test ${index + 1}`, async() => {
      const result = await alertsPage.clickPromptButton(testInput);
      expect(result.dialogHandled).toBe(true);

      // Check the result text on the page
      const promptResult = await alertsPage.getPromptResult();
      expect(promptResult).toBe(`You entered ${testInput}`);
    });
  });
});
