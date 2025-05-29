export class DataGenerator {
  static generateRandomString(length = 8) {
    return Math.random().toString(36).substring(2, length + 2);
  }

  static generateRandomNumber(min = 1000000000, max = 9999999999) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static generateRandomEmail() {
    const domains = ['example.com', 'test.org', 'demo.net', 'sample.io', 'testing.co'];
    const username = this.generateRandomString(8);
    const domain = domains[Math.floor(Math.random() * domains.length)];
    return `${username}@${domain}`;
  }

  static generateRandomName() {
    const firstNames = ['John', 'Jane', 'Alex', 'Chris', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Robin', 'Drew'];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones',
      'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    ];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return { firstName, lastName };
  }

  static generateRandomAddress() {
    const streetNumbers = Math.floor(Math.random() * 9999) + 1;
    const streetNames = ['Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln', 'Elm Way', 'Maple Dr', 'Park Blvd', 'First St'];
    const cities = ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Clinton', 'Washington', 'Arlington', 'Salem'];
    const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const zipCode = Math.floor(Math.random() * 90000) + 10000;

    return `${streetNumbers} ${streetName}, ${city}, ${state} ${zipCode}`;
  }

  static generateRandomGender() {
    const genders = ['Male', 'Female', 'Other'];
    return genders[Math.floor(Math.random() * genders.length)];
  }

  static generateRandomMobileNumber() {
    // Generate a 10-digit mobile number
    let number = '';
    for (let i = 0; i < 10; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return number;
  }

  static generateRandomFormData() {
    const { firstName, lastName } = this.generateRandomName();
    return {
      firstName,
      lastName,
      email: this.generateRandomEmail(),
      gender: this.generateRandomGender(),
      mobileNumber: this.generateRandomMobileNumber(),
    };
  }

  static generateRandomTextBoxData() {
    const { firstName, lastName } = this.generateRandomName();
    return {
      fullName: `${firstName} ${lastName}`,
      email: this.generateRandomEmail(),
      currentAddress: this.generateRandomAddress(),
      permanentAddress: this.generateRandomAddress(),
    };
  }

  static generateRandomPromptText() {
    const prompts = [
      'TestUser123',
      'RandomPrompt456',
      'AutomatedTest789',
      'PlaywrightTest',
      'E2ETestData',
      'QAAutomation',
      'TestScenario',
    ];
    return prompts[Math.floor(Math.random() * prompts.length)] + Math.floor(Math.random() * 1000);
  }
}
