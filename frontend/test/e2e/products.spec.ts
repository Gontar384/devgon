import { test, expect } from '@playwright/test';

test('dodawanie produktu', async ({ page }) => {
  await page.goto('/products');

  await page.fill('input[placeholder="Tytuł"]', 'Testowy produkt1');
  await page.fill('textarea[placeholder="Opis"]', 'To jest opis produktu1');

  const response = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/api/products') &&
        resp.request().method() === 'POST',
    ),
    page.click('button[type="submit"]'),
  ]);

  const json = await response[0].json();
  console.log('🛠️ Response JSON:', json);

  await expect(page.locator('text=Produkt został dodany!')).toBeVisible();
});
