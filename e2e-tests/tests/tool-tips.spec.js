import { test, expect } from '@playwright/test';
import { ToolTipsPage } from '../pages/ToolTipsPage.js';

test.describe('Tool Tips Tests', () => {
  let toolTipsPage;

  test.beforeEach(async({ page }) => {
    toolTipsPage = new ToolTipsPage(page);
    await toolTipsPage.navigateToToolTipsPage();
  });

  test('Should display tooltip when hovering over button', async() => {
    const tooltipText = await toolTipsPage.hoverOverButton();
    expect(tooltipText).toBe('You hovered over the Button');
  });

  test('Should display tooltip when hovering over text field', async() => {
    const tooltipText = await toolTipsPage.hoverOverTextField();
    expect(tooltipText).toBe('You hovered over the text field');
  });

  test('Should display tooltip when hovering over Contrary link', async() => {
    const tooltipText = await toolTipsPage.hoverOverContraryLink();
    expect(tooltipText).toBe('You hovered over the Contrary');
  });

  test('Should display tooltip when hovering over section link', async() => {
    const tooltipText = await toolTipsPage.hoverOverSectionLink();
    expect(tooltipText).toBe('You hovered over the 1.10.32');
  });

  test('Should check text on all tooltips', async() => {
    const allTooltips = await toolTipsPage.validateTooltips();

    // Verify all tooltip texts are correct
    expect(allTooltips.button).toBe('You hovered over the Button');
    expect(allTooltips.textField).toBe('You hovered over the text field');
    expect(allTooltips.contraryLink).toBe('You hovered over the Contrary');
    expect(allTooltips.sectionLink).toBe('You hovered over the 1.10.32');
  });

  test('Should display tooltips sequentially without interference', async() => {
    // Test tooltips in sequence to ensure they don't interfere with each other

    // First tooltip
    const buttonTooltip = await toolTipsPage.hoverOverButton();
    expect(buttonTooltip).toBe('You hovered over the Button');

    // Move away and hover over text field
    await toolTipsPage.page.hover('body');
    await toolTipsPage.waitForTimeout(500);

    const textFieldTooltip = await toolTipsPage.hoverOverTextField();
    expect(textFieldTooltip).toBe('You hovered over the text field');

    // Move away and hover over Contrary link
    await toolTipsPage.page.hover('body');
    await toolTipsPage.waitForTimeout(500);

    const contraryTooltip = await toolTipsPage.hoverOverContraryLink();
    expect(contraryTooltip).toBe('You hovered over the Contrary');

    // Move away and hover over section link
    await toolTipsPage.page.hover('body');
    await toolTipsPage.waitForTimeout(500);

    const sectionTooltip = await toolTipsPage.hoverOverSectionLink();
    expect(sectionTooltip).toBe('You hovered over the 1.10.32');
  });
});
