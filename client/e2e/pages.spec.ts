import { expect, test } from '@playwright/test';

test('Sign Up', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByRole('link', { name: 'Sign up' }).click();
  await expect(page).toHaveURL('http://localhost:3000/sign-up');

  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@doe.com');
  await page.getByLabel('Password', { exact: true }).fill('Password123!');
  await page.getByLabel('Confirm Password', { exact: true }).fill('Password123!');
  await page.getByRole('button', { name: /sign up/i }).click();
});

test('Sign In', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-in');

  await page.getByLabel('Email').fill('john@doe.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('http://localhost:3000/');
});

test('Sign In Error', async ({ page }) => {
  await page.route('**/api/auth/signin', route => route.fulfill({ status: 401 }));

  await page.goto('http://localhost:3000/sign-in');

  await page.getByLabel('Email').fill('john@doe.com');
  await page.getByLabel('Password').fill('Adjasd234s@');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page.getByText('Invalid email or password')).toBeVisible();
});

test('Sign in and access user profile', async ({ page }) => {
  await page.goto('http://localhost:3000/sign-in');

  await page.getByLabel('Email').fill('john@doe.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: /sign in/i }).click();

  await expect(page).toHaveURL('http://localhost:3000/');

  await page.getByRole('button', { name: 'User Menu' }).click();
  await page.getByRole('menuitem', { name: 'View Profile' }).click();

  await expect(page).toHaveURL('http://localhost:3000/user');
  await expect(page.getByText('John Doe')).toBeVisible();

  await page.getByRole('button', { name: 'Favorites' }).click();
  await expect(page).toHaveURL('http://localhost:3000/entries/favorites');
  await expect(page.getByText('User Favorites Words')).toBeVisible();
  await page.getByRole('button', { name: 'Back' }).click();
  await expect(page).toHaveURL('http://localhost:3000/user');

  await page.getByRole('button', { name: 'History' }).click();
  await expect(page).toHaveURL('http://localhost:3000/entries/history');
});
