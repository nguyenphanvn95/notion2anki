# Hướng Dẫn Nhanh - Notion2Anki Multi-Page

## 🎯 Tính năng mới: Export nhiều trang cùng lúc!

### ⚡ Hướng dẫn nhanh 5 bước

#### 1️⃣ Lấy Notion Token
```
Notion.so → F12 → Application → Cookies → notion.so → token_v2
```
Copy giá trị token_v2

#### 2️⃣ Nhập Token
Paste token vào ô "Notion Token (token_v2)"

#### 3️⃣ Thêm Pages
Cho mỗi page bạn muốn export:
- **Page URL/ID**: Nhập link hoặc ID của page Notion
  - VD URL: `https://notion.so/My-Page-abc123def456...`
  - VD ID: `abc123def456...`
  
- **Tên Sub-Deck**: Tên deck cho page này
  - VD: `Japanese::Vocabulary`
  - VD: `Math::Calculus`
  - VD: `History::World War II`
  
- **Export đệ quy**: Tick nếu muốn bao gồm cả subpages

Click **"Thêm Page"**

#### 4️⃣ Quản lý Pages
- ✏️ **Sửa**: Thay đổi tên deck hoặc cài đặt
- 🗑️ **Xóa**: Xóa page khỏi danh sách  
- 🔄 **Xóa tất cả**: Reset toàn bộ danh sách

#### 5️⃣ Export
- Nhập **"Tên Deck Chính"** (deck cha chứa tất cả sub-decks)
- Click **"Export Tất Cả Pages & Tạo APKG"**
- Đợi hoàn thành và tải file APKG

---

## 📚 Ví dụ cụ thể

### Ví dụ 1: Học tiếng Nhật

**Setup:**
1. Token: (token của bạn)
2. Deck chính: `Japanese Study`

**Thêm pages:**
- Page 1:
  - URL: `https://notion.so/N5-Vocabulary-abc123...`
  - Sub-deck: `N5::Vocabulary`
  - Đệ quy: ✓

- Page 2:
  - URL: `https://notion.so/N5-Grammar-def456...`
  - Sub-deck: `N5::Grammar`
  - Đệ quy: ✓

- Page 3:
  - URL: `https://notion.so/Kanji-ghi789...`
  - Sub-deck: `Kanji::Basic`
  - Đệ quy: ✓

**Kết quả trong Anki:**
```
Japanese Study
├── N5::Vocabulary (50 cards)
├── N5::Grammar (30 cards)
└── Kanji::Basic (40 cards)
```

### Ví dụ 2: Học lập trình

**Setup:**
1. Deck chính: `Programming`

**Thêm pages:**
- Page 1:
  - URL: `page-id-python-basics`
  - Sub-deck: `Python::Basics`
  
- Page 2:
  - URL: `page-id-python-oop`
  - Sub-deck: `Python::OOP`
  
- Page 3:
  - URL: `page-id-algorithms`
  - Sub-deck: `Algorithms::Sorting`

**Kết quả:**
```
Programming
├── Python::Basics
├── Python::OOP
└── Algorithms::Sorting
```

---

## 🎨 Định dạng Notion

### ✅ Basic Cards (Câu hỏi - Trả lời)

Trong Notion, tạo **Toggle block**:

```
▶ What is React?
  A JavaScript library for building user interfaces
```

→ Tạo flashcard với:
- Front: "What is React?"
- Back: "A JavaScript library for building user interfaces"

### ✅ Cloze Cards (Điền vào chỗ trống)

Sử dụng cú pháp `{{c1::text}}`:

```
▶ React is a {{c1::JavaScript library}} for building {{c2::user interfaces}}
  Created by Facebook
```

→ Tạo 2 cloze cards:
1. React is a **[...]** for building user interfaces
2. React is a JavaScript library for building **[...]**

---

## 💡 Tips & Tricks

### 📌 Tổ chức Deck tốt hơn

**Tốt:**
```
Main Deck::Sub Category::Specific Topic
```

**Ví dụ:**
- `Language::Japanese::N5::Vocabulary`
- `Programming::Python::Data Structures`
- `Math::Calculus::Derivatives`

### 🎯 Đặt tên Sub-Deck

**Nên:**
- Ngắn gọn, rõ ràng
- Sử dụng `::` để phân cấp
- Tiếng Anh (tốt hơn cho compatibility)

**Không nên:**
- Quá dài
- Ký tự đặc biệt: `/`, `\`, `<`, `>`
- Khoảng trắng đầu/cuối

### ⚡ Tăng tốc độ

1. **Chuẩn bị trước:**
   - Collect tất cả Page IDs
   - Nghĩ tên deck trước
   
2. **Thêm hàng loạt:**
   - Copy/paste nhanh
   - Sử dụng pattern nhất quán
   
3. **Lưu cấu hình:**
   - Pages tự động lưu
   - Không cần nhập lại

---

## ❓ Câu hỏi thường gặp

### Q: Có giới hạn số pages không?
A: Không có giới hạn! Nhưng nhiều pages = thời gian export lâu hơn.

### Q: Page ID lấy ở đâu?
A: Trong URL của page Notion:
```
https://notion.so/My-Page-abc123def456ghi789...
                          ^^^^^^^^^^^^^^^^^^^^
                               Page ID
```

### Q: Có thể export page riêng tư không?
A: Có, miễn bạn có quyền truy cập (token_v2 có quyền).

### Q: Lỗi "No toggle blocks found"?
A: Đảm bảo sử dụng **Toggle blocks** (icon ▶) trong Notion, không phải heading hay text thường.

### Q: Có thể sửa page sau khi thêm không?
A: Có! Click nút "Sửa" để chỉnh sửa tên deck hoặc cài đặt đệ quy.

### Q: Danh sách pages có bị mất khi tắt browser không?
A: Không! Pages được lưu tự động vào localStorage.

---

## 🚨 Lưu ý quan trọng

### ⚠️ Token Security
- **KHÔNG CHIA SẺ** token_v2
- Token = full access vào Notion
- Chỉ dùng trên máy cá nhân

### ⚠️ CORS Issues
Nếu gặp lỗi CORS:
1. Dùng method **Upload ZIP/HTML**
2. Export từ Notion → Upload vào tool

### ⚠️ Rate Limits
- Notion có rate limit
- Nếu export quá nhiều pages → có thể bị chặn tạm thời
- Giải pháp: Chia nhỏ, export từng batch

---

## 📞 Hỗ trợ

Gặp vấn đề? Hãy:
1. Đọc lại hướng dẫn
2. Check phần Troubleshooting trong README.md
3. Tạo GitHub Issue
4. Email: your-email@example.com

---

**Happy Learning! 🎓**
