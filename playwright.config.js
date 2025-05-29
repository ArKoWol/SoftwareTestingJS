import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: './e2e-tests',
  globalSetup: process.env.CI && process.env.PROJECT_NAME?.includes('firefox')
    ? resolve(__dirname, './e2e-tests/global-setup.js')
    : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 150000 : 120000, // 2.5 minutes for CI, 2 minutes locally
  expect: {
    timeout: 20000, // 20 seconds for assertions
  },
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  use: {
    baseURL: 'https://demoqa.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000, // 30 seconds for actions
    navigationTimeout: process.env.CI ? 90000 : 60000, // Longer in CI
    launchOptions: {
      args: [
        '--disable-web-security',
        '--disable-features=TranslateUI',
        '--disable-ipc-flooding-protection',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-component-extensions-with-background-pages',
      ],
    },
  },

  projects: [
    {
      name: 'chromium-1920x1080',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: 'chromium-1366x768',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: 'firefox-1920x1080',
      metadata: {
        platform: 'firefox',
      },
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 },
        actionTimeout: 45000, // Firefox-specific longer action timeout
        navigationTimeout: 90000, // Firefox-specific longer navigation timeout
        launchOptions: {
          timeout: 120000, // 2 minutes for browser launch in CI
          slowMo: process.env.CI ? 500 : 0, // Add delay between actions in CI
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-component-extensions-with-background-pages',
            '--disable-blink-features=AutomationControlled',
            '--disable-extensions',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--mute-audio',
            '--disable-background-networking',
            '--disable-background-downloads',
          ],
          firefoxUserPrefs: {
            // Disable notifications and permissions
            'dom.webnotifications.enabled': false,
            'dom.push.enabled': false,
            'media.navigator.permission.disabled': true,
            'geo.enabled': false,

            // Cookie and tracking settings
            'network.cookie.cookieBehavior': 1,
            'privacy.trackingprotection.enabled': false,

            // Startup and homepage settings
            'browser.startup.homepage': 'about:blank',
            'startup.homepage_welcome_url': 'about:blank',
            'startup.homepage_welcome_url.additional': 'about:blank',
            'browser.startup.firstrunSkipsHomepage': true,

            // Disable console and dev tools
            'devtools.console.stdout.chrome': false,
            'devtools.debugger.remote-enabled': false,

            // Cache and performance settings
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false,
            'browser.cache.offline.enable': false,
            'network.http.use-cache': false,

            // Security and download settings
            'browser.download.manager.showWhenStarting': false,
            'browser.download.animateNotifications': false,
            'security.tls.insecure_fallback_hosts': 'demoqa.com',

            // Performance optimizations
            'dom.max_script_run_time': 0,
            'dom.max_chrome_script_run_time': 0,
            'browser.tabs.animate': false,
            'browser.fullscreen.animate': false,

            // Network timeouts
            'network.http.connection-timeout': 90,
            'network.http.response.timeout': 90,
          },
        },
      },
    },
    {
      name: 'firefox-1366x768',
      metadata: {
        platform: 'firefox',
      },
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 1366, height: 768 },
        actionTimeout: 45000, // Firefox-specific longer action timeout
        navigationTimeout: 90000, // Firefox-specific longer navigation timeout
        launchOptions: {
          timeout: 120000, // 2 minutes for browser launch in CI
          slowMo: process.env.CI ? 500 : 0, // Add delay between actions in CI
          args: [
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-web-security',
            '--disable-features=TranslateUI',
            '--disable-ipc-flooding-protection',
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-component-extensions-with-background-pages',
            '--disable-blink-features=AutomationControlled',
            '--disable-extensions',
            '--no-first-run',
            '--disable-default-apps',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--mute-audio',
            '--disable-background-networking',
            '--disable-background-downloads',
          ],
          firefoxUserPrefs: {
            // Disable notifications and permissions
            'dom.webnotifications.enabled': false,
            'dom.push.enabled': false,
            'media.navigator.permission.disabled': true,
            'geo.enabled': false,

            // Cookie and tracking settings
            'network.cookie.cookieBehavior': 1,
            'privacy.trackingprotection.enabled': false,

            // Startup and homepage settings
            'browser.startup.homepage': 'about:blank',
            'startup.homepage_welcome_url': 'about:blank',
            'startup.homepage_welcome_url.additional': 'about:blank',
            'browser.startup.firstrunSkipsHomepage': true,

            // Disable console and dev tools
            'devtools.console.stdout.chrome': false,
            'devtools.debugger.remote-enabled': false,

            // Cache and performance settings
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false,
            'browser.cache.offline.enable': false,
            'network.http.use-cache': false,

            // Security and download settings
            'browser.download.manager.showWhenStarting': false,
            'browser.download.animateNotifications': false,
            'security.tls.insecure_fallback_hosts': 'demoqa.com',

            // Performance optimizations
            'dom.max_script_run_time': 0,
            'dom.max_chrome_script_run_time': 0,
            'browser.tabs.animate': false,
            'browser.fullscreen.animate': false,

            // Network timeouts
            'network.http.connection-timeout': 90,
            'network.http.response.timeout': 90,
          },
        },
      },
    },
  ],

  webServer: {
    command: 'echo "Using external server"',
    url: 'https://demoqa.com',
    reuseExistingServer: true,
  },
});
