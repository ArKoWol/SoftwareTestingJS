export const textBoxTestData = {
  edgeCases: {
    fullName: 'John Doe Smith',
    email: 'john.doe.smith@testmail.com',
    currentAddress: '123 Main Street, New York, NY 10001',
    permanentAddress: '456 Oak Avenue, Los Angeles, CA 90210',
  },

  emptyFields: {
    fullName: '',
    email: '',
    currentAddress: '',
    permanentAddress: '',
  },

  specialCharacters: {
    fullName: 'José María González-López',
    email: 'jose.maria@domain-test.co.uk',
    currentAddress: '123 Main St. Apt 5B, São Paulo, SP 01234-567',
    permanentAddress: '456 Oak Ave. Suite 10C, México D.F., MX 12345',
  },
};
