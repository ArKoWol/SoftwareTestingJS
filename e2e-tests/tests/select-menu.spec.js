import { test, expect } from '@playwright/test';
import { SelectMenuPage } from '../pages/SelectMenuPage.js';

test.describe('Select Menu Tests', () => {
  let selectMenuPage;

  test.beforeEach(async({ page }) => {
    selectMenuPage = new SelectMenuPage(page);
    await selectMenuPage.navigateToSelectMenuPage();
  });

  test('Should select Group 2, option 1 from Select Value dropdown', async() => {
    await selectMenuPage.selectValueGroup2Option1();

    // Verify the selection is maintained
    const selectedText = await selectMenuPage.page.locator(selectMenuPage.selectValueDropdown).textContent();
    expect(selectedText.includes('Group 2, option 1')).toBe(true);
  });

  test('Should select Other from Select One dropdown', async() => {
    await selectMenuPage.selectOneOther();

    // Verify the selection is maintained
    const selectedText = await selectMenuPage.page.locator(selectMenuPage.selectOneDropdown).textContent();
    expect(selectedText.includes('Other')).toBe(true);
  });

  test('Should select Green from Old Style Select Menu', async() => {
    await selectMenuPage.selectOldStyleGreen();

    // Verify the selection is maintained - check text instead of value
    const selectedText = await selectMenuPage.page
      .locator(`${selectMenuPage.oldStyleSelect} option:checked`)
      .textContent();
    expect(selectedText).toBe('Green');
  });

  test('Should select Black and Blue from Multiselect dropdown', async() => {
    await selectMenuPage.selectMultiselectBlackBlue();

    // The validation is already done inside the selectMultiselectBlackBlue method
    // No need for additional verification here as the method includes assertions
  });

  test('Should select Group 2, option 1 from Select Value dropdown in combined scenario', async() => {
    await selectMenuPage.selectValueGroup2Option1();

    // Validate Select Value dropdown selection
    const selectValueText = await selectMenuPage.page
      .locator(selectMenuPage.selectValueDropdown).textContent();
    expect(selectValueText.includes('Group 2, option 1')).toBe(true);
  });

  test('Should select Other from Select One dropdown in combined scenario', async() => {
    await selectMenuPage.selectOneOther();

    // Validate Select One dropdown selection
    const selectOneText = await selectMenuPage.page.locator(selectMenuPage.selectOneDropdown).textContent();
    expect(selectOneText.includes('Other')).toBe(true);
  });

  test('Should select Green from Old Style Select Menu in combined scenario', async() => {
    await selectMenuPage.selectOldStyleGreen();

    // Validate Old Style Select selection
    const oldStyleText = await selectMenuPage.page
      .locator(`${selectMenuPage.oldStyleSelect} option:checked`).textContent();
    expect(oldStyleText).toBe('Green');
  });

  test('Should select Black and Blue from Multiselect dropdown in combined scenario', async() => {
    await selectMenuPage.selectMultiselectBlackBlue();

    // Validate Multiselect selection
    const multiselectContainer = selectMenuPage.page.locator(selectMenuPage.multiselectContainer).last();
    const blackExists = await multiselectContainer
      .locator(selectMenuPage.selectedValueContainer, { hasText: 'Black' }).count() > 0;
    const blueExists = await multiselectContainer
      .locator(selectMenuPage.selectedValueContainer, { hasText: 'Blue' }).count() > 0;

    expect(blackExists).toBe(true);
    expect(blueExists).toBe(true);
  });

  test('Should handle dropdown interactions without conflicts', async() => {
    // Test that multiple dropdown interactions don't interfere with each other

    // Select from first dropdown
    await selectMenuPage.selectValueGroup2Option1();
    await selectMenuPage.page.waitForTimeout(500);

    // Select from second dropdown
    await selectMenuPage.selectOneOther();
    await selectMenuPage.page.waitForTimeout(500);

    // Verify first selection is still maintained
    const selectValueText = await selectMenuPage.page.locator(selectMenuPage.selectValueDropdown).textContent();
    expect(selectValueText.includes('Group 2, option 1')).toBe(true);

    // Verify second selection is correct
    const selectOneText = await selectMenuPage.page.locator(selectMenuPage.selectOneDropdown).textContent();
    expect(selectOneText.includes('Other')).toBe(true);
  });
});
