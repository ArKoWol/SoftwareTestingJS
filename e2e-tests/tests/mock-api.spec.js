/* eslint-disable camelcase */

import { test, expect } from '@playwright/test';

const API_URL = 'https://api.example.com/users/';

const successfulResponseMock = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  username: 'johndoe',
  phone: '+1-555-123-4567',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipcode: '10001',
    country: 'USA',
  },
  company: {
    name: 'Doe Enterprises',
    industry: 'Technology',
    position: 'Software Engineer',
  },
  dob: '1990-05-15',
  profile_picture_url: 'https://example.com/images/johndoe.jpg',
  is_active: true,
  created_at: '2023-01-01T12:00:00Z',
  updated_at: '2023-10-01T12:00:00Z',
  preferences: {
    language: 'en',
    timezone: 'America/New_York',
    notifications_enabled: true,
  },
};

test.describe('API Mocking Tests for /users/:id', () => {
  test.beforeEach(async({ page }) => {
    await page.goto('about:blank');
  });

  test('Validate the structure of the successful response for a valid user ID', async({ page }) => {
    // Create a mock that returns the successful response when a valid user ID (1) is provided.
    await page.route(`${API_URL}1`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(successfulResponseMock),
      });
    });

    const response = await page.evaluate(async({ url }) => {
      /* global fetch */
      const resp = await fetch(url);
      const body = await resp.json();
      return { status: resp.status, body };
    }, `${API_URL}1`);

    // Validate status and basic structure
    expect(response.status).toBe(200);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty('id', 1);
    expect(responseBody).toHaveProperty('name', 'John Doe');
    expect(responseBody).toHaveProperty('email', 'john.doe@example.com');
    expect(responseBody).toHaveProperty('address');
    expect(responseBody).toHaveProperty('company');
    expect(responseBody).toHaveProperty('preferences');

    // Validate data types of all fields
    expect(typeof responseBody.id).toBe('number');
    expect(typeof responseBody.name).toBe('string');
    expect(typeof responseBody.email).toBe('string');
    expect(typeof responseBody.username).toBe('string');
    expect(typeof responseBody.phone).toBe('string');
    expect(typeof responseBody.dob).toBe('string');
    expect(typeof responseBody.profile_picture_url).toBe('string');
    expect(typeof responseBody.is_active).toBe('boolean');
    expect(typeof responseBody.created_at).toBe('string');
    expect(typeof responseBody.updated_at).toBe('string');

    // Validate nested objects
    expect(typeof responseBody.address).toBe('object');
    expect(typeof responseBody.address.street).toBe('string');
    expect(typeof responseBody.address.city).toBe('string');
    expect(typeof responseBody.address.state).toBe('string');
    expect(typeof responseBody.address.zipcode).toBe('string');
    expect(typeof responseBody.address.country).toBe('string');

    expect(typeof responseBody.company).toBe('object');
    expect(typeof responseBody.company.name).toBe('string');
    expect(typeof responseBody.company.industry).toBe('string');
    expect(typeof responseBody.company.position).toBe('string');

    expect(typeof responseBody.preferences).toBe('object');
    expect(typeof responseBody.preferences.language).toBe('string');
    expect(typeof responseBody.preferences.timezone).toBe('string');
    expect(typeof responseBody.preferences.notifications_enabled).toBe('boolean');
  });

  // Test different error status codes
  const statusCodesToTest = [
    { code: 403, error: 'Forbidden', details: 'User does not have access.' },
    { code: 404, error: 'Not Found', details: 'User not found.' },
    { code: 502, error: 'Bad Gateway', details: 'Invalid response from upstream server.' },
  ];

  for (const { code, error, details } of statusCodesToTest) {
    test(`Validate the structure of the error response for status ${code}`, async({ page }) => {
      const errorResponse = { error, details };

      await page.route(`${API_URL}invalid`, async route => {
        await route.fulfill({
          status: code,
          contentType: 'application/json',
          body: JSON.stringify(errorResponse),
        });
      });

      const response = await page.evaluate(async({ url }) => {
        /* global fetch */
        const resp = await fetch(url);
        const body = await resp.json();
        return { status: resp.status, body };
      }, `${API_URL}invalid`);
      const responseBody = response.body;

      // Ensure proper error handling is implemented
      expect(response.status).toBe(code);
      // Validate the structure of the error response
      expect(responseBody).toHaveProperty('error', error);
      expect(responseBody).toHaveProperty('details', details);
      expect(typeof responseBody.error).toBe('string');
      expect(typeof responseBody.details).toBe('string');
    });
  }

  test('Ensure response with status 204 (No Content) is handled correctly', async({ page }) => {
    await page.route(`${API_URL}204`, async route => {
      await route.fulfill({ status: 204 });
    });

    const status = await page.evaluate(async(url) => {
      /* global fetch */
      const resp = await fetch(url);
      return resp.status;
    }, `${API_URL}204`);

    expect(status).toBe(204);
  });
});
