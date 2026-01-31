# Changelog

## Version 2.0.0 - Multi-Page Edition (2024)

### 🎉 Tính năng mới chính

#### Multi-Page Export
- **Quản lý nhiều pages**: Thêm, sửa, xóa nhiều Notion pages trong một danh sách
- **Tên deck riêng biệt**: Mỗi page có thể có tên sub-deck riêng
- **Deck phân cấp**: Tất cả sub-decks được tổ chức dưới một deck chính
- **Export batch**: Export tất cả pages trong một lần thực hiện

#### Quản lý Pages
- ✅ Thêm page mới với Page ID/URL và tên deck
- ✅ Sửa thông tin page (tên deck, cài đặt đệ quy)
- ✅ Xóa từng page hoặc xóa tất cả
- ✅ Hiển thị danh sách pages với thông tin đầy đủ

#### Lưu trữ & Persistence
- 💾 Tự động lưu danh sách pages vào localStorage
- 💾 Không mất dữ liệu khi refresh browser
- 💾 Load lại pages khi mở lại app

#### UI/UX Improvements
- 🎨 Giao diện quản lý pages trực quan
- 🎨 Form thêm/sửa page inline
- 🎨 Trạng thái editing rõ ràng
- 🎨 Empty state khi chưa có pages
- 🎨 Counter hiển thị số lượng pages

#### Thống kê nâng cao
- 📊 Thống kê tổng thể (total, basic, cloze, media)
- 📊 Thống kê theo từng deck
- 📊 Hiển thị chi tiết cho mỗi sub-deck

### 🔧 Cải tiến kỹ thuật

#### Code Organization
- Refactored page management logic
- Separated page state management
- Improved error handling for multi-page export
- Better progress tracking for batch operations

#### Performance
- Optimized rendering for large page lists
- Efficient localStorage operations
- Better memory management for multiple exports

### 🐛 Bug Fixes
- Fixed deck name validation
- Improved Page ID extraction from URLs
- Better error messages for failed exports
- Fixed progress bar updates during batch export

### 📝 Documentation
- Updated README with multi-page instructions
- New QUICKSTART guide in Vietnamese
- Comprehensive EXAMPLES with real-world use cases
- Better inline documentation

---

## Version 1.0.0 - Initial Release

### Core Features
- Export from Notion using token_v2
- Upload ZIP/HTML from Notion exports
- Auto-detect Basic and Cloze notes
- Media support (images, videos, audio)
- Progress tracking
- Statistics display
- APKG file generation

### Supported Note Types
- Basic notes (Q&A format)
- Cloze deletion notes

### Supported Media
- Images: PNG, JPG, GIF, WebP
- Videos: MP4
- Audio: MP3, WAV

### Browser Support
- Chrome/Chromium
- Firefox
- Edge
- Safari (limited)

---

## Planned Features (Future Versions)

### Version 2.1.0
- [ ] Import pages from Notion database
- [ ] Batch edit multiple pages at once
- [ ] Export to different file formats
- [ ] Custom note templates
- [ ] Tags support from Notion

### Version 2.2.0
- [ ] Sync with Anki directly (AnkiConnect)
- [ ] Scheduled auto-export
- [ ] Cloud backup for page configurations
- [ ] Collaboration features

### Version 3.0.0
- [ ] Desktop app (Electron)
- [ ] Mobile app
- [ ] Advanced filtering and search
- [ ] Analytics and learning insights

---

## Migration Guide

### From v1.0 to v2.0

**Breaking Changes:** None! V2.0 is fully backward compatible.

**New Features:**
1. You can now add multiple pages
2. Each page can have its own deck name
3. Pages are saved automatically

**How to Upgrade:**
1. Download the new version
2. Replace old files with new ones
3. Open index.html
4. Start adding pages!

**Note:** If you were using v1.0 for single-page exports, you can continue doing so by:
- Adding just one page to the list, OR
- Using the "Upload ZIP/HTML" tab (unchanged)

---

## Support & Feedback

- GitHub Issues: Report bugs or request features
- Email: your-email@example.com
- Discussions: Share your use cases and tips

---

**Thank you for using Notion2Anki!** 🙏
