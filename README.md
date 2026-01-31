# Notion2Anki Complete - Multi-Page Edition

🚀 **Phiên bản nâng cấp** với khả năng export nhiều trang Notion cùng lúc vào một file APKG duy nhất!

## ✨ Tính năng mới

### 📚 Export Nhiều Pages Cùng Lúc
- **Quản lý danh sách pages**: Thêm, sửa, xóa nhiều pages dễ dàng
- **Tên deck riêng biệt**: Mỗi page có thể có tên sub-deck riêng
- **Deck phân cấp**: Tất cả sub-decks được tổ chức dưới một deck chính
- **Lưu trữ cấu hình**: Danh sách pages tự động lưu vào localStorage

### 🎯 Tính năng chính

1. **Export từ Notion**
   - Export trực tiếp từ Notion sử dụng token_v2
   - Hỗ trợ export đệ quy (bao gồm subpages)
   - Export nhiều pages cùng lúc
   - Mỗi page có tên deck riêng

2. **Upload ZIP/HTML**
   - Upload file đã export từ Notion
   - Tự động phát hiện và extract media
   - Convert sang APKG ngay lập tức

3. **Tự động phát hiện Note Type**
   - Basic notes (câu hỏi/trả lời)
   - Cloze notes (fill-in-the-blank)

4. **Hỗ trợ Media**
   - Ảnh (PNG, JPG, GIF, WebP)
   - Video (MP4)
   - Audio (MP3, WAV)

## 🚀 Cách sử dụng

### Phương pháp 1: Export từ Notion (Multi-Page)

1. **Lấy Notion Token**
   - Đăng nhập vào Notion
   - Mở Developer Tools (F12)
   - Application → Cookies → notion.so
   - Copy giá trị của cookie `token_v2`

2. **Nhập Token**
   - Paste token vào field "Notion Token (token_v2)"

3. **Thêm Pages**
   - Nhập Page URL hoặc Page ID
   - Nhập tên sub-deck (VD: "Japanese::Vocabulary", "Math::Calculus")
   - Chọn export đệ quy nếu cần
   - Click "Thêm Page"
   - Lặp lại để thêm nhiều pages

4. **Quản lý Pages**
   - **Sửa**: Click nút "Sửa" để chỉnh sửa tên deck hoặc cài đặt
   - **Xóa**: Click nút "Xóa" để xóa page khỏi danh sách
   - **Xóa tất cả**: Click "Xóa Tất Cả" để reset danh sách

5. **Export**
   - Nhập tên Deck Chính (deck sẽ chứa tất cả sub-decks)
   - Click "Export Tất Cả Pages & Tạo APKG"
   - Đợi quá trình export hoàn thành
   - Download file APKG

### Phương pháp 2: Upload ZIP/HTML

1. **Export từ Notion**
   - Mở page trong Notion
   - Click "..." → Export
   - Chọn Export format: **HTML**
   - Include subpages: Tùy chọn
   - Download file ZIP

2. **Upload và Convert**
   - Kéo thả file ZIP vào drop zone hoặc click để chọn
   - Nhập tên deck
   - Click "Xử lý & Export APKG"
   - Download file APKG

## 📋 Cấu trúc Deck

Khi export nhiều pages, cấu trúc deck sẽ như sau:

```
Main Deck Name
├── Page 1 Deck Name
│   ├── Note 1
│   ├── Note 2
│   └── ...
├── Page 2 Deck Name
│   ├── Note 1
│   └── ...
└── Page 3 Deck Name
    └── ...
```

**Ví dụ:**

```
Notion Collection
├── Japanese::Vocabulary
│   ├── 50 notes
│   └── ...
├── Japanese::Grammar
│   ├── 30 notes
│   └── ...
└── Math::Calculus
    ├── 25 notes
    └── ...
```

## 📝 Định dạng Notion

### Basic Notes (Q&A)

Sử dụng **Toggle blocks** trong Notion:

```
▶ What is the capital of France?
  Paris
```

Sẽ tạo flashcard:
- **Front**: What is the capital of France?
- **Back**: Paris

### Cloze Notes (Fill-in-the-blank)

Sử dụng `{{c1::text}}` trong Notion:

```
▶ The capital of France is {{c1::Paris}}
  (any content here)
```

Sẽ tạo cloze card:
- **Text**: The capital of France is {{c1::Paris}}

## 🎨 Tính năng nâng cao

### Lưu trữ tự động
- Danh sách pages được tự động lưu vào localStorage
- Không mất dữ liệu khi refresh trang

### Thống kê chi tiết
- Tổng số notes
- Số lượng Basic notes vs Cloze notes
- Số lượng media files
- Thống kê theo từng deck

### Quản lý linh hoạt
- Thêm pages không giới hạn
- Sửa thông tin bất kỳ lúc nào
- Xóa từng page hoặc xóa tất cả

## ⚠️ Lưu ý quan trọng

### CORS Restrictions
Do hạn chế CORS của trình duyệt, export trực tiếp từ Notion có thể không hoạt động trên một số trình duyệt. Nếu gặp lỗi:

1. Sử dụng phương pháp Upload ZIP/HTML
2. Hoặc cài đặt backend server (xem phần Development)

### Token Security
- **KHÔNG BAO GIỜ** chia sẻ token_v2 của bạn
- Token có quyền truy cập đầy đủ vào Notion workspace
- Sử dụng trong môi trường an toàn

### Page ID
Có thể lấy Page ID từ URL:
```
https://notion.so/Page-Name-abc123def456...
                              ^^^^^^^^^^^^^^^^
                                  Page ID
```

## 🛠️ Cài đặt & Development

### Requirements
- Modern web browser (Chrome, Firefox, Edge)
- Không cần cài đặt thêm

### Local Development
```bash
# Clone repository
git clone https://github.com/yourusername/notion2anki-complete.git

# Mở file index.html trong browser
# Hoặc sử dụng local server:
python -m http.server 8000
# Truy cập: http://localhost:8000
```

### File Structure
```
notion2anki-complete/
├── index.html          # Main HTML file
├── style.css           # Styling
├── app.js              # Main application logic (Multi-page support)
├── notion-export.js    # Notion API integration
├── anki-builder.js     # APKG file builder
└── README.md           # Documentation
```

## 🔧 Troubleshooting

### Không tìm thấy toggle blocks
- Đảm bảo bạn sử dụng **Toggle blocks** trong Notion
- Toggle blocks có icon ▶ ở đầu

### Lỗi CORS khi export trực tiếp
- Sử dụng phương pháp Upload ZIP/HTML
- Hoặc cài đặt CORS browser extension (không khuyến khích)

### Media không hiển thị
- Đảm bảo checkbox "Bao gồm media" được chọn
- Check file ZIP có chứa media files
- Media phải ở định dạng được hỗ trợ

### Page không được thêm vào danh sách
- Check Page ID có đúng không
- Check tên deck không để trống
- Check không trùng với page đã có

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

- GitHub Issues: [Create an issue](https://github.com/yourusername/notion2anki-complete/issues)
- Email: your-email@example.com

## 🙏 Credits

- Built with ❤️ for Notion & Anki users
- Uses [JSZip](https://stuk.github.io/jszip/) for ZIP handling
- Uses [sql.js](https://github.com/sql-js/sql.js) for SQLite in browser

## 📚 Related Projects

- [Anki](https://apps.ankiweb.net/) - Spaced repetition flashcard app
- [Notion](https://notion.so/) - All-in-one workspace

---

**Disclaimer**: This tool uses Notion's unofficial API. Use at your own risk. Not affiliated with Notion or Anki.
