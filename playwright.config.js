import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: './e2e-tests',
  // Disable global setup in CI for Firefox to prevent conflicts
  globalSetup: !process.env.CI
    ? resolve(__dirname, './e2e-tests/global-setup.js')
    : undefined,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 180000 : 120000, // 3 minutes for CI, 2 minutes locally
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
    actionTimeout: 45000, // Increased for CI
    navigationTimeout: process.env.CI ? 120000 : 60000, // 2 minutes in CI
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
        actionTimeout: process.env.CI ? 90000 : 45000, // 1.5 minutes in CI
        navigationTimeout: process.env.CI ? 180000 : 90000, // 3 minutes in CI
        launchOptions: {
          timeout: process.env.CI ? 300000 : 120000, // 5 minutes for browser launch in CI
          slowMo: process.env.CI ? 1000 : 0, // Add 1s delay between actions in CI
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
            // Additional CI-specific flags
            ...(process.env.CI ? [
              '--disable-gpu',
              '--disable-software-rasterizer',
              '--disable-background-timer-throttling',
              '--disable-renderer-backgrounding',
              '--disable-field-trial-config',
              '--disable-backing-store-limit',
              '--disable-ipc-flooding-protection',
              '--memory-pressure-off',
              '--max_old_space_size=4096',
            ] : []),
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

            // Network timeouts - increased for CI
            'network.http.connection-timeout': process.env.CI ? 180 : 90,
            'network.http.response.timeout': process.env.CI ? 180 : 90,

            // Additional CI optimizations
            ...(process.env.CI ? {
              'browser.sessionstore.interval': 300000,
              'browser.sessionstore.privacy_level': 2,
              'toolkit.cosmeticAnimations.enabled': false,
              'layers.acceleration.disabled': true,
              'gfx.canvas.azure.backends': 'skia',
              'gfx.content.azure.backends': 'skia',
            } : {}),
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
        actionTimeout: process.env.CI ? 90000 : 45000, // 1.5 minutes in CI
        navigationTimeout: process.env.CI ? 180000 : 90000, // 3 minutes in CI
        launchOptions: {
          timeout: process.env.CI ? 300000 : 120000, // 5 minutes for browser launch in CI
          slowMo: process.env.CI ? 1000 : 0, // Add 1s delay between actions in CI
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
            // Additional CI-specific flags
            ...(process.env.CI ? [
              '--disable-gpu',
              '--disable-software-rasterizer',
              '--disable-background-timer-throttling',
              '--disable-renderer-backgrounding',
              '--disable-field-trial-config',
              '--disable-backing-store-limit',
              '--disable-ipc-flooding-protection',
              '--memory-pressure-off',
              '--max_old_space_size=4096',
            ] : []),
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

            // Network timeouts - increased for CI
            'network.http.connection-timeout': process.env.CI ? 180 : 90,
            'network.http.response.timeout': process.env.CI ? 180 : 90,

            // Additional CI optimizations
            ...(process.env.CI ? {
              'browser.sessionstore.interval': 300000,
              'browser.sessionstore.privacy_level': 2,
              'toolkit.cosmeticAnimations.enabled': false,
              'layers.acceleration.disabled': true,
              'gfx.canvas.azure.backends': 'skia',
              'gfx.content.azure.backends': 'skia',
            } : {}),
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
