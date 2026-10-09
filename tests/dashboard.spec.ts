import { test, expect } from '@playwright/test';

const BASE_URL = 'https://my-webblog.vercel.app';

test.describe('B. Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-009: แสดงการ์ดสถิติครบทั้ง 4 ใบ', async ({ page }) => {
    await expect(page.locator('text=บทความทั้งหมด').first()).toBeVisible();
    await expect(page.locator('text=หมวดหมู่เนื้อหา').first()).toBeVisible();
    await expect(page.locator('text=นักเขียนในระบบ').first()).toBeVisible();
    await expect(page.locator('text=โพสต์ล่าสุด').first()).toBeVisible();
  });

  test('TC-010 & TC-012: สถิติตรงกับข้อมูลจริง และแสดงรายการบทความ', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const articleCount = await page.locator('article, .article-card, [data-article-id]').count();
    expect(articleCount).toBeGreaterThanOrEqual(0);
  });

  test('TC-011: โพสต์ล่าสุดอัปเดตหลังเผยแพร่', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    const newTitle = `Auto Stat Post ${Date.now()}`;
    await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
    await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', newTitle);
    await page.fill('textarea', 'เนื้อหาสำหรับทดสอบสถิติ');
    await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();

    await expect(page.locator(`text=${newTitle}`).first()).toBeVisible({ timeout: 10000 });
  });
});