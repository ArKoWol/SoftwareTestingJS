export class BasePage {
  constructor(page) {
    this.page = page;
    this.setupAdBlocking();
  }

  async setupAdBlocking() {
    // Block ads and tracking domains
    await this.page.route('**/*', route => {
      const url = route.request().url();
      if (url.includes('googlesyndication.com') ||
          url.includes('googletagmanager.com') ||
          url.includes('doubleclick.net') ||
          url.includes('googletagservices.com') ||
          url.includes('google-analytics.com') ||
          url.includes('facebook.com/tr') ||
          url.includes('ads')) {
        route.abort();
      } else {
        route.continue();
      }
    });
  }

  async navigate(url) {
    await this.page.goto(url);
  }

  async waitForElement(selector, options = {}) {
    return await this.page.waitForSelector(selector, options);
  }

  async click(selector, options = {}) {
    // Wait for element to be attached to DOM
    await this.page.waitForSelector(selector, { state: 'attached' });

    // Try multiple click strategies
    try {
      // First try regular click
      await this.page.click(selector, { timeout: 5000, ...options });
    } catch (error) {
      if (error.message.includes('intercepts pointer events')) {
        // If ad is intercepting, try force click
        await this.page.click(selector, { force: true, ...options });
      } else {
        // If still failing, try locator click
        await this.page.locator(selector).click({ force: true, ...options });
      }
    }
  }

  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async waitForTimeout(timeout) {
    await this.page.waitForTimeout(timeout);
  }

  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  async handleDialog(action = 'accept', promptText = '') {
    this.page.on('dialog', async dialog => {
      if (action === 'accept') {
        await dialog.accept(promptText);
      } else {
        await dialog.dismiss();
      }
    });
  }
}
