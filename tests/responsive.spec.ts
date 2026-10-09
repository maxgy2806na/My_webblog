import { test, expect } from '@playwright/test';

const BASE_URL = 'https://my-webblog.vercel.app';

test.describe('E & G. Responsive & Error Handling', () => {
  test('TC-028: แสดงผลบนมือถือ (Viewport 375px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    await expect(page.locator('body')).toBeVisible();
  });

  test('TC-029: ใช้งานข้ามเบราว์เซอร์', async ({ page }) => {
    await page.goto(BASE_URL);
    // ตรวจสอบว่า Title มีคำว่า BLOGNAJA หรือ Create Next App
    await expect(page).toHaveTitle(/BLOGNAJA|Create Next App/i);
  });

  test('TC-037: เปิดหน้าที่ไม่มีอยู่ (404 Page)', async ({ page }) => {
    await page.goto(`${BASE_URL}/page-not-found-xyz`);
    await expect(page.getByText(/404|not found|could not be found/i).first()).toBeVisible({ timeout: 10000 });
  });
});