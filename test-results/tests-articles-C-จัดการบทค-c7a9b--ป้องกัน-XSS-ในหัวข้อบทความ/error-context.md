# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/articles.spec.ts >> C. จัดการบทความ และ ค้นหา >> TC-030: ป้องกัน XSS ในหัวข้อบทความ
- Location: tests/articles.spec.ts:72:7

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
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
    - generic [ref=e112]:
      - generic [ref=e113]:
        - heading "เข้าสู่ระบบ" [level=3] [ref=e114]
        - button "✕" [ref=e115]
      - paragraph [ref=e116]: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
      - generic [ref=e117]:
        - generic [ref=e118]:
          - generic [ref=e119]: ชื่อผู้ใช้
          - textbox [ref=e120]: tester01
        - generic [ref=e121]:
          - generic [ref=e122]: รหัสผ่าน
          - textbox [ref=e123]: Test@1234
        - button "เข้าสู่ระบบ" [active] [ref=e124]
      - paragraph [ref=e126]:
        - text: ยังไม่มีบัญชี?
        - button "สมัครสมาชิก" [ref=e127]
  - alert [ref=e128]
```