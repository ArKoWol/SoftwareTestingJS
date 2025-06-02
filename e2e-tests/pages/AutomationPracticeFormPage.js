import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class AutomationPracticeFormPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors for mandatory fields
    this.firstNameInput = '#firstName';
    this.lastNameInput = '#lastName';
    this.emailInput = '#userEmail';
    this.genderMaleRadio = '#gender-radio-1';
    this.genderFemaleRadio = '#gender-radio-2';
    this.genderOtherRadio = '#gender-radio-3';
    this.mobileNumberInput = '#userNumber';
    this.submitButton = '#submit';

    // Modal result selectors
    this.modalDialog = '.modal-dialog';
    this.modalTitle = '#example-modal-sizes-title-lg';
    this.modalBody = '.modal-body';
    this.closeButton = '#closeLargeModal';

    // Result table selectors
    this.resultTable = '.table-responsive table tbody';
  }

  async navigateToFormPage() {
    await this.navigate('/automation-practice-form');
    await this.waitForElement(this.firstNameInput);
  }

  async fillMandatoryFields(firstName, lastName, email, gender, mobileNumber) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.emailInput, email);

    // Select gender radio button
    const genderSelector = gender.toLowerCase() === 'male' ? this.genderMaleRadio :
      gender.toLowerCase() === 'female' ? this.genderFemaleRadio :
        this.genderOtherRadio;

    // Click the label associated with the radio button since the radio input might be hidden
    await this.page.click(`label[for="${genderSelector.substring(1)}"]`);

    // Fill mobile number with validation
    await this.fill(this.mobileNumberInput, mobileNumber);

    // Verify that mobile number was entered correctly
    const actualMobileValue = await this.page.inputValue(this.mobileNumberInput);
    if (actualMobileValue !== mobileNumber) {
      // Try again with forced focus and clear
      await this.page.focus(this.mobileNumberInput);
      await this.page.fill(this.mobileNumberInput, '');
      await this.page.fill(this.mobileNumberInput, mobileNumber);

      // Wait a bit and check again
      await this.waitForTimeout(500);
      const retryValue = await this.page.inputValue(this.mobileNumberInput);
      if (retryValue !== mobileNumber) {
        // Force the value using JavaScript
        await this.page.evaluate((selector, value) => {
          const element = document.querySelector(selector);
          if (element) {
            element.value = value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, this.mobileNumberInput, mobileNumber);
      }
    }
  }

  async submitForm(waitForModal = true) {
    // Scroll to submit button to ensure it's visible
    await this.page.locator(this.submitButton).scrollIntoViewIfNeeded();

    // Wait a moment for any animations
    await this.waitForTimeout(500);

    // Click submit button
    await this.click(this.submitButton);

    if (waitForModal) {
      try {
        // Wait for modal to appear with longer timeout
        await this.waitForElement(this.modalDialog, 10000);
      } catch {
        // If modal doesn't appear, check if form validation failed
        const firstNameValue = await this.page.inputValue(this.firstNameInput);
        const lastNameValue = await this.page.inputValue(this.lastNameInput);
        const emailValue = await this.page.inputValue(this.emailInput);
        const mobileValue = await this.page.inputValue(this.mobileNumberInput);

        // Check if there are any validation errors on the page
        const validationErrors = await this.page.locator('.was-validated input:invalid, .is-invalid').count();

        // Create error with debugging information
        const debugInfo = {
          firstName: firstNameValue,
          lastName: lastNameValue,
          email: emailValue,
          mobile: mobileValue,
          validationErrors,
        };

        throw new Error(`Modal did not appear. Form state: ${JSON.stringify(debugInfo)}`);
      }
    } else {
      // Just wait a bit to ensure click was processed
      await this.waitForTimeout(1000);
    }
  }

  async submitFormWithoutModal() {
    await this.click(this.submitButton);
    // Just wait a bit to ensure click was processed
    await this.waitForTimeout(1000);
  }

  async isModalDisplayed() {
    return await this.isVisible(this.modalDialog);
  }

  async getModalTitle() {
    return await this.getText(this.modalTitle);
  }

  async getSubmittedData() {
    const rows = await this.page.locator(`${this.resultTable} tr`).all();
    const data = {};

    for (const row of rows) {
      const cells = await row.locator('td').all();
      if (cells.length >= 2) {
        const label = await cells[0].textContent();
        const value = await cells[1].textContent();
        data[label.trim()] = value.trim();
      }
    }

    return data;
  }

  async closeModal() {
    // Wait for modal to be visible first
    await this.waitForElement(this.modalDialog);

    // Try multiple strategies to close the modal
    try {
      // First, try to remove any interfering elements
      await this.page.evaluate(() => {
        // Remove ad elements that might be interfering
        const ads = document.querySelectorAll('#fixedban, [id*="google_ads"], iframe[src*="googlesyndication"]');
        ads.forEach(ad => ad.remove());
      });

      // Wait a moment for DOM to update
      await this.waitForTimeout(500);

      // Try clicking the close button
      await this.click(this.closeButton);

      // Wait for modal to disappear
      await this.page.waitForSelector(this.modalDialog, { state: 'hidden', timeout: 5000 });
    } catch {
      // If clicking fails, try alternative methods
      try {
        // Try pressing Escape key
        await this.page.keyboard.press('Escape');
        await this.page.waitForSelector(this.modalDialog, { state: 'hidden', timeout: 3000 });
      } catch {
        // Last resort: force click or JavaScript click
        await this.page.evaluate(() => {
          const closeBtn = document.querySelector('#closeLargeModal');
          if (closeBtn) {closeBtn.click();}
        });
        await this.waitForTimeout(1000);
      }
    }
  }

  async validateFormSubmission(expectedData) {
    // Check modal is displayed
    expect(await this.isModalDisplayed()).toBe(true);

    // Check modal title
    const modalTitle = await this.getModalTitle();
    expect(modalTitle).toBe('Thanks for submitting the form');

    // Get submitted data
    const submittedData = await this.getSubmittedData();

    // Validate the submitted data matches expected data
    expect(submittedData['Student Name']).toBe(`${expectedData.firstName} ${expectedData.lastName}`);
    expect(submittedData['Student Email']).toBe(expectedData.email);
    expect(submittedData['Gender']).toBe(expectedData.gender);
    expect(submittedData['Mobile']).toBe(expectedData.mobileNumber);

    return submittedData;
  }
}
