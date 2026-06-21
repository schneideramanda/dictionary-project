import { test, expect } from '@playwright/test';

test.describe('Word list + detail navigation (authenticated)', () => {
  test('homepage shows the word list', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('main')).not.toContainText('Loading', { timeout: 10_000 });
    await expect(page.locator('li').first()).toBeVisible();
  });

  test('search filters the list', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Search...').fill('hello');
    await page.waitForTimeout(500); // 300ms debounce + SWR refetch

    await expect(page.locator('li', { hasText: /hello/i }).first()).toBeVisible({
      timeout: 5_000,
    });
  });

  test('empty search shows "No entries found"', async ({ page }) => {
    await page.goto('/');

    await page.getByPlaceholder('Search...').fill('zzzznonexistentword9999');
    await page.waitForTimeout(500);

    await expect(page.getByText('No entries found.')).toBeVisible();
  });

  test('clicking a word navigates to its detail page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).not.toContainText('Loading', { timeout: 10_000 });

    const firstCard = page.locator('li').first();
    const word = (await firstCard.locator('p').first().innerText()).trim();

    await firstCard.click();
    await page.waitForURL(/\/entries\/.+/);

    await expect(page).toHaveURL(new RegExp(`/entries/${word.toLowerCase()}`));
    await expect(page.locator('body')).toContainText(word, { ignoreCase: true });
  });

  test('pagination next/previous navigate between pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main')).not.toContainText('Loading', { timeout: 10_000 });

    const next = page.getByTestId('pagination-next');
    const previous = page.getByTestId('pagination-previous');

    await expect(previous).toHaveAttribute('aria-disabled', 'true');

    await next.click();
    await expect(page.getByText('Page', { exact: false })).toContainText('2');

    await previous.click();
    await expect(page.getByText('Page', { exact: false })).toContainText('1');
  });
});
