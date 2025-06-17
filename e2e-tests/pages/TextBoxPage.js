import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class TextBoxPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors
    this.fullNameInput = '#userName';
    this.emailInput = '#userEmail';
    this.currentAddressTextarea = '#currentAddress';
    this.permanentAddressTextarea = '#permanentAddress';
    this.submitButton = '#submit';

    // Output selectors
    this.outputDiv = '#output';
    this.outputName = '#output #name';
    this.outputEmail = '#output #email';
    this.outputCurrentAddress = '#output #currentAddress';
    this.outputPermanentAddress = '#output #permanentAddress';
  }

  async navigateToTextBoxPage() {
    await this.navigate('/text-box');
    await this.waitForElement(this.fullNameInput);
  }

  async fillTextBoxes(fullName, email, currentAddress, permanentAddress) {
    await this.fill(this.fullNameInput, fullName);
    await this.fill(this.emailInput, email);
    await this.fill(this.currentAddressTextarea, currentAddress);
    await this.fill(this.permanentAddressTextarea, permanentAddress);
  }

  async submitForm(waitForOutput = true) {
    await this.click(this.submitButton);
    // Wait for output to appear only if we expect it to be visible
    if (waitForOutput) {
      try {
        await this.waitForElement(this.outputDiv, { timeout: 5000 });
      } catch {
        // If output doesn't appear within 5 seconds, that's ok for some test cases
        // Log removed for eslint compliance
      }
    }
  }

  async isOutputDisplayed() {
    return await this.isVisible(this.outputDiv);
  }

  async getFieldData(selector, labelToRemove) {
    if (await this.isVisible(selector)) {
      const text = await this.getText(selector);
      return text.replace(labelToRemove, '').trim();
    }
    return null;
  }

  async getOutputData() {
    const data = {};

    // Get name output
    data.name = await this.getFieldData(this.outputName, 'Name:');

    // Get email output
    data.email = await this.getFieldData(this.outputEmail, 'Email:');

    // Get current address output
    data.currentAddress = await this.getFieldData(this.outputCurrentAddress, 'Current Address :');

    // Get permanent address output
    data.permanentAddress = await this.getFieldData(this.outputPermanentAddress, 'Permananet Address :');

    return data;
  }

  async validateTextBoxSubmission(expectedData) {
    // Check output is displayed
    expect(await this.isOutputDisplayed()).toBe(true);

    // Get output data
    const outputData = await this.getOutputData();

    // Validate the output data matches expected data
    expect(outputData.name).toBe(expectedData.fullName);
    expect(outputData.email).toBe(expectedData.email);
    expect(outputData.currentAddress).toBe(expectedData.currentAddress);
    expect(outputData.permanentAddress).toBe(expectedData.permanentAddress);

    return outputData;
  }

  generateRandomData() {
    const randomString = (length) => Math.random().toString(36).substring(2, length + 2);
    const randomNumber = () => Math.floor(Math.random() * 10000);

    return {
      fullName: `${randomString(6)} ${randomString(8)}`,
      email: `${randomString(8)}@${randomString(5)}.com`,
      currentAddress: `${randomNumber()} ${randomString(10)} St, ${randomString(8)} City`,
      permanentAddress: `${randomNumber()} ${randomString(12)} Ave, ${randomString(6)} Town`,
    };
  }
}
