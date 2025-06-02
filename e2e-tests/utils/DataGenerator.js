import { faker } from '@faker-js/faker';

export class DataGenerator {
  static generateRandomString(length = 8) {
    return faker.string.alphanumeric(length);
  }

  static generateRandomNumber(min = 1000000000, max = 9999999999) {
    return faker.number.int({ min, max });
  }

  static generateRandomEmail() {
    return faker.internet.email();
  }

  static generateRandomName() {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return { firstName, lastName };
  }

  static generateRandomAddress() {
    return faker.location.streetAddress({ useFullAddress: true });
  }

  static generateRandomGender() {
    const genders = ['Male', 'Female', 'Other'];
    return faker.helpers.arrayElement(genders);
  }

  static generateRandomMobileNumber() {
    const number = faker.number.int({ min: 1000000000, max: 9999999999 });
    return number.toString();
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
    const baseText = faker.lorem.word();
    const number = faker.number.int({ min: 100, max: 999 });
    return `${baseText}${number}`;
  }
}
