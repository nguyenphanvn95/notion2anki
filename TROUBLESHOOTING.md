# Troubleshooting - Không tìm thấy Toggle Blocks

## 🔍 Vấn đề: "No toggle blocks found"

Nếu bạn nhận được thông báo **"Không tìm thấy toggle blocks"** dù page Notion của bạn có nhiều toggles, hãy làm theo các bước sau:

---

## ✅ Giải pháp nhanh: Sử dụng Upload ZIP/HTML

**Cách này hoạt động 100%** và được khuyến nghị nhất:

### Bước 1: Export từ Notion
1. Mở page trong Notion
2. Click menu `...` ở góc trên bên phải
3. Chọn **Export**
4. Export format: Chọn **HTML**
5. Include content: Chọn **Everything** hoặc **No files & images** (tùy nhu cầu)
6. Include subpages: Chọn theo nhu cầu
7. Click **Export**
8. Download file ZIP

### Bước 2: Upload vào Tool
1. Mở tool, chuyển sang tab **"Upload ZIP/HTML"**
2. Kéo thả file ZIP vào hoặc click để chọn
3. Nhập tên deck
4. Click **"Xử lý & Export APKG"**
5. Download file APKG

✨ **Phương pháp này luôn hoạt động!**

---

## 🔧 Debug: Export trực tiếp từ Notion

Nếu bạn muốn sử dụng tính năng export trực tiếp, đây là cách debug:

### 1. Mở Console để xem log

1. Mở **Developer Tools** (F12)
2. Chuyển sang tab **Console**
3. Thử export lại từ Notion
4. Xem các log messages:
   ```
   === Starting HTML Parsing ===
   HTML length: xxxxx
   Method 1 - Found <details> tags: X
   Method 2 - Found toggle-like elements: X
   Method 3 - Found possible toggle elements: X
   Method 4 - Found nested structures: X
   Total toggles to process: X
   ```

### 2. Kiểm tra HTML structure

Trong Console, chạy lệnh sau để xem cấu trúc HTML:

```javascript
// Sau khi export xong, trong Console gõ:
console.log(document.querySelector('details'));
```

Nếu kết quả là `null`, nghĩa là HTML không có `<details>` tags.

### 3. Kiểm tra định dạng Toggle trong Notion

**✅ Đúng:** Sử dụng Toggle block

```
▶ Question text here
  Answer content here
  Can have multiple lines
  Can have images, formatting, etc.
```

**❌ Sai:** Không phải Toggle block
- Heading + Paragraph
- Bulleted list + Sub-items
- Text blocks
- Callout blocks

**Cách tạo Toggle block:**
1. Type `/toggle` trong Notion
2. Hoặc click `+` → Toggle list
3. Icon phải là `▶` (mũi tên)

---

## 🐛 Các vấn đề phổ biến

### Vấn đề 1: CORS Error

**Triệu chứng:**
```
Error: CORS error: Cannot connect to Notion API directly from browser
```

**Giải pháp:**
- ✅ **Dùng phương pháp Upload ZIP/HTML** (khuyến nghị)
- Hoặc cài đặt CORS extension (không an toàn)
- Hoặc sử dụng backend server (advanced)

### Vấn đề 2: Token không hợp lệ

**Triệu chứng:**
```
Error: Invalid token. Please check your token_v2
```

**Giải pháp:**
1. Lấy token mới:
   - F12 → Application → Cookies → notion.so
   - Copy lại giá trị `token_v2`
2. Đảm bảo copy toàn bộ token (rất dài)
3. Không có khoảng trắng đầu/cuối

### Vấn đề 3: Page ID không đúng

**Triệu chứng:**
```
Error: Invalid page URL or ID
```

**Giải pháp:**
1. Copy full URL từ Notion:
   ```
   https://www.notion.so/Page-Name-abc123def456...
   ```
2. Hoặc chỉ copy phần ID:
   ```
   abc123def456...
   ```
3. ID thường dài 32 ký tự (hex)

### Vấn đề 4: HTML không có toggles

**Triệu chứng:**
```
Console log shows:
Method 1 - Found <details> tags: 0
Method 2 - Found toggle-like elements: 0
Method 3 - Found possible toggle elements: 0
Total toggles to process: 0
```

**Giải pháp:**
1. Kiểm tra page Notion có toggle blocks không
2. Thử export ZIP từ Notion và kiểm tra file HTML
3. Mở file HTML trong text editor, search cho:
   - `<details>`
   - `toggle`
   - `▶`
4. Nếu không có → page không có toggle blocks

---

## 📋 Checklist Debug

- [ ] Page Notion có toggle blocks (icon `▶`)
- [ ] Token_v2 đúng và còn hạn
- [ ] Page ID chính xác
- [ ] Console không có CORS error
- [ ] Đã thử phương pháp Upload ZIP/HTML

---

## 💡 Tips

### Tip 1: Test với page nhỏ

Tạo page test với 2-3 toggles:

```
▶ Test 1
  Answer 1

▶ Test 2
  Answer 2
```

Export thử để đảm bảo setup đúng.

### Tip 2: Check Browser Console

**Luôn luôn** mở Console (F12) khi sử dụng tool để xem:
- Log messages
- Error messages
- HTML structure info

### Tip 3: Export ZIP là tốt nhất

Cho đến khi Notion có official API tốt hơn, phương pháp **Upload ZIP/HTML** là:
- ✅ Ổn định nhất
- ✅ Không có CORS issues
- ✅ Không cần token
- ✅ Hoạt động 100%

---

## 🆘 Vẫn không hoạt động?

### Option 1: Upload ZIP file của bạn

1. Export page từ Notion thành ZIP
2. Dùng tab "Upload ZIP/HTML"
3. Gửi ZIP file qua GitHub Issues nếu vẫn lỗi

### Option 2: Chia sẻ HTML structure

1. Export page thành HTML
2. Mở file HTML trong text editor
3. Copy 50-100 dòng đầu tiên
4. Chia sẻ trong GitHub Issues
5. Chúng tôi sẽ kiểm tra structure

### Option 3: GitHub Issues

Tạo issue với thông tin:
- Notion page structure (screenshot)
- Console error messages
- Browser version
- Steps to reproduce

---

## 📚 Tài liệu tham khảo

- [Notion Export Guide](https://www.notion.so/help/export-your-content)
- [Toggle Block trong Notion](https://www.notion.so/help/toggle-lists)
- [GitHub Issues](https://github.com/yourusername/notion2anki-complete/issues)

---

**Lưu ý:** Đa số các trường hợp "không tìm thấy toggle" được giải quyết bằng cách:
1. Sử dụng đúng Toggle blocks trong Notion (không phải heading hay list)
2. Hoặc dùng phương pháp Upload ZIP/HTML
