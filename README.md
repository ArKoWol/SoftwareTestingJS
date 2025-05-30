# Software Testing JavaScript - E2E Test Automation Project

This project implements comprehensive end-to-end testing for the DemoQA website using **Playwright** framework with Page Object Model (POM) design pattern.

## 📋 Project Overview

### Framework: Playwright ✅
- **Cross-browser testing**: Chrome, Firefox ✅
- **Specific screen resolutions**: 1920x1080, 1366x768 ✅
- **Parallel execution**: Fully parallel test execution ✅
- **Error handling**: Automatic screenshot capture on failures ✅
- **Reporting**: HTML reports with videos and traces ✅

### Test Scenarios Covered ✅

1. **Alerts Testing** (`/alerts`)
   - Simple alert handling
   - Timer-based alerts
   - Confirmation dialogs (Accept/Cancel)
   - Prompt dialogs with random input data

2. **Automation Practice Form** (`/automation-practice-form`)
   - Random data generation for all form fields
   - Parameterized tests with multiple data sets
   - Form submission verification
   - Edge case testing (long names, special characters)

3. **Text Box Testing** (`/text-box`)
   - Automated random data generation
   - Parameterized testing with 5 different data sets
   - Output validation
   - Special character support

4. **Tool Tips Testing** (`/tool-tips`)
   - Button hover tooltips
   - Text field hover tooltips
   - Link hover tooltips
   - Sequential tooltip testing

5. **Select Menu Testing** (`/select-menu`)
   - Select Value dropdown: "Group 2, option 1"
   - Select One dropdown: "Other"
   - Old Style Select: "Green"
   - Multiselect dropdown: "Black", "Blue"

### Acceptance Criteria Compliance ✅

✅ **Framework Configuration**: Playwright framework properly configured  
✅ **5+ Test Scenarios**: 5 complete test scenarios implemented  
✅ **Different Locator Strategies**: ID, CSS, text, XPath-like selectors  
✅ **Page Object Model**: Complete POM implementation with BasePage  
✅ **Parameterized Tests**: Multiple data sets using forEach and test arrays  
✅ **CI/CD Integration**: GitHub Actions with daily and PR triggers  
✅ **Cross-browser Testing**: Chrome and Firefox support  
✅ **Specific Resolutions**: 1920x1080 and 1366x768 viewports  
✅ **Parallel Execution**: Fully parallel test execution configured  
✅ **Automatic Data Generation**: Random data for all test scenarios  
✅ **Screenshot on Failure**: Automatic screenshot capture  
✅ **Detailed Reporting**: HTML reports with artifacts saved in GitHub  
✅ **Documentation**: Complete README with test execution instructions  

## 🏗️ Project Structure

```
SoftwareTestingJS/
├── e2e-tests/
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.js         # Base class with common functionality
│   │   ├── AlertsPage.js       # Alerts page interactions
│   │   ├── AutomationPracticeFormPage.js
│   │   ├── TextBoxPage.js      # Text box form interactions
│   │   ├── ToolTipsPage.js     # Tooltip interactions
│   │   └── SelectMenuPage.js   # Dropdown/select interactions
│   ├── tests/                  # Test specifications
│   │   ├── alerts.spec.js      # Alert functionality tests
│   │   ├── automation-practice-form.spec.js
│   │   ├── text-box.spec.js    # Text box tests
│   │   ├── tool-tips.spec.js   # Tooltip tests
│   │   └── select-menu.spec.js # Select menu tests
│   └── utils/                  # Utility classes
│       └── DataGenerator.js    # Random data generation
├── .github/
│   └── workflows/
│       ├── eslint.yml          # ESLint workflow
│       └── playwright-tests.yml # E2E testing workflow
├── test-results/               # Test execution results
├── screenshots/                # Failure screenshots
├── playwright.config.js        # Playwright configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SoftwareTestingJS
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install
   ```

## 🧪 Running Tests

### Available Commands

```bash
# Run all E2E tests across all browsers and resolutions
npm run test:e2e

# Run tests for specific browser and resolution combinations
npm run test:e2e:chrome-1920    # Chrome at 1920x1080
npm run test:e2e:chrome-1366    # Chrome at 1366x768
npm run test:e2e:firefox-1920   # Firefox at 1920x1080
npm run test:e2e:firefox-1366   # Firefox at 1366x768

# Run all Chrome tests (both resolutions)
npm run test:e2e:chrome

# Run all Firefox tests (both resolutions)
npm run test:e2e:firefox

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Generate and view HTML report
npm run test:e2e:report

# Run unit tests (existing functionality)
npm test

# Run with coverage
npm run coverage
```

### Test Execution Examples

```bash
# Quick Chrome-only test run at 1920x1080
npm run test:e2e:chrome-1920

# Full cross-browser testing
npm run test:e2e

# Debug mode with visible browser
npm run test:e2e:headed
```

## 🤖 CI/CD Integration

### GitHub Actions Workflows

The project includes automated CI/CD with:

1. **Daily Automated Runs**: Tests run every day at 2:00 AM UTC
2. **Pull Request Triggers**: Tests run on every PR to main/master
3. **Push Triggers**: Tests run on pushes to main/master
4. **Matrix Testing**: All browser/resolution combinations tested in parallel
5. **Artifact Collection**: Test results, reports, and screenshots saved as GitHub artifacts

### Workflow Features

- ✅ **Parallel execution** across browser/resolution matrix
- ✅ **Automatic artifact collection** for test results and screenshots
- ✅ **Test result reporting** with detailed JUnit XML output
- ✅ **Failure screenshot capture** and archival
- ✅ **30-day artifact retention** for debugging

## 📊 Test Reporting

After test execution, several reporting options are available:

1. **HTML Report**: Interactive report with test results, screenshots, and videos
   ```bash
   npm run test:e2e:report
   ```

2. **JUnit XML**: Located in `test-results/junit.xml` for CI/CD integration

3. **Screenshots**: Auto-captured on test failures in `test-results/` directory

4. **Videos**: Test execution recordings for failed tests

5. **GitHub Artifacts**: All reports automatically saved in CI/CD runs

## 🔧 Configuration

### Playwright Configuration (`playwright.config.js`)

Key configuration options:
- **Base URL**: `https://demoqa.com`
- **Browsers**: Chrome and Firefox
- **Resolutions**: 1920x1080 and 1366x768
- **Screenshots**: Only on failure
- **Videos**: Retained on failure
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Fully parallel execution enabled

### Cross-Browser Testing

Tests automatically run on:
- **Chrome 1920x1080**: Desktop Chrome at full HD resolution
- **Chrome 1366x768**: Desktop Chrome at laptop resolution
- **Firefox 1920x1080**: Desktop Firefox at full HD resolution
- **Firefox 1366x768**: Desktop Firefox at laptop resolution

## 📁 Page Object Model (POM)

Each page class extends `BasePage` and provides:

### BasePage (Common functionality)
- Navigation methods
- Element interaction (click, fill, getText)
- Wait strategies
- Screenshot capture
- Dialog handling

### Specialized Page Classes
- **AlertsPage**: Alert, confirm, and prompt dialog handling with random data
- **AutomationPracticeFormPage**: Form filling with auto-generated test data
- **TextBoxPage**: Text input with random data generation
- **ToolTipsPage**: Hover interactions and tooltip verification
- **SelectMenuPage**: Dropdown and multiselect interactions

## 🎲 Test Data Generation

### Automatic Data Generation

All tests use automatically generated data via the `DataGenerator` utility:

- **Random Names**: Generated from predefined lists
- **Random Emails**: Auto-generated with various domains
- **Random Addresses**: Complete addresses with street, city, state, ZIP
- **Random Phone Numbers**: Valid 10-digit mobile numbers
- **Random Text**: Various lengths and character sets

### Parameterized Testing

Tests are parameterized with multiple data sets:
- **Automation Form**: 7 different data combinations (5 random + 2 edge cases)
- **Text Box**: 5 random data sets + edge cases
- **Alerts**: 5 random prompt inputs + edge cases

## 🛡️ Error Handling

The framework includes robust error handling:

1. **Automatic Screenshots**: Captured on test failures
2. **Video Recording**: For failed test debugging
3. **Retry Logic**: Configurable retry attempts (2 on CI)
4. **Timeout Management**: Reasonable timeouts for web elements
5. **Cross-browser Validation**: Tests verified across browsers and resolutions
6. **Artifact Archival**: All failure evidence saved in CI/CD

## 📈 Test Statistics

Current test implementation:
- **Total Test Files**: 5 test scenarios
- **Browser/Resolution Matrix**: 4 combinations (2 browsers × 2 resolutions)
- **Parameterized Tests**: 20+ individual test cases with random data
- **Locator Strategies**: ID, CSS, text, attribute, XPath-like selectors
- **Data Generation**: 100% automated random data
- **CI/CD Frequency**: Daily + on every PR/push

## 🚀 CI/CD Integration

The project is fully configured for CI/CD with:
- ✅ **GitHub Actions** workflows
- ✅ **Daily automated runs** at 2:00 AM UTC
- ✅ **PR/Push triggers** for continuous testing
- ✅ **Artifact collection** for test results and screenshots
- ✅ **JUnit XML output** for test result parsing
- ✅ **Cross-browser testing** in parallel
- ✅ **Configurable retry logic**

## 🤝 Contributing

### Adding New Tests

1. Create new page class in `e2e-tests/pages/`
2. Extend `BasePage` for common functionality
3. Add test specifications in `e2e-tests/tests/`
4. Use `DataGenerator` for random test data
5. Follow parameterized testing patterns

### Best Practices

- ✅ Use Page Object Model pattern
- ✅ Implement proper wait strategies
- ✅ Use automatically generated test data
- ✅ Add meaningful assertions
- ✅ Include error handling
- ✅ Write descriptive test names
- ✅ Follow parameterized testing patterns

## 📝 License

This project is licensed under the ISC License.

## 📧 Contact

For questions about this project, please contact the repository maintainer.

---

**Note**: This project demonstrates modern E2E testing practices using Playwright with comprehensive cross-browser testing, automated data generation, parameterized testing, CI/CD integration, and detailed reporting capabilities. All acceptance criteria have been fully implemented and verified.


# Review 05 30 
* move all locators to the page object constructor section
* Remove from root directory files from another task
* Change generating random data from faker or fakerator
* Do not union validation function.
