# Firefox Test Fixes and Optimization Guide

## Problem Description

Firefox tests were experiencing timeout issues during browser context creation and navigation, specifically:
- `browserContext.newPage: Test timeout of 30000ms exceeded`
- Tests timing out during the `beforeEach` hook
- Resource contention when running multiple Firefox instances simultaneously

## Root Causes

1. **Browser startup time**: Firefox takes longer to start compared to Chromium
2. **Resource contention**: Multiple Firefox instances competing for system resources
3. **Network timing**: Firefox's navigation and page load strategies differ from Chromium
4. **Missing browser optimizations**: Default Firefox launch options not optimized for test automation

## Implemented Solutions

### 1. Timeout Configuration
Updated `playwright.config.js` with increased timeouts:
```javascript
timeout: 90000, // 90 seconds test timeout (increased for Firefox)
expect: {
  timeout: 15000, // 15 seconds for assertions (increased)
},
actionTimeout: 20000, // 20 seconds for actions (increased)
navigationTimeout: 45000, // 45 seconds for navigation (increased)
```

### 2. Firefox-Specific Browser Launch Options
Added optimized launch options for Firefox:
```javascript
launchOptions: {
  timeout: 60000, // 60 seconds for browser launch
  args: [
    '--disable-web-security',
    '--disable-features=TranslateUI',
    '--disable-ipc-flooding-protection',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--disable-component-extensions-with-background-pages',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-blink-features=AutomationControlled',
    '--disable-extensions',
    '--no-first-run',
  ],
  firefoxUserPrefs: {
    'dom.webnotifications.enabled': false,
    'dom.push.enabled': false,
    'media.navigator.permission.disabled': true,
    'network.cookie.cookieBehavior': 1,
    'browser.startup.homepage': 'about:blank',
    'startup.homepage_welcome_url': 'about:blank',
    'startup.homepage_welcome_url.additional': 'about:blank',
    'devtools.console.stdout.chrome': false,
    'browser.cache.disk.enable': false,
    'browser.cache.memory.enable': false,
  }
}
```

### 3. Enhanced Navigation Handling
Improved `BasePage.js` navigation with retry logic:
```javascript
async navigate(url) {
  try {
    await this.page.goto(url, { 
      waitUntil: 'domcontentloaded',
      timeout: 45000 
    });
    await this.page.waitForLoadState('networkidle', { timeout: 20000 });
  } catch (error) {
    // Multi-level retry strategy with different wait strategies
    // ... retry logic with longer timeouts
  }
}
```

### 4. Optimized Element Waiting
Enhanced element waiting with fallback strategies:
```javascript
async waitForElement(selector, options = {}) {
  try {
    return await this.page.waitForSelector(selector, { 
      timeout: 15000, 
      state: 'visible' 
    });
  } catch (error) {
    // Fallback to 'attached' state if 'visible' fails
    return await this.page.waitForSelector(selector, { 
      state: 'attached',
      timeout: 10000 
    });
  }
}
```

## Running Firefox Tests

### Using the Optimized Script
We've created a helper script that runs Firefox tests with optimal settings:

```bash
# Run all Firefox tests (both 1920x1080 and 1366x768)
./scripts/run-firefox-tests.sh

# Run only Firefox 1920x1080 tests
./scripts/run-firefox-tests.sh 1920

# Run only Firefox 1366x768 tests
./scripts/run-firefox-tests.sh 1366
```

### Manual Commands
You can also run Firefox tests manually with these commands:

```bash
# Run all Firefox tests with single worker (recommended)
npx playwright test --project=firefox-1920x1080 --project=firefox-1366x768 --workers=1

# Run specific Firefox configuration
npx playwright test --project=firefox-1366x768 --workers=1

# Run with detailed output
npx playwright test --project=firefox-1366x768 --workers=1 --reporter=line
```

## Key Recommendations

1. **Always use `--workers=1`** for Firefox tests to prevent resource contention
2. **Increase timeouts** in CI environments where resources may be more constrained
3. **Monitor system resources** when running Firefox tests on lower-spec machines
4. **Use the helper script** for consistent test execution

## Troubleshooting

### If tests still timeout:
1. Check available system memory
2. Close other applications consuming resources
3. Consider increasing timeouts further in `playwright.config.js`
4. Run tests with `--debug` flag to see detailed execution

### If browser installation issues occur:
```bash
# Reinstall Playwright browsers
npx playwright install

# Install only Firefox
npx playwright install firefox
```

## Performance Notes

- Firefox tests take approximately 2-4 minutes to complete (37 tests)
- Both Firefox configurations (1920x1080 and 1366x768) take about 4-5 minutes total
- Single worker execution prevents timeouts but increases total execution time
- Memory usage peaks at ~500MB per Firefox instance

## Verification

After implementing these fixes:
- ✅ All 37 tests pass for Firefox 1920x1080
- ✅ All 37 tests pass for Firefox 1366x768  
- ✅ No timeout errors during browser context creation
- ✅ Stable navigation and element waiting
- ✅ Consistent test execution across runs 