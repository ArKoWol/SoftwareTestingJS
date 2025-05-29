import { BasePage } from './BasePage.js';
import { expect } from '@playwright/test';

export class ToolTipsPage extends BasePage {
  constructor(page) {
    super(page);

    // Selectors for elements with tooltips
    this.hoverMeButton = '#toolTipButton';
    this.hoverMeInput = '#toolTipTextField';
    this.contraryLink = 'a[href="#"]';
    this.sectionLink = 'a[href="#"]';

    // Tooltip selector
    this.tooltip = '.tooltip-inner';
  }

  async navigateToToolTipsPage() {
    await this.navigate('/tool-tips');
    await this.waitForElement(this.hoverMeButton);
  }

  async clearTooltip() {
    // Move mouse to a neutral position to clear any existing tooltip
    await this.page.hover('h1'); // Hover over the page title instead of body
    await this.waitForTimeout(500); // Increased wait time

    // Wait for any existing tooltip to disappear
    try {
      await this.page.waitForSelector(this.tooltip, { state: 'hidden', timeout: 2000 });
    } catch {
      // Tooltip might not exist, continue
    }
  }

  async hoverOverButton() {
    await this.clearTooltip();
    await this.page.hover(this.hoverMeButton);
    await this.waitForElement(this.tooltip);
    const text = await this.getText(this.tooltip);
    await this.clearTooltip(); // Clear after getting text
    return text;
  }

  async hoverOverTextField() {
    await this.clearTooltip();
    await this.page.hover(this.hoverMeInput);
    await this.waitForElement(this.tooltip);
    const text = await this.getText(this.tooltip);
    await this.clearTooltip(); // Clear after getting text
    return text;
  }

  async hoverOverContraryLink() {
    await this.clearTooltip();
    // There are multiple links, we need to find the one with "Contrary" text
    const contraryLink = this.page.locator('a:has-text("Contrary")');
    await contraryLink.hover();
    await this.waitForElement(this.tooltip);
    const text = await this.getText(this.tooltip);
    await this.clearTooltip(); // Clear after getting text
    return text;
  }

  async hoverOverSectionLink() {
    await this.clearTooltip();
    // Find the link with "1.10.32" text
    const sectionLink = this.page.locator('a:has-text("1.10.32")');
    await sectionLink.hover();
    await this.waitForElement(this.tooltip);
    const text = await this.getText(this.tooltip);
    await this.clearTooltip(); // Clear after getting text
    return text;
  }

  async getAllTooltipTexts() {
    const tooltips = {};

    // Hover over button and get tooltip
    tooltips.button = await this.hoverOverButton();
    await this.waitForTimeout(1000); // Increased wait between hovers

    // Hover over text field and get tooltip
    tooltips.textField = await this.hoverOverTextField();
    await this.waitForTimeout(1000);

    // Hover over Contrary link and get tooltip
    tooltips.contraryLink = await this.hoverOverContraryLink();
    await this.waitForTimeout(1000);

    // Hover over section link and get tooltip
    tooltips.sectionLink = await this.hoverOverSectionLink();

    return tooltips;
  }

  async validateTooltips() {
    const tooltips = await this.getAllTooltipTexts();

    // Validate expected tooltip texts
    expect(tooltips.button).toBe('You hovered over the Button');
    expect(tooltips.textField).toBe('You hovered over the text field');
    expect(tooltips.contraryLink).toBe('You hovered over the Contrary');
    expect(tooltips.sectionLink).toBe('You hovered over the 1.10.32');

    return tooltips;
  }
}
