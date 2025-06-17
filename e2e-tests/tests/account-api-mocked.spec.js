import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

const BASE_URL = 'https://demoqa.com';

test.describe('Account API Tests (Mocked)', () => {
  const password = 'Password@123';

  test.beforeEach(async({ page }) => {
    await page.goto('about:blank');
  });

  test('Positive: Create a user with valid data', async({ page }) => {
    const username = faker.internet.username();
    const userID = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/User`, async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ userID: userID, username: username, books: [] }),
      });
    });

    const response = await page.evaluate(async({ url, username, password }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password: password }),
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/User`, username, password });

    expect(response.status).toBe(201);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty('userID');
    expect(responseBody.username).toBe(username);
  });

  test('Negative: Attempt to create a user with incorrect data (empty password)', async({ page }) => {
    await page.route(`${BASE_URL}/Account/v1/User`, async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ code: '1200', message: 'UserName and Password required.' }),
      });
    });

    const username = faker.internet.username();
    const response = await page.evaluate(async({ url, username }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password: '' }),
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/User`, username });

    expect(response.status).toBe(400);
    const responseBody = response.body;
    expect(responseBody.code).toBe('1200');
    expect(responseBody.message).toBe('UserName and Password required.');
  });

  test('Positive: Generate a token for an existing user', async({ page }) => {
    const username = faker.internet.username();
    const token = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/GenerateToken`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'Success', result: 'User authorized successfully.', token: token }),
      });
    });

    const response = await page.evaluate(async({ url, username, password }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password: password }),
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/GenerateToken`, username, password });

    expect(response.status).toBe(200);
    const responseBody = response.body;
    expect(responseBody.status).toBe('Success');
    expect(responseBody).toHaveProperty('token');
  });

  test('Negative: Attempt to generate a token with an incorrect password', async({ page }) => {
    await page.route(`${BASE_URL}/Account/v1/GenerateToken`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'Failed', result: 'User authorization failed.', token: null }),
      });
    });

    const username = faker.internet.username();
    const response = await page.evaluate(async({ url, username }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password: 'IncorrectPassword' }),
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/GenerateToken`, username });

    expect(response.status).toBe(200);
    const responseBody = response.body;
    expect(responseBody.status).toBe('Failed');
    expect(responseBody.token).toBeNull();
  });

  test('Positive: Get information about an existing user', async({ page }) => {
    const username = faker.internet.username();
    const userID = faker.string.uuid();
    const token = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/User/${userID}`, async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ userId: userID, username: username, books: [] }),
      });
    });

    const response = await page.evaluate(async({ url, token }) => {
      /* global fetch */
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/User/${userID}`, token });

    expect(response.status).toBe(200);
    const responseBody = response.body;
    expect(responseBody.userId).toBe(userID);
    expect(responseBody.username).toBe(username);
  });

  test('Negative: Attempt to get information about a non-existent user', async({ page }) => {
    const nonExistentUUID = faker.string.uuid();
    const token = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/User/${nonExistentUUID}`, async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ code: '1207', message: 'User not found!' }),
      });
    });

    const response = await page.evaluate(async({ url, token }) => {
      /* global fetch */
      const resp = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/User/${nonExistentUUID}`, token });

    expect(response.status).toBe(401);
    const responseBody = response.body;
    expect(responseBody.message).toBe('User not found!');
  });

  test('Positive: Deleting an existing user', async({ page }) => {
    const userID = faker.string.uuid();
    const token = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/User/${userID}`, async route => {
      await route.fulfill({ status: 204 });
    });

    const status = await page.evaluate(async({ url, token }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return resp.status;
    }, { url: `${BASE_URL}/Account/v1/User/${userID}`, token });

    expect(status).toBe(204);
  });

  test('Negative: Attempting to delete a non-existent user', async({ page }) => {
    const nonExistentUUID = faker.string.uuid();
    const token = faker.string.uuid();

    await page.route(`${BASE_URL}/Account/v1/User/${nonExistentUUID}`, async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ code: '1207', message: 'User not found!' }),
      });
    });

    const response = await page.evaluate(async({ url, token }) => {
      /* global fetch */
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await resp.json();
      return { status: resp.status, body };
    }, { url: `${BASE_URL}/Account/v1/User/${nonExistentUUID}`, token });

    expect(response.status).toBe(401);
    const responseBody = response.body;
    expect(responseBody.message).toBe('User not found!');
  });
});
