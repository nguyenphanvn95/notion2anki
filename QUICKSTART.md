# 🚀 Quick Start Guide

Get started with Notion2Anki Complete in 5 minutes!

## Method 1: Upload Exported File (Recommended)

### Step 1: Export from Notion

1. Open your Notion page with flashcards
2. Click the "..." menu (top right)
3. Select "Export"
4. Choose these settings:
   - **Export format**: HTML
   - **Include subpages**: Your choice
   - **Create folders for subpages**: Your choice
5. Click "Export"
6. Download the ZIP file

### Step 2: Convert to APKG

1. Open the Notion2Anki website
2. Go to "Upload ZIP/HTML" tab
3. Drag and drop your ZIP file (or click to browse)
4. (Optional) Change deck name
5. Click "Process & Export APKG"
6. Wait for download to complete

### Step 3: Import to Anki

1. Open Anki
2. File → Import
3. Select the downloaded .apkg file
4. Click "Import"
5. Done! Start studying! 🎉

---

## Method 2: Direct Export from Notion

### Step 1: Get Notion Token

1. Open [Notion](https://notion.so) in Chrome/Firefox
2. Press `F12` (or Right-click → Inspect)
3. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
4. Click **Cookies** → `https://www.notion.so`
5. Find cookie named `token_v2`
6. **Copy the entire Value** (long string)

⚠️ **Security Warning**: Keep this token private! It gives full access to your Notion account.

### Step 2: Get Page ID

**Option A: From URL**
```
https://notion.so/workspace/Page-Title-abc123def456ghi789
                                         ^^^^^^^^^^^^^^^^^^
                                         This is your page ID
```

**Option B: Just use full URL**
- The app will automatically extract the ID

### Step 3: Export

1. Go to "Export from Notion" tab
2. Paste your token
3. Paste page URL or ID
4. Choose recursive export (if you want subpages)
5. Click "Export from Notion & Create APKG"
6. Wait for download

### Step 4: Import to Anki

Same as Method 1, Step 3 above.

---

## 📝 How to Create Flashcards in Notion

### Basic Cards (Q&A)

Use toggle blocks:

```
▶ Question here?
  Answer here
```

**Example:**
```
▶ What is the capital of France?
  Paris. It's also known as the City of Light.
```

### Cloze Deletions (Fill-in-the-Blank)

Use Anki cloze syntax:

```
▶ {{c1::Paris}} is the capital of {{c2::France}}.
  Additional notes (optional)
```

**Example:**
```
▶ The {{c1::mitochondria}} is the {{c2::powerhouse}} of the cell.
  It produces ATP through cellular respiration.
```

### With Images

Just add images inside your toggle blocks:

```
▶ What animal is this?
  [Image of a dog]
  This is a dog.
```

---

## 🎯 Tips for Best Results

### Notion Page Structure

✅ **Good:**
```
Main Page
  ▶ Toggle 1: Question 1
    Answer 1
  ▶ Toggle 2: Question 2
    Answer 2
  ▶ Toggle 3: Question 3
    Answer 3
```

❌ **Bad:**
```
Main Page
  - Bullet point 1
  - Bullet point 2
  Regular paragraph text
```

### Toggle Block Best Practices

1. **Keep questions concise**: Short, clear questions work best
2. **One concept per card**: Don't pack too much into one card
3. **Use formatting**: Bold, italic, code blocks all work
4. **Add context**: Extra info in the answer helps retention

### Cloze Tips

1. **Number your clozes**: `{{c1::}}`, `{{c2::}}`, etc.
2. **Group related info**: Use same number for related deletions
3. **Don't overdo it**: 2-3 deletions per card is optimal

---

## ⚠️ Common Issues

### "No toggle blocks found"

**Problem**: Your Notion page doesn't have toggle blocks.

**Solution**: Use toggle blocks (▶) to create flashcards.

### "CORS error"

**Problem**: Browser blocking direct Notion API access.

**Solution**: Use Method 1 (Upload File) instead.

### "Invalid token"

**Problem**: Token is wrong or expired.

**Solution**: 
1. Get a fresh token from browser cookies
2. Make sure you copied the entire value
3. Check you're logged into Notion

### "No HTML file found"

**Problem**: ZIP file doesn't contain HTML.

**Solution**: Make sure to export as HTML format, not Markdown.

---

## 📱 Browser Compatibility

✅ **Fully Supported:**
- Chrome/Chromium
- Firefox
- Edge
- Safari

⚠️ **Partial Support:**
- Older browsers (update recommended)

❌ **Not Supported:**
- Internet Explorer

---

## 🎓 Example Workflows

### For Students

1. Take notes in Notion during lecture
2. Use toggle blocks for key concepts
3. Export at end of week
4. Import to Anki for review

### For Language Learners

1. Create vocabulary list in Notion
2. Format as toggles (word → translation)
3. Add images for visual learning
4. Export and study in Anki

### For Professionals

1. Build knowledge base in Notion
2. Create Q&A for important concepts
3. Regular exports to Anki
4. Spaced repetition for retention

---

## 🔄 Regular Workflow

1. **Create/Update** notes in Notion
2. **Export** when ready (weekly/monthly)
3. **Import** to Anki
4. **Study** with spaced repetition
5. **Repeat** as needed

---

## 💡 Pro Tips

1. **Deck Organization**: Use clear deck names
2. **Tags**: Add tags in Notion for better organization
3. **Media**: Compress large images before adding
4. **Backup**: Keep your .apkg files as backups
5. **Updates**: Re-export to update existing decks

---

## 🆘 Need More Help?

- 📖 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/yourusername/notion2anki/issues)
- 💬 [Community Forum](https://github.com/yourusername/notion2anki/discussions)
- 📧 [Email Support](mailto:support@example.com)

---

**You're all set! Happy studying!** 📚✨
