# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/auth.spec.ts >> A. สมาชิกและการยืนยันตัวตน & Security >> TC-001: สมัครสมาชิกสำเร็จ
- Location: tests/auth.spec.ts:10:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "BLOGNAJA." [ref=e5] [cursor=pointer]:
          - /url: /
        - generic [ref=e8]:
          - button "เขียนบทความ" [ref=e9]
          - button "เข้าสู่ระบบ" [ref=e13]
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]:
          - generic [ref=e17]: Blog Metrics & Overview
          - heading "Dashboard ภาพรวมบล็อก" [level=1] [ref=e20]
        - paragraph [ref=e21]: ติดตามความเคลื่อนไหว สถิิตการเผยแพร่บทความ และข้อมูลนักเขียนแบบ Real-time
      - generic [ref=e22]:
        - generic [ref=e23]:
          - generic [ref=e24]: บทความทั้งหมด
          - generic [ref=e29]: "2"
          - paragraph [ref=e30]: รายการถูกเผยแพร่ในระบบ
        - generic [ref=e31]:
          - generic [ref=e32]: หมวดหมู่เนื้อหา
          - generic [ref=e37]: "2"
          - paragraph [ref=e38]: หัวข้อที่แยกตามประเภท
        - generic [ref=e39]:
          - generic [ref=e40]: นักเขียนในระบบ
          - generic [ref=e45]: "2"
          - paragraph [ref=e46]: ผู้สร้างสรรค์เนื้อหาทั้งหมด
        - generic [ref=e47]:
          - generic [ref=e48]: โพสต์ล่าสุด
          - generic "รักนี้หัวใจข้าจอง" [ref=e53]
          - paragraph [ref=e54]: อัปเดตบทความล่าสุด
    - generic [ref=e55]:
      - generic [ref=e56]:
        - generic [ref=e57]:
          - heading "บทความทั้งหมด" [level=2] [ref=e58]
          - paragraph [ref=e59]: ค้นหาและอ่านเนื้อหาที่คุณสนใจ
        - textbox "ค้นหาบทความ..." [ref=e61]
      - generic [ref=e64]:
        - article [ref=e65]:
          - generic [ref=e66]:
            - generic [ref=e67]:
              - generic [ref=e68]: General
              - generic [ref=e69]:
                - button "แก้ไข" [ref=e70]
                - button "ลบ" [ref=e73]
            - heading "รักนี้หัวใจข้าจอง" [level=3] [ref=e76]
            - paragraph [ref=e77]: รักริวธาดา
            - img "attached" [ref=e80] [cursor=pointer]
          - generic [ref=e84]:
            - generic [ref=e85]:
              - text: "ผู้เขียน:"
              - strong [ref=e86]: Tonmaiii
            - generic [ref=e87]: 2026-10-04
        - article [ref=e88]:
          - generic [ref=e89]:
            - generic [ref=e90]:
              - generic [ref=e91]: คนดัง
              - generic [ref=e92]:
                - button "แก้ไข" [ref=e93]
                - button "ลบ" [ref=e96]
            - heading "เรียลผู้น่ารัก" [level=3] [ref=e99]
            - paragraph [ref=e100]: ย
            - img "attached" [ref=e103] [cursor=pointer]
          - generic [ref=e107]:
            - generic [ref=e108]:
              - text: "ผู้เขียน:"
              - strong [ref=e109]: Thitiwut
            - generic [ref=e110]: 2026-10-04
  - alert [ref=e111]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const BASE_URL = 'https://my-webblog.vercel.app';
  4  | 
  5  | test.describe('A. สมาชิกและการยืนยันตัวตน & Security', () => {
  6  |   test.beforeEach(async ({ page }) => {
  7  |     await page.goto(BASE_URL);
  8  |   });
  9  | 
  10 |   test('TC-001: สมัครสมาชิกสำเร็จ', async ({ page }) => {
  11 |     const randomUser = `user_${Date.now()}`;
> 12 |     await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
     |                                                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  13 |     await page.fill('input[type="text"]', randomUser);
  14 |     await page.fill('input[type="password"]', 'Password123');
  15 |     await page.locator('button:has-text("สมัครสมาชิก")').last().click();
  16 |     await expect(page.locator('text=ออก, text=เขียนบทความ').first()).toBeVisible({ timeout: 10000 });
  17 |   });
  18 | 
  19 |   test('TC-002: สมัครด้วยชื่อผู้ใช้ที่มีอยู่แล้ว', async ({ page }) => {
  20 |     await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
  21 |     await page.fill('input[type="text"]', 'tester01');
  22 |     await page.fill('input[type="password"]', 'Test@1234');
  23 |     await page.locator('button:has-text("สมัครสมาชิก")').last().click();
  24 |     await expect(page.getByText(/ถูกใช้แล้ว|มีอยู่แล้ว|Already/i).first()).toBeVisible({ timeout: 10000 });
  25 |   });
  26 | 
  27 |   test('TC-003: สมัครโดยไม่กรอกข้อมูล', async ({ page }) => {
  28 |     await page.locator('button:has-text("สมัครสมาชิก"), a:has-text("สมัครสมาชิก")').first().click();
  29 |     await page.locator('button:has-text("สมัครสมาชิก")').last().click();
  30 |     await expect(page.locator('input[type="text"]')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('TC-004: เข้าสู่ระบบสำเร็จ', async ({ page }) => {
  34 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  35 |     await page.fill('input[type="text"]', 'tester01');
  36 |     await page.fill('input[type="password"]', 'Test@1234');
  37 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  38 |     await expect(page.locator('text=เขียนบทความ, text=ออก').first()).toBeVisible({ timeout: 10000 });
  39 |   });
  40 | 
  41 |   test('TC-005: เข้าสู่ระบบด้วยรหัสผ่านผิด', async ({ page }) => {
  42 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  43 |     await page.fill('input[type="text"]', 'tester01');
  44 |     await page.fill('input[type="password"]', 'WrongPassword123');
  45 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  46 |     await expect(page.getByText(/ไม่ถูกต้อง|Incorrect|Error/i).first()).toBeVisible({ timeout: 10000 });
  47 |   });
  48 | 
  49 |   test('TC-006: เข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
  50 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  51 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  52 |     await expect(page.locator('input[type="text"]')).toBeVisible();
  53 |   });
  54 | 
  55 |   test('TC-007: ออกจากระบบ', async ({ page }) => {
  56 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  57 |     await page.fill('input[type="text"]', 'tester01');
  58 |     await page.fill('input[type="password"]', 'Test@1234');
  59 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  60 |     
  61 |     await page.locator('button:has-text("ออก"), a:has-text("ออก")').first().click();
  62 |     await expect(page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first()).toBeVisible({ timeout: 10000 });
  63 |   });
  64 | 
  65 |   test('TC-008: สลับและปิดโมดัล', async ({ page }) => {
  66 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  67 |     await page.keyboard.press('Escape');
  68 |   });
  69 | 
  70 |   test('TC-031: ป้องกัน SQL Injection ที่ Login', async ({ page }) => {
  71 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  72 |     await page.fill('input[type="text"]', "' OR '1'='1");
  73 |     await page.fill('input[type="password"]', 'anything');
  74 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  75 |     await expect(page.locator('text=เขียนบทความ')).not.toBeVisible();
  76 |   });
  77 | 
  78 |   test('TC-032: รหัสผ่านถูกซ่อน (type="password")', async ({ page }) => {
  79 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  80 |     const inputType = await page.locator('input[type="password"]').getAttribute('type');
  81 |     expect(inputType).toBe('password');
  82 |   });
  83 | 
  84 |   test('TC-038: รีเฟรชหน้าขณะล็อกอิน', async ({ page }) => {
  85 |     await page.locator('button:has-text("เข้าสู่ระบบ"), a:has-text("เข้าสู่ระบบ")').first().click();
  86 |     await page.fill('input[type="text"]', 'tester01');
  87 |     await page.fill('input[type="password"]', 'Test@1234');
  88 |     await page.locator('button:has-text("เข้าสู่ระบบ")').last().click();
  89 |     
  90 |     await page.reload();
  91 |     await expect(page.locator('text=ออก, text=เขียนบทความ').first()).toBeVisible({ timeout: 10000 });
  92 |   });
  93 | });
```