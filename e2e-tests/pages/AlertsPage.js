import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class AlertsPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.alertButton = '#alertButton';
    this.timerAlertButton = '#timerAlertButton';
    this.confirmButton = '#confirmButton';
    this.promtButton = '#promtButton';
    this.confirmResult = '#confirmResult';
    this.promptResult = '#promptResult';
  }

  async navigateToAlertsPage() {
    await this.navigate('/alerts');
    await this.waitForElement(this.alertButton);
  }

  async clickAlertButton() {
    let dialogHandled = false;

    this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('You clicked a button');
      await dialog.accept();
      dialogHandled = true;
    });

    await this.click(this.alertButton);

    // Wait a bit to ensure dialog was handled
    await this.waitForTimeout(500);
    return dialogHandled;
  }

  async clickTimerAlertButton() {
    let dialogHandled = false;

    this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      expect(dialog.message()).toBe('This alert appeared after 5 seconds');
      await dialog.accept();
      dialogHandled = true;
    });

    await this.click(this.timerAlertButton);

    // Wait for the timer alert (5+ seconds)
    await this.waitForTimeout(6000);
    return dialogHandled;
  }

  async clickConfirmButton(accept = true) {
    let dialogHandled = false;
    let dialogMessage = '';

    this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      dialogMessage = dialog.message();
      expect(dialogMessage).toBe('Do you confirm action?');

      if (accept) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
      dialogHandled = true;
    });

    await this.click(this.confirmButton);
    await this.waitForTimeout(500);

    return { dialogHandled, dialogMessage };
  }

  async clickPromptButton(inputText = 'Test input') {
    let dialogHandled = false;
    let dialogMessage = '';

    this.page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      dialogMessage = dialog.message();
      expect(dialogMessage).toBe('Please enter your name');
      await dialog.accept(inputText);
      dialogHandled = true;
    });

    await this.click(this.promtButton);
    await this.waitForTimeout(500);

    return { dialogHandled, dialogMessage };
  }

  async getConfirmResult() {
    return await this.getText(this.confirmResult);
  }

  async getPromptResult() {
    return await this.getText(this.promptResult);
  }
}
