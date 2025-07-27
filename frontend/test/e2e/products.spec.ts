import { test, expect } from '@playwright/test';

test('dodawanie produktu', async ({ page }) => {
  await page.goto('/products');

  await page.fill('input[placeholder="Tytuł"]', 'Testowy produkt1');
  await page.fill('textarea[placeholder="Opis"]', 'To jest opis produktu1');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Produkt został dodany!')).toBeVisible();
});
