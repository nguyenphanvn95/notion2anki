# Notion2Anki Web - MVP Version

## 🎯 Tính năng

✅ **Import từ Notion Export** (ZIP/HTML)  
✅ **Tự động parse Toggle blocks** thành flashcards  
✅ **Auto-detect Note Types** (Basic/Cloze)  
✅ **Export file .apkg chuẩn** Anki  
✅ **Hỗ trợ media** (ảnh, video)  
✅ **Không cần CORS**, không cần Notion API  

## 🚀 Cách sử dụng

### Bước 1: Export từ Notion

1. Mở trang Notion chứa flashcards
2. Click menu "..." → **Export**
3. Chọn Export format: **HTML**
4. Include subpages: Tùy chọn (nếu muốn export cả sub-pages)
5. **Download** file ZIP

### Bước 2: Chuẩn bị cấu trúc Notion

Sử dụng **Toggle blocks** để tạo flashcards:

```
▼ What is Anki?
  Anki is a spaced repetition flashcard program.
  
▼ {{c1::Tokyo}} is the capital of Japan
  (Cloze deletion - auto-detected)
```

**Format:**
- **Summary** (toggle title) = **Front** của card
- **Content** (toggle body) = **Back** của card
- Hỗ trợ HTML, images, videos trong content

### Bước 3: Upload & Export

1. Mở `index.html` trong browser
2. Kéo thả file ZIP vào drop zone
3. (Tùy chọn) Đặt tên Deck
4. Click "**Xử lý & Export APKG**"
5. Chờ xử lý (~5-30s tùy số lượng notes)
6. File .apkg sẽ tự động download

### Bước 4: Import vào Anki

1. Mở **Anki Desktop**
2. File → **Import**
3. Chọn file .apkg vừa download
4. Click **Import**
5. Done! 🎉

## 📋 Cấu trúc Toggle trong Notion

### Basic Note
```
▼ Front text
  Back text
  Can include <b>HTML</b>
  Images, videos, etc.
```

### Cloze Note
```
▼ {{c1::Paris}} is the capital of {{c2::France}}
  Additional info here (optional)
```

**Auto-detection:** Nếu có `{{c1::text}}` → Tự động tạo Cloze note

## 🎨 Ví dụ

### Vocabulary Card
```
▼ Ubiquitous
  <b>Definition:</b> Present everywhere
  <b>Example:</b> Mobile phones are ubiquitous nowadays.
  <img src="image.png">
```

### Cloze Deletion
```
▼ The {{c1::mitochondria}} is the {{c2::powerhouse}} of the cell
  This creates 2 cards automatically
```

### Multi-line Content
```
▼ List the 3 branches of US government
  1. Executive
  2. Legislative  
  3. Judicial
```

## ⚙️ Tùy chọn

### Tên Deck
- Mặc định: "Notion"
- Tùy chỉnh: Nhập tên bất kỳ

### Auto-detect Note Type
- ✅ Enabled: Tự động phân biệt Basic/Cloze
- ❌ Disabled: Tất cả thành Basic notes

### Include Media
- ✅ Enabled: Đóng gói ảnh/video vào .apkg
- ❌ Disabled: Chỉ text

## 🔧 Kỹ thuật

### Dependencies
- **sql.js** - SQLite trong browser
- **JSZip** - Tạo file ZIP
- Pure JavaScript - Không framework

### APKG Structure
```
.apkg (ZIP file)
├── collection.anki2 (SQLite database)
│   ├── col (collection config)
│   ├── notes (flashcard data)
│   ├── cards (card instances)
│   └── ... (other tables)
├── media (JSON: media filename mapping)
├── 0, 1, 2... (media files)
```

### Note Types Created

**Basic Note:**
- Fields: Front, Back
- Template: Simple front/back

**Cloze Note:**
- Fields: Text, Extra
- Template: Cloze deletions
- Multiple cards per note

## ⚠️ Giới hạn MVP

### Không có (sẽ có trong full version):
- ❌ Notion API integration
- ❌ Multi-page management
- ❌ Custom templates
- ❌ Tags support
- ❌ Advanced formatting

### Có thể không hoạt động với:
- Complex Notion blocks (databases, galleries, etc.)
- Nested toggles (chỉ parse level 1)
- Very large exports (>1000 notes)

## 🐛 Troubleshooting

### "Không tìm thấy toggle blocks"
→ Đảm bảo bạn dùng **Toggle blocks** trong Notion, không phải headings hay paragraphs

### "sql.js not loaded"
→ Check internet connection (cần load từ CDN)

### "File .apkg lỗi"
→ Kiểm tra console (F12) xem error log

### Ảnh không hiển thị
→ Đảm bảo "Include Media" được check

## 📈 Roadmap

### v2.0 (Full Version)
- [ ] Notion API integration
- [ ] Token + username auth
- [ ] Multi-page management
- [ ] Custom note types
- [ ] Template editor
- [ ] Tags from Notion properties
- [ ] Advanced formatting
- [ ] Progress persistence

## 📝 License

MIT License - Free to use

## 🤝 Contribute

Issues & PRs welcome on GitHub!

---

**Made with ❤️ for Anki learners**

*MVP Version 1.0 - Tập trung vào core functionality*
