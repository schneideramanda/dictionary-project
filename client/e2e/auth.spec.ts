import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TEST_USER_PATH = path.join(__dirname, '..', '.auth', 'test-user.json');

function readTestUser() {
  return JSON.parse(fs.readFileSync(TEST_USER_PATH, 'utf-8')) as {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
}

test.describe('Sign up flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // start logged out

  test('a new user can sign up and lands on the homepage authenticated', async ({ page }) => {
    const stamp = Date.now();
    const email = `signup-flow-${stamp}@example.com`;

    await page.goto('/sign-up');

    await page.getByLabel('Name').fill('New Signup User');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm Password').fill('Password123!');

    const signUpButton = page.getByRole('button', { name: /sign up/i });
    await expect(signUpButton).toBeEnabled();
    await signUpButton.click();

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');

    const cookies = await page.context().cookies();
    expect(cookies.some(c => c.name === 'jwt' /* TODO: JWT_COOKIE_NAME */)).toBe(true);
  });

  test('mismatched passwords keep the submit button disabled', async ({ page }) => {
    await page.goto('/sign-up');

    await page.getByLabel('Name').fill('Mismatch User');
    await page.getByLabel('Email').fill('mismatch@example.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm Password').fill('DifferentPassword!');
    await page.getByLabel('Confirm Password').blur();

    await expect(page.getByRole('button', { name: /sign up/i })).toBeDisabled();
  });

  test('signing up with an already-registered email shows an error toast', async ({ page }) => {
    const testUser = readTestUser(); // already created in global-setup

    await page.goto('/sign-up');

    await page.getByLabel('Name').fill('Duplicate User');
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password', { exact: true }).fill(testUser.password);
    await page.getByLabel('Confirm Password').fill(testUser.confirmPassword);

    const signUpButton = page.getByRole('button', { name: /sign up/i });
    await expect(signUpButton).toBeEnabled();
    await signUpButton.click();

    await expect(page.getByText(/already exists/i)).toBeVisible();
  });
});

test.describe('Sign in flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('user can sign in with the global-setup test user', async ({ page }) => {
    const testUser = readTestUser();

    await page.goto('/sign-in');

    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);

    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });

  test('invalid credentials show an error toast and stay on sign-in', async ({ page }) => {
    await page.goto('/sign-in');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');

    const signInButton = page.getByRole('button', { name: /sign in/i });
    await expect(signInButton).toBeEnabled();
    await signInButton.click();

    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });
});
