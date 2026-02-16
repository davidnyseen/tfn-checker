import { test, expect } from '@playwright/test';

test.describe('TFN Checker', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('TFN Checker');
    await expect(page.locator('h2')).toHaveText('TFN Checker');
  });

  test('validate button should be disabled when input is empty', async ({ page }) => {
    const button = page.locator('button', { hasText: 'Validate' });
    await expect(button).toBeDisabled();
  });

  test('should format input as user types', async ({ page }) => {
    const input = page.locator('input');
    await input.fill('123456782');
    await input.dispatchEvent('input');
    await expect(input).toHaveValue('123 456 782');
  });

  test('should show valid result for valid TFN', async ({ page }) => {
    const input = page.locator('input');
    await input.fill('123456782');
    await input.dispatchEvent('input');

    await page.locator('button', { hasText: 'Validate' }).click();

    const result = page.locator('.result');
    await expect(result).toBeVisible({ timeout: 5000 });
    await expect(result).toHaveClass(/valid/);
    await expect(result.locator('strong')).toHaveText('Valid TFN');
  });

  test('should show invalid result for invalid TFN', async ({ page }) => {
    const input = page.locator('input');
    await input.fill('123456789');
    await input.dispatchEvent('input');

    await page.locator('button', { hasText: 'Validate' }).click();

    const result = page.locator('.result');
    await expect(result).toBeVisible({ timeout: 5000 });
    await expect(result).toHaveClass(/invalid/);
    await expect(result.locator('strong')).toHaveText('Invalid TFN');
  });

  test('should show validation history after validating', async ({ page }) => {
    const input = page.locator('input');
    await input.fill('123456782');
    await input.dispatchEvent('input');

    await page.locator('button', { hasText: 'Validate' }).click();

    const table = page.locator('table');
    await expect(table).toBeVisible({ timeout: 5000 });
    await expect(table.locator('tbody tr').first()).toBeVisible();
  });

  test('should clear history when Clear button is clicked', async ({ page }) => {
    const input = page.locator('input');
    await input.fill('123456782');
    await input.dispatchEvent('input');
    await page.locator('button', { hasText: 'Validate' }).click();

    await expect(page.locator('table')).toBeVisible({ timeout: 5000 });

    await page.locator('button', { hasText: 'Clear' }).click();

    await expect(page.locator('.empty')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.empty')).toHaveText('No validations yet.');
  });

});
