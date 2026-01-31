# ⚡ Quick Start - 3 Phút

## 🎯 Mục tiêu

Tạo flashcards Anki từ Notion trong 3 phút!

## 📝 Bước 1: Tạo Toggle trong Notion (1 phút)

Mở Notion → Tạo toggles:

```
▼ What is Anki?
  A spaced repetition flashcard app

▼ Notion to Anki?
  This tool converts Notion toggles to Anki cards
  
▼ {{c1::Paris}} is the capital of France
  (Cloze deletion example)
```

**Lưu ý:** Dùng toggle blocks (▼), không phải headings!

## 📥 Bước 2: Export từ Notion (30 giây)

1. Click "..." menu
2. **Export**
3. Format: **HTML**
4. **Download** ZIP

## 🚀 Bước 3: Convert sang APKG (1 phút)

1. Mở `index.html` trong browser
2. Kéo thả file ZIP vào
3. Click "**Xử lý & Export APKG**"
4. Chờ 5-10 giây
5. File .apkg tự động download

## 📲 Bước 4: Import vào Anki (30 giây)

1. Mở Anki
2. File → Import
3. Chọn file .apkg
4. Import
5. Done! 🎉

## ✅ Checklist

- [ ] Đã tạo toggle blocks trong Notion
- [ ] Đã export HTML từ Notion
- [ ] Đã download file ZIP
- [ ] Đã mở index.html trong browser
- [ ] Đã upload ZIP và export APKG
- [ ] Đã import vào Anki

## 💡 Tips

### Toggle = Card
Mỗi toggle block = 1 flashcard:
- **Title** = Front
- **Content** = Back

### Cloze Auto-detect
Có `{{c1::text}}` → Tự động tạo Cloze note

### Media Support
Ảnh trong Notion export sẽ được đóng gói vào APKG

## 🐛 Lỗi thường gặp

### "Không tìm thấy toggle blocks"
→ Phải dùng **toggle blocks** (▼), không phải headings

### "sql.js not loaded"
→ Cần internet để load thư viện từ CDN

### File .apkg lỗi
→ Mở F12 Console xem lỗi chi tiết

## 📚 Đọc thêm

- [README.md](README.md) - Full documentation
- [EXAMPLES.md](EXAMPLES.md) - Use cases & examples

---

**Total time: ~3 phút**

Bắt đầu ngay! Open `index.html` 🚀
