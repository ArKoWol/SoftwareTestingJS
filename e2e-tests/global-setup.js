// global-setup.js
import { firefox } from '@playwright/test';

async function globalSetup() {
  // eslint-disable-next-line no-console
  console.log('🔧 Starting global setup...');

  // For CI environments, warm up Firefox to reduce startup time
  // Skip warmup if not running Firefox tests specifically
  if (process.env.CI && process.env.PROJECT_NAME?.includes('firefox')) {
    // eslint-disable-next-line no-console
    console.log('🔥 Warming up Firefox for CI environment...');

    try {
      // Timeout the warmup process to prevent hanging
      const warmupPromise = warmupFirefox();
      const timeoutPromise = new Promise((_, reject) =>
        // eslint-disable-next-line no-undef
        setTimeout(() => reject(new Error('Warmup timeout')), 30000),
      );

      await Promise.race([warmupPromise, timeoutPromise]);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('⚠️ Firefox warmup failed, continuing anyway:', error.message);
    }
  } else if (process.env.CI) {
    // eslint-disable-next-line no-console
    console.log('⏩ Skipping Firefox warmup for non-Firefox projects');
  }

  // eslint-disable-next-line no-console
  console.log('✅ Global setup completed');
}

async function warmupFirefox() {
  const browser = await firefox.launch({
    timeout: 60000, // Reduced timeout for CI
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security',
      '--disable-features=TranslateUI',
      '--disable-extensions',
      '--no-first-run',
      '--disable-default-apps',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
    ],
    firefoxUserPrefs: {
      'dom.webnotifications.enabled': false,
      'dom.push.enabled': false,
      'media.navigator.permission.disabled': true,
      'geo.enabled': false,
      'network.cookie.cookieBehavior': 1,
      'privacy.trackingprotection.enabled': false,
      'browser.startup.homepage': 'about:blank',
      'startup.homepage_welcome_url': 'about:blank',
      'startup.homepage_welcome_url.additional': 'about:blank',
      'browser.startup.firstrunSkipsHomepage': true,
      'devtools.console.stdout.chrome': false,
      'devtools.debugger.remote-enabled': false,
      'browser.cache.disk.enable': false,
      'browser.cache.memory.enable': false,
      'browser.cache.offline.enable': false,
      'network.http.use-cache': false,
      'browser.download.manager.showWhenStarting': false,
      'browser.download.animateNotifications': false,
      'security.tls.insecure_fallback_hosts': 'demoqa.com',
      'dom.max_script_run_time': 0,
      'dom.max_chrome_script_run_time': 0,
      'browser.tabs.animate': false,
      'browser.fullscreen.animate': false,
      'network.http.connection-timeout': 90,
      'network.http.response.timeout': 90,
    },
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  const page = await context.newPage();

  // Quick test navigation
  await page.goto('about:blank', { timeout: 15000 });
  // eslint-disable-next-line no-console
  console.log('✅ Firefox warmup successful');

  await page.close();
  await context.close();
  await browser.close();
}

export default globalSetup;
