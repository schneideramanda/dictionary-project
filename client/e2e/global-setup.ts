import { chromium, expect, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const AUTH_DIR = path.join(__dirname, '..', '.auth');
const STORAGE_STATE_PATH = path.join(AUTH_DIR, 'user.json');
const TEST_USER_PATH = path.join(AUTH_DIR, 'test-user.json');

function buildTestUser() {
  const stamp = Date.now();
  return {
    name: 'E2E Test User',
    email: `e2e-test-${stamp}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };
}

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  if (!baseURL) {
    throw new Error('baseURL is not configured in playwright.config.ts');
  }

  fs.mkdirSync(AUTH_DIR, { recursive: true });

  const testUser = buildTestUser();
  fs.writeFileSync(TEST_USER_PATH, JSON.stringify(testUser, null, 2));

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  await page.goto('/sign-up');

  await page.getByLabel('Name').fill(testUser.name);
  await page.getByLabel('Email').fill(testUser.email);
  await page.getByLabel('Password', { exact: true }).fill(testUser.password);
  await page.getByLabel('Confirm Password').fill(testUser.confirmPassword);

  const signUpButton = page.getByRole('button', { name: /sign up/i });
  await expect(signUpButton).toBeEnabled({ timeout: 5_000 });
  await signUpButton.click();

  await page.waitForURL('/', { timeout: 10_000 });

  const cookies = await page.context().cookies();
  const jwtCookie = cookies.find(c => c.name === 'jwt' /* TODO: match JWT_COOKIE_NAME */);
  if (!jwtCookie) {
    throw new Error(
      'global-setup: sign-up did not produce an auth cookie — check JWT_COOKIE_NAME matches.',
    );
  }

  await page.context().storageState({ path: STORAGE_STATE_PATH });
  await browser.close();
}

export default globalSetup;
