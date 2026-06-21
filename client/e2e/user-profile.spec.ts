import { expect, test } from '@playwright/test';

test.describe('User profile and navigation to history and favorites', () => {
  test('user avatar redirects to user profile', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'User Menu' }).click();
    await page.getByRole('menuitem', { name: 'View Profile' }).click();

    await page.waitForURL('/user');
    await expect(page).toHaveURL('/user');
    await expect(page.getByText('E2E Test User')).toBeVisible();
  });

  test('can navigate to history and favorites from user profile', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: 'User Menu' }).click();
    await page.getByRole('menuitem', { name: 'View Profile' }).click();

    await page.waitForURL('/user');
    await expect(page).toHaveURL('/user');

    await page.getByRole('button', { name: 'Favorites' }).click();
    await page.waitForURL('/entries/favorites');
    await expect(page).toHaveURL('/entries/favorites');
    await expect(page.getByText('User Favorites Words')).toBeVisible();

    await page.getByRole('button', { name: 'Back' }).click();
    await page.waitForURL('/user');
    await expect(page).toHaveURL('/user');

    await page.getByRole('button', { name: 'History' }).click();
    await page.waitForURL('/entries/history');
    await expect(page).toHaveURL('/entries/history');
  });
});
