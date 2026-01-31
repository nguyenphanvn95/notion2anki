# 🧠 Notion2Anki Complete

**The ultimate tool to convert Notion pages into Anki flashcards**

Export Notion pages directly OR upload exported ZIP/HTML files → Automatically convert to Anki APKG format with support for:
- ✅ Basic flashcards
- ✅ Cloze deletions
- ✅ Media files (images, videos, audio)
- ✅ Automatic note type detection

## 🌟 Features

### Two Ways to Create Flashcards

1. **Direct Export from Notion** ⚡
   - Enter your Notion token and page URL
   - Export directly from Notion API
   - One-click conversion to APKG

2. **Upload Exported Files** 📤
   - Export from Notion manually
   - Upload ZIP or HTML file
   - Convert to APKG

### Smart Features

- 🤖 **Auto-detect note types**: Automatically identifies Basic and Cloze cards
- 📦 **Media support**: Includes images, videos, and audio files
- 🎨 **Clean interface**: Modern, responsive design
- 📊 **Statistics**: See note counts and types before export
- 💾 **Offline capable**: Works entirely in your browser

## 🚀 Quick Start

### Option 1: Direct Export from Notion

1. **Get your Notion token**:
   - Open Notion in your browser and log in
   - Press F12 to open Developer Tools
   - Go to Application → Cookies → notion.so
   - Find and copy the `token_v2` cookie value

2. **Export a page**:
   - Go to "Export from Notion" tab
   - Paste your token
   - Enter page URL or ID
   - Click "Export from Notion & Create APKG"

### Option 2: Upload Exported File

1. **Export from Notion**:
   - Open your Notion page
   - Click "..." → Export
   - Choose format: **HTML**
   - Download the ZIP file

2. **Convert to APKG**:
   - Go to "Upload ZIP/HTML" tab
   - Upload the downloaded file
   - Click "Process & Export APKG"

## 📖 How to Create Flashcards in Notion

### Basic Flashcards

Use toggle blocks in Notion:

```
▶ What is the capital of France?
  Paris
```

The summary (question) becomes the **Front**, and the content becomes the **Back**.

### Cloze Deletions

Use Anki cloze syntax:

```
▶ {{c1::Paris}} is the capital of France.
  Additional information here (optional)
```

The app automatically detects cloze patterns and creates cloze cards.

### With Media

Simply include images or videos in your toggle blocks. They will be automatically extracted and included in the APKG file.

## 🎯 Use Cases

- 📚 **Students**: Convert lecture notes to flashcards
- 🌍 **Language learners**: Create vocabulary decks
- 💼 **Professionals**: Build knowledge bases
- 🎓 **Educators**: Share study materials with students
- 📝 **Content creators**: Organize information for later review

## 🔧 Technical Details

### Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Internet connection (for libraries)

### Libraries Used

- [sql.js](https://github.com/sql-js/sql.js/) - SQLite in browser
- [JSZip](https://stuk.github.io/jszip/) - ZIP file handling
- [Font Awesome](https://fontawesome.com/) - Icons

### File Structure

```
notion2anki-complete/
├── index.html          # Main HTML interface
├── style.css           # Styles
├── app.js              # Main application logic
├── notion-export.js    # Notion API integration
├── anki-builder.js     # APKG file builder
└── README.md          # This file
```

## ⚠️ Important Notes

### CORS Limitations

Due to browser CORS (Cross-Origin Resource Sharing) restrictions, **direct export from Notion may not work** in all browsers or configurations.

**If you encounter CORS errors**:
1. Use the "Upload ZIP/HTML" tab instead
2. Or use our backend server (see Advanced Setup below)

### Token Security

- ⚠️ **Never share your token_v2** with anyone
- The token provides full access to your Notion account
- This app processes everything locally in your browser
- Your token is never sent to any external server (except Notion API)

### Unofficial API

This tool uses Notion's **unofficial API**, which may change without notice. If export stops working, please:
1. Check for updates
2. Report issues on GitHub
3. Use the manual upload method as a fallback

## 🚀 Advanced Setup (Optional)

### Backend Server for CORS

To avoid CORS issues, you can run a backend proxy server:

1. **Install Python dependencies**:
   ```bash
   pip install flask flask-cors requests
   ```

2. **Create `server.py`**:
   ```python
   # See DEPLOYMENT.md for full server code
   ```

3. **Run server**:
   ```bash
   python server.py
   ```

4. **Update frontend**:
   Edit `notion-export.js` to use your backend URL

### Deploy to GitHub Pages

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/notion2anki.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Select source: main branch
   - Your site: `https://yourusername.github.io/notion2anki/`

## 📊 Statistics & Analytics

After conversion, you'll see:
- **Total Notes**: Number of flashcards created
- **Basic Notes**: Traditional Q&A cards
- **Cloze Notes**: Fill-in-the-blank cards
- **Media Files**: Number of images/videos included

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

- Inspired by [notion2anki](https://github.com/alemayhu/notion2anki) addon
- Built with love for the Notion and Anki communities

## 💬 Support

- 📖 [Documentation](https://github.com/yourusername/notion2anki/wiki)
- 🐛 [Report Bug](https://github.com/yourusername/notion2anki/issues)
- 💡 [Request Feature](https://github.com/yourusername/notion2anki/issues)

## 🎓 Tutorials

### Video Tutorials
- Coming soon!

### Written Guides
- [Complete Beginner's Guide](docs/beginners-guide.md)
- [Advanced Usage](docs/advanced-usage.md)
- [Troubleshooting](docs/troubleshooting.md)

## 📈 Roadmap

- [ ] Support for more note types (Image Occlusion, etc.)
- [ ] Batch export multiple pages
- [ ] Tag management
- [ ] Deck hierarchy support
- [ ] Browser extension version
- [ ] Desktop app (Electron)
- [ ] Mobile app support

## ⭐ Show Your Support

If you find this tool useful, please:
- ⭐ Star the repository
- 🐦 Share on social media
- 📝 Write a blog post about it
- 💬 Tell your friends

---

Made with ❤️ for students, learners, and knowledge enthusiasts everywhere.

**Happy studying!** 📚✨
