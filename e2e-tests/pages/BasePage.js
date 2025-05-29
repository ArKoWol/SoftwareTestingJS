export class BasePage {
  constructor(page) {
    this.page = page;
    this.setupAdBlocking();
    this.isFirefox = page.context().browser().browserType().name() === 'firefox';
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
    const maxRetries = this.isFirefox ? 4 : 2;
    const baseTimeout = this.isFirefox ? 60000 : 45000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // eslint-disable-next-line no-console
        console.log(`Navigation attempt ${attempt}/${maxRetries} to ${url}`);

        // If URL is relative, it will use baseURL from config
        await this.page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: baseTimeout + (attempt * 15000), // Increasing timeout with each attempt
        });

        // Additional wait to ensure page is fully loaded
        await this.page.waitForLoadState('networkidle', {
          timeout: this.isFirefox ? 30000 : 20000,
        });

        // For Firefox, add extra stability wait
        if (this.isFirefox) {
          await this.page.waitForTimeout(1000);
        }

        // eslint-disable-next-line no-console
        console.log(`Navigation to ${url} successful on attempt ${attempt}`);
        return; // Success, exit retry loop

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Navigation attempt ${attempt} failed: ${error.message}`);

        if (attempt === maxRetries) {
          throw new Error(`Navigation to ${url} failed after ${maxRetries} attempts: ${error.message}`);
        }

        // Progressive retry strategy
        try {
          const waitStrategy = attempt === 1 ? 'load' :
            attempt === 2 ? 'domcontentloaded' : 'commit';

          await this.page.goto(url, {
            waitUntil: waitStrategy,
            timeout: baseTimeout + (attempt * 20000),
          });

          // eslint-disable-next-line no-console
          console.log(`Retry navigation to ${url} successful with ${waitStrategy} strategy`);
          return;

        } catch (retryError) {
          // eslint-disable-next-line no-console
          console.log(`Retry ${attempt} failed: ${retryError.message}`);

          // Wait before next attempt
          await this.page.waitForTimeout(2000 * attempt);
        }
      }
    }
  }

  async waitForElement(selector, options = {}) {
    const defaultOptions = {
      timeout: this.isFirefox ? 25000 : 15000,
      state: 'visible',
    };

    const maxRetries = this.isFirefox ? 3 : 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // eslint-disable-next-line no-console
        console.log(`Waiting for element ${selector}, attempt ${attempt}/${maxRetries}`);

        const element = await this.page.waitForSelector(selector, {
          ...defaultOptions,
          ...options,
          timeout: defaultOptions.timeout + (attempt * 5000),
        });

        // For Firefox, ensure element is really ready
        if (this.isFirefox && element) {
          await this.page.waitForTimeout(500);
          // Double-check element is still visible
          const isVisible = await element.isVisible();
          if (!isVisible) {
            throw new Error(`Element ${selector} became invisible`);
          }
        }

        return element;

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Element ${selector} not found on attempt ${attempt}: ${error.message}`);

        if (attempt === maxRetries) {
          throw new Error(`Element ${selector} not found after ${maxRetries} attempts`);
        }

        // Progressive fallback strategies
        try {
          const fallbackState = attempt === 1 ? 'attached' : 'hidden';
          const fallbackTimeout = this.isFirefox ? 15000 : 10000;

          // eslint-disable-next-line no-console
          console.log(`Trying fallback strategy for ${selector} with state: ${fallbackState}`);

          const element = await this.page.waitForSelector(selector, {
            ...defaultOptions,
            ...options,
            state: fallbackState,
            timeout: fallbackTimeout,
          });

          return element;

        } catch (fallbackError) {
          // eslint-disable-next-line no-console
          console.log(`Fallback strategy failed for ${selector}: ${fallbackError.message}`);

          // Wait before next attempt
          await this.page.waitForTimeout(1000 * attempt);
        }
      }
    }

    // This should never be reached, but satisfies ESLint's consistent-return rule
    throw new Error(`Element ${selector} not found after all retry attempts`);
  }

  async click(selector, options = {}) {
    // Wait for element to be attached to DOM
    await this.waitForElement(selector, { state: 'attached' });

    const maxRetries = this.isFirefox ? 3 : 2;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // For Firefox, add small delay before clicking
        if (this.isFirefox) {
          await this.page.waitForTimeout(300);
        }

        await this.page.click(selector, {
          timeout: this.isFirefox ? 10000 : 5000,
          ...options,
        });
        return; // Success

      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Click attempt ${attempt} failed for ${selector}: ${error.message}`);

        if (attempt === maxRetries) {
          throw error;
        }

        // Progressive click strategies
        try {
          if (error.message.includes('intercepts pointer events')) {
            // If ad is intercepting, try force click
            await this.page.click(selector, { force: true, ...options });
            return;
          }
          // Try locator click with force
          await this.page.locator(selector).click({
            force: true,
            timeout: this.isFirefox ? 10000 : 5000,
            ...options,
          });
          return;

        } catch (retryError) {
          // eslint-disable-next-line no-console
          console.log(`Click retry ${attempt} failed: ${retryError.message}`);
          await this.page.waitForTimeout(500 * attempt);
        }
      }
    }
  }

  async fill(selector, text) {
    await this.waitForElement(selector, { state: 'attached' });

    // For Firefox, clear field first and add delay
    if (this.isFirefox) {
      await this.page.fill(selector, '');
      await this.page.waitForTimeout(200);
    }

    await this.page.fill(selector, text);

    // For Firefox, verify the text was filled
    if (this.isFirefox) {
      await this.page.waitForTimeout(200);
      const value = await this.page.inputValue(selector);
      if (value !== text) {
        // eslint-disable-next-line no-console
        console.log(`Text verification failed for ${selector}, retrying...`);
        await this.page.fill(selector, text);
      }
    }
  }

  async getText(selector) {
    await this.waitForElement(selector);
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    try {
      return await this.page.isVisible(selector);
    } catch {
      return false;
    }
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
