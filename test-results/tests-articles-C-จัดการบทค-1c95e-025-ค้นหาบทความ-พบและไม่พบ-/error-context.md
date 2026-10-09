# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/articles.spec.ts >> C. จัดการบทความ และ ค้นหา >> TC-025: ค้นหาบทความ (พบและไม่พบ)
- Location: tests/articles.spec.ts:64:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=ไม่พบข้อมูล, text=No data, text=ไม่พบบทความ').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('text=ไม่พบข้อมูล, text=No data, text=ไม่พบบทความ').first() with timeout 5000ms
  - waiting for locator('text=ไม่พบข้อมูล, text=No data, text=ไม่พบบทความ').first()

```

```yaml
- navigation:
  - link "BLOGNAJA.":
    - /url: /
  - button "เขียนบทความ":
    - img
    - text: เขียนบทความ
  - button "เข้าสู่ระบบ"
- text: Blog Metrics & Overview
- heading "Dashboard ภาพรวมบล็อก" [level=1]
- paragraph: ติดตามความเคลื่อนไหว สถิิตการเผยแพร่บทความ และข้อมูลนักเขียนแบบ Real-time
- text: บทความทั้งหมด
- img
- text: "2"
- paragraph: รายการถูกเผยแพร่ในระบบ
- text: หมวดหมู่เนื้อหา
- img
- text: "2"
- paragraph: หัวข้อที่แยกตามประเภท
- text: นักเขียนในระบบ
- img
- text: "2"
- paragraph: ผู้สร้างสรรค์เนื้อหาทั้งหมด
- text: โพสต์ล่าสุด
- img
- text: รักนี้หัวใจข้าจอง
- paragraph: อัปเดตบทความล่าสุด
- heading "บทความทั้งหมด" [level=2]
- paragraph: ค้นหาและอ่านเนื้อหาที่คุณสนใจ
- textbox "ค้นหาบทความ...": คำที่ไม่น่าจะมีในระบบ12345
- img
- paragraph: ไม่พบบทความที่คุณต้องการ
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'https://my-webblog.vercel.app';
  4  | 
  5  | test.describe('C. จัดการบทความ และ ค้นหา', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto(BASE_URL);
  8  |   });
  9  | 
  10 |   test('TC-013: เผยแพร่บทความสำเร็จ', async ({ page }) => {
  11 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  12 |     await page.fill('form input[type="text"]', 'tester01');
  13 |     await page.fill('form input[type="password"]', 'Test@1234');
  14 |     await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();
  15 | 
  16 |     const title = `บทความทดสอบ ${Date.now()}`;
  17 |     await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
  18 |     await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', title);
  19 |     await page.fill('textarea', 'เนื้อหาบทความทดสอบการเผยแพร่');
  20 |     await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();
  21 | 
  22 |     await expect(page.locator(`text=${title}`).first()).toBeVisible({ timeout: 10000 });
  23 |   });
  24 | 
  25 |   test('TC-015 & TC-016: เผยแพร่โดยไม่กรอกหัวข้อหรือเนื้อหา', async ({ page }) => {
  26 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  27 |     await page.fill('form input[type="text"]', 'tester01');
  28 |     await page.fill('form input[type="password"]', 'Test@1234');
  29 |     await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();
  30 | 
  31 |     await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
  32 |     await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();
  33 |     await expect(page.locator('form')).toBeVisible();
  34 |   });
  35 | 
  36 |   test('TC-021: แก้ไขบทความสำเร็จ', async ({ page }) => {
  37 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  38 |     await page.fill('form input[type="text"]', 'tester01');
  39 |     await page.fill('form input[type="password"]', 'Test@1234');
  40 |     await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();
  41 | 
  42 |     const editBtn = page.locator('button:has-text("แก้ไข"), [aria-label="edit"]').first();
  43 |     if (await editBtn.isVisible()) {
  44 |       await editBtn.click();
  45 |       const updatedTitle = `แก้ไขแล้ว ${Date.now()}`;
  46 |       await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', updatedTitle);
  47 |       await page.locator('form button:has-text("บันทึก"), form button:has-text("แก้ไข")').last().click();
  48 |       await expect(page.locator(`text=${updatedTitle}`).first()).toBeVisible({ timeout: 10000 });
  49 |     }
  50 |   });
  51 | 
  52 |   test('TC-024: ลบบทความ', async ({ page }) => {
  53 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  54 |     await page.fill('form input[type="text"]', 'tester01');
  55 |     await page.fill('form input[type="password"]', 'Test@1234');
  56 |     await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();
  57 | 
  58 |     const deleteBtn = page.locator('button:has-text("ลบ"), [aria-label="delete"]').first();
  59 |     if (await deleteBtn.isVisible()) {
  60 |       await deleteBtn.click();
  61 |     }
  62 |   });
  63 | 
  64 |   test('TC-025: ค้นหาบทความ (พบและไม่พบ)', async ({ page }) => {
  65 |     const searchInput = page.locator('input[placeholder*="ค้นหา"]').first();
  66 |     if (await searchInput.isVisible()) {
  67 |       await searchInput.fill('คำที่ไม่น่าจะมีในระบบ12345');
> 68 |       await expect(page.locator('text=ไม่พบข้อมูล, text=No data, text=ไม่พบบทความ').first()).toBeVisible({ timeout: 5000 });
     |                                                                                              ^ Error: expect(locator).toBeVisible() failed
  69 |     }
  70 |   });
  71 | 
  72 |   test('TC-030: ป้องกัน XSS ในหัวข้อบทความ', async ({ page }) => {
  73 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  74 |     await page.fill('form input[type="text"]', 'tester01');
  75 |     await page.fill('form input[type="password"]', 'Test@1234');
  76 |     await page.locator('form button:has-text("เข้าสู่ระบบ")').last().click();
  77 | 
  78 |     const xssScript = '<script>alert(1)</script>';
  79 |     await page.locator('button:has-text("เขียนบทความ"), a:has-text("เขียนบทความ")').first().click();
  80 |     await page.fill('input[name="title"], input[placeholder*="หัวข้อ"]', xssScript);
  81 |     await page.fill('textarea', 'ทดสอบ XSS');
  82 |     await page.locator('form button:has-text("เผยแพร่"), form button[type="submit"]').last().click();
  83 | 
  84 |     await expect(page.locator(`text=${xssScript}`).first()).toBeVisible({ timeout: 10000 });
  85 |   });
  86 | 
  87 |   test('TC-033: เขียนบทความโดยไม่ล็อกอิน', async ({ page }) => {
  88 |     await page.goto(`${BASE_URL}/create`);
  89 |     await expect(page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first()).toBeVisible();
  90 |   });
  91 | });
```