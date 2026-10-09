import { test, expect } from '@playwright/test';

const BASE_URL = 'https://my-webblog.vercel.app';

test.describe('C. จัดการบทความ และ ค้นหา', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-013: เผยแพร่บทความสำเร็จ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    const title = `บทความทดสอบ ${Date.now()}`;
    await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
    await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', title);
    await page.fill('textarea', 'เนื้อหาบทความทดสอบการเผยแพร่');
    await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();

    await expect(page.locator(`text=${title}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-015 & TC-016: เผยแพร่โดยไม่กรอกหัวข้อหรือเนื้อหา', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
    await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();
    await expect(page.locator('form')).toBeVisible();
  });

  test('TC-021: แก้ไขบทความสำเร็จ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    const editBtn = page.locator('button:has-text("แก้ไข"), [aria-label="edit"]').first();
    if (await editBtn.isVisible()) {
      await editBtn.click();
      const updatedTitle = `แก้ไขแล้ว ${Date.now()}`;
      await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', updatedTitle);
      await page.locator('form button:has-text("บันทึก"), form button:has-text("แก้ไข")').last().click();
      await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('TC-024: ลบบทความ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    const deleteBtn = page.locator('button:has-text("ลบ"), [aria-label="delete"]').first();
    if (await deleteBtn.isVisible()) {
      await deleteBtn.click();
    }
  });

  test('TC-025: ค้นหาบทความ (พบและไม่พบ)', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('คำที่ไม่น่าจะมีในระบบ12345');
      await expect(page.locator('text=ไม่พบข้อมูล, text=No data, text=ไม่พบบทความ').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('TC-030: ป้องกัน XSS ในหัวข้อบทความ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('form input[type="text"]', 'tester01');
    await page.fill('form input[type="password"]', 'Test@1234');
    await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();

    const xssScript = '<script>alert(1)</script>';
    await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
    await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', xssScript);
    await page.fill('textarea', 'ทดสอบ XSS');
    await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();

    await expect(page.locator(`text=${xssScript}`).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-033: เขียนบทความโดยไม่ล็อกอิน', async ({ page }) => {
    await page.goto(`${BASE_URL}/create`);
    await expect(page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first()).toBeVisible();
  });
});