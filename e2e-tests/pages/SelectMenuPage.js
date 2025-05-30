import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class SelectMenuPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors for different select menus
    this.selectValueDropdown = '#withOptGroup';
    this.selectOneDropdown = '#selectOne';
    this.oldStyleSelect = '#oldSelectMenu';
    this.multiselectDropdown = '#selectMenuContainer div:has-text("Select..."):last-of-type .css-2b097c-container';

    // Option selectors - will be dynamic based on text
  }

  async navigateToSelectMenuPage() {
    await this.navigate('/select-menu');
    await this.waitForElement(this.selectValueDropdown);
  }

  async selectValueGroup2Option1() {
    // Click the select value dropdown
    await this.click(this.selectValueDropdown);

    // Select "Group 2, option 1"
    await this.page.click('text=Group 2, option 1');

    // Verify selection
    const selectedText = await this.page.locator(this.selectValueDropdown).textContent();
    expect(selectedText.includes('Group 2, option 1')).toBe(true);
  }

  async selectOneOther() {
    // Click the select one dropdown
    await this.click(this.selectOneDropdown);

    // Select "Other"
    await this.page.click('text=Other');

    // Verify selection
    const selectedText = await this.page.locator(this.selectOneDropdown).textContent();
    expect(selectedText.includes('Other')).toBe(true);
  }

  async selectOldStyleGreen() {
    // Select Green from old style select menu - using index instead of hardcoded value
    await this.page.selectOption(this.oldStyleSelect, { label: 'Green' });

    // Get the selected text to verify it's Green
    const selectedText = await this.page.locator(`${this.oldStyleSelect} option:checked`).textContent();
    expect(selectedText).toBe('Green');
  }
  //TODO remove locators to the constructor section
  async selectMultiselectBlackBlue() {
    // Find the multiselect dropdown more specifically - it's the last one on the page
    const multiselectWrapper = this.page.locator('#selectMenuContainer .css-2b097c-container').last();

    // Click to open dropdown
    await multiselectWrapper.click();
    await this.waitForTimeout(1000); // Wait for dropdown to fully open

    // Wait for the dropdown menu to appear
    await this.page.waitForSelector('.css-26l3qy-menu', { timeout: 10000 });

    // Select Black - wait for it to be visible and clickable
    const blackOption = this.page.locator('.css-26l3qy-menu').getByText('Black', { exact: true });
    await blackOption.waitFor({ state: 'visible', timeout: 5000 });
    await blackOption.click();
    await this.waitForTimeout(500);

    // Select Blue - wait for it to be visible and clickable
    const blueOption = this.page.locator('.css-26l3qy-menu').getByText('Blue', { exact: true });
    await blueOption.waitFor({ state: 'visible', timeout: 5000 });
    await blueOption.click();
    await this.waitForTimeout(500);

    // Click outside to close dropdown
    await this.page.click('h1'); // Click on the page heading instead of body
    await this.waitForTimeout(1000); // Give time for dropdown to close and selections to register

    // Verify selections are visible in the multiselect container - look for the selected value tags
    const multiselectContainer = this.page.locator('#selectMenuContainer').last();

    // Look for the selected value containers/pills that contain Black and Blue
    const blackSelected = await multiselectContainer.locator('.css-12jo7m5', { hasText: 'Black' }).count() > 0;
    const blueSelected = await multiselectContainer.locator('.css-12jo7m5', { hasText: 'Blue' }).count() > 0;

    expect(blackSelected).toBe(true);
    expect(blueSelected).toBe(true);
  }

  async performAllSelections() {
    // Perform all required selections
    await this.selectValueGroup2Option1();
    await this.waitForTimeout(500);

    await this.selectOneOther();
    await this.waitForTimeout(500);

    await this.selectOldStyleGreen();
    await this.waitForTimeout(500);

    await this.selectMultiselectBlackBlue();
    await this.waitForTimeout(500);
  }

  async validateAllSelections() {
    // Validate Select Value dropdown
    const selectValueText = await this.page.locator(this.selectValueDropdown).textContent();
    expect(selectValueText.includes('Group 2, option 1')).toBe(true);

    // Validate Select One dropdown
    const selectOneText = await this.page.locator(this.selectOneDropdown).textContent();
    expect(selectOneText.includes('Other')).toBe(true);

    // Validate Old Style Select - check the text instead of value
    const oldStyleText = await this.page.locator(`${this.oldStyleSelect} option:checked`).textContent();
    expect(oldStyleText).toBe('Green');

    // Validate Multiselect (Black and Blue should be visible as selected value tags)
    const multiselectContainer = this.page.locator('#selectMenuContainer').last();
    const blackExists = await multiselectContainer.locator('.css-12jo7m5', { hasText: 'Black' }).count() > 0;
    const blueExists = await multiselectContainer.locator('.css-12jo7m5', { hasText: 'Blue' }).count() > 0;

    expect(blackExists).toBe(true);
    expect(blueExists).toBe(true);

    return {
      selectValue: selectValueText,
      selectOne: selectOneText,
      oldStyle: oldStyleText,
      multiselect: { black: blackExists, blue: blueExists },
    };
  }
}
