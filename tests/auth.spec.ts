import { test, expect } from '@playwright/test';

const BASE_URL = 'https://my-webblog.vercel.app';

test.describe('A. สมาชิกและการยืนยันตัวตน & Security', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('TC-001: สมัครสมาชิกสำเร็จ', async ({ page }) => {
    const randomUser = `user_${Date.now()}`;
    await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
    await page.fill('input[type="text"]', randomUser);
    await page.fill('input[type="password"]', 'Password123');
    await page.locator('button:has-text("สมัครสมาชิก")').last().click();
    await expect(page.locator('text=ออก, text=เขียนบทความ').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-002: สมัครด้วยชื่อผู้ใช้ที่มีอยู่แล้ว', async ({ page }) => {
    await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
    await page.fill('input[type="text"]', 'tester01');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.locator('button:has-text("สมัครสมาชิก")').last().click();
    await expect(page.getByText(/ถูกใช้แล้ว|มีอยู่แล้ว|Already/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-003: สมัครโดยไม่กรอกข้อมูล', async ({ page }) => {
    await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
    await page.locator('button:has-text("สมัครสมาชิก")').last().click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('TC-004: เข้าสู่ระบบสำเร็จ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('input[type="text"]', 'tester01');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    await expect(page.locator('text=เขียนบทความ, text=ออก').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-005: เข้าสู่ระบบด้วยรหัสผ่านผิด', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('input[type="text"]', 'tester01');
    await page.fill('input[type="password"]', 'WrongPassword123');
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    await expect(page.getByText(/ไม่ถูกต้อง|Incorrect|Error/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-006: เข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('TC-007: ออกจากระบบ', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('input[type="text"]', 'tester01');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    
    await page.locator('button:has-text("ออก"), a:has-text("ออก")').first().click();
    await expect(page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first()).toBeVisible({ timeout: 10000 });
  });

  test('TC-008: สลับและปิดโมดัล', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.keyboard.press('Escape');
  });

  test('TC-031: ป้องกัน SQL Injection ที่ Login', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('input[type="text"]', "' OR '1'='1");
    await page.fill('input[type="password"]', 'anything');
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    await expect(page.locator('text=เขียนบทความ')).not.toBeVisible();
  });

  test('TC-032: รหัสผ่านถูกซ่อน (type="password")', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    const inputType = await page.locator('input[type="password"]').getAttribute('type');
    expect(inputType).toBe('password');
  });

  test('TC-038: รีเฟรชหน้าขณะล็อกอิน', async ({ page }) => {
    await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
    await page.fill('input[type="text"]', 'tester01');
    await page.fill('input[type="password"]', 'Test@1234');
    await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
    
    await page.reload();
    await expect(page.locator('text=ออก, text=เขียนบทความ').first()).toBeVisible({ timeout: 10000 });
  });
});