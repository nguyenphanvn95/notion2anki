# Ví dụ sử dụng Notion2Anki Web

## 📚 Các trường hợp sử dụng

### 1. Học từ vựng

**Notion structure:**
```
Page: English Vocabulary

▼ Ubiquitous
  <b>IPA:</b> /juːˈbɪkwɪtəs/
  <b>Part of speech:</b> adjective
  <b>Definition:</b> Present, appearing, or found everywhere
  <b>Example:</b> Mobile phones are <i>ubiquitous</i> in modern society.

▼ Ephemeral  
  <b>IPA:</b> /ɪˈfem(ə)r(ə)l/
  <b>Part of speech:</b> adjective
  <b>Definition:</b> Lasting for a very short time
  <b>Example:</b> Fashion trends are often <i>ephemeral</i>.

▼ Pragmatic
  <b>IPA:</b> /præɡˈmætɪk/
  <b>Part of speech:</b> adjective
  <b>Definition:</b> Dealing with things sensibly and realistically
  <b>Example:</b> We need a <i>pragmatic</i> approach to solve this problem.
```

**Result:** 3 Basic notes với formatting đẹp

---

### 2. Học lập trình

**Notion structure:**
```
Page: Python Programming

▼ What is a list comprehension in Python?
  A concise way to create lists.
  
  Syntax: <code>[expression for item in iterable]</code>
  
  Example:
  <pre>
  squares = [x**2 for x in range(10)]
  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
  </pre>

▼ Explain the difference between == and is
  <b>==</b> compares values
  <b>is</b> compares object identity (memory location)
  
  Example:
  <pre>
  a = [1, 2, 3]
  b = [1, 2, 3]
  a == b  # True (same values)
  a is b  # False (different objects)
  </pre>
```

**Result:** 2 Basic notes với code formatting

---

### 3. Học lịch sử (Cloze deletions)

**Notion structure:**
```
Page: World History

▼ World War II ended in {{c1::1945}}
  The war ended after {{c2::atomic bombs}} were dropped on {{c3::Hiroshima}} and {{c4::Nagasaki}}.

▼ {{c1::Christopher Columbus}} discovered America in {{c2::1492}}
  He was sponsored by {{c3::Spain}} and landed in the {{c4::Bahamas}}.

▼ The {{c1::Industrial Revolution}} began in {{c2::England}} around {{c3::1760}}
  Key inventions: {{c4::steam engine}}, {{c5::spinning jenny}}, {{c6::power loom}}
```

**Result:** 3 Cloze notes với multiple deletions

---

### 4. Học công thức (Math/Physics)

**Notion structure:**
```
Page: Physics Formulas

▼ Newton's Second Law
  <b>Formula:</b> F = ma
  
  Where:
  • F = Force (Newtons)
  • m = mass (kg)  
  • a = acceleration (m/s²)

▼ Kinetic Energy
  <b>Formula:</b> KE = ½mv²
  
  Where:
  • KE = Kinetic Energy (Joules)
  • m = mass (kg)
  • v = velocity (m/s)

▼ The area of a circle is {{c1::πr²}}
  Where {{c2::r}} is the {{c3::radius}}
```

**Result:** 2 Basic + 1 Cloze note

---

### 5. Học ngôn ngữ với ảnh

**Notion structure:**
```
Page: Japanese Vocabulary

▼ 猫 (neko)
  <b>Meaning:</b> Cat
  <b>Reading:</b> ねこ
  <img src="cat.jpg">

▼ 犬 (inu)
  <b>Meaning:</b> Dog  
  <b>Reading:</b> いぬ
  <img src="dog.jpg">
```

**Result:** 2 Basic notes với ảnh (nếu ảnh có trong ZIP)

---

### 6. Q&A Style

**Notion structure:**
```
Page: Interview Prep

▼ What is polymorphism?
  Polymorphism allows objects of different classes to be treated as objects of a common superclass.
  
  <b>Types:</b>
  1. Compile-time (Method Overloading)
  2. Runtime (Method Overriding)

▼ Explain the SOLID principles
  <b>S</b> - Single Responsibility Principle
  <b>O</b> - Open/Closed Principle
  <b>L</b> - Liskov Substitution Principle
  <b>I</b> - Interface Segregation Principle
  <b>D</b> - Dependency Inversion Principle
```

**Result:** 2 Basic notes

---

## 🎨 Formatting Tips

### HTML trong Notion export

Notion export hỗ trợ các HTML tags:

- `<b>text</b>` - Bold
- `<i>text</i>` - Italic
- `<code>text</code>` - Inline code
- `<pre>code</pre>` - Code block
- `<img src="...">` - Image
- `<ul><li>...</li></ul>` - Lists

### Cloze Deletions

Cú pháp:
```
{{c1::answer}}        - Cloze deletion 1
{{c2::answer}}        - Cloze deletion 2
{{c1::answer::hint}}  - With hint
```

Ví dụ:
```
▼ The capital of {{c1::France}} is {{c2::Paris}}
```
→ Tạo 2 cards:
- Card 1: "The capital of [...] is Paris"
- Card 2: "The capital of France is [...]"

---

## 📊 Statistics Example

Nếu bạn có 50 toggle blocks:
- 30 Basic notes
- 20 Cloze notes (mỗi cái có 3 deletions trung bình)

**Result:**
- Total notes: 50
- Total cards: 30 + (20 × 3) = 90 cards
- Deck: 1 deck với 90 cards

---

## 🔄 Workflow Example

### Use Case: Học 100 từ vựng IELTS

1. **Tạo Notion page:**
   - Title: "IELTS Vocabulary - Band 7-8"

2. **Thêm toggle blocks:**
   ```
   ▼ Word 1
     Definition, examples, etc.
   
   ▼ Word 2
     ...
   
   (repeat 100 times)
   ```

3. **Export:**
   - Export → HTML → Download ZIP

4. **Process:**
   - Upload ZIP → Export APKG
   - Time: ~10 seconds

5. **Import to Anki:**
   - Import .apkg
   - Start reviewing!

6. **Update later:**
   - Thêm 20 từ mới vào Notion
   - Re-export → Re-import
   - Anki sẽ merge (không duplicate)

---

## 💡 Best Practices

### 1. Consistent Structure

Giữ format nhất quán:
```
▼ Term/Question
  Definition/Answer
  Additional info
  Examples
```

### 2. One Concept Per Card

❌ Bad:
```
▼ Python basics
  Variables, loops, functions, classes...
```

✅ Good:
```
▼ What is a variable in Python?
  A container for storing data values

▼ What is a loop in Python?
  A way to repeat code multiple times
```

### 3. Use Images Wisely

- Keep images small (<500KB each)
- Use relevant images
- Don't overload one page with too many images

### 4. Test Before Large Export

- Create 5-10 test cards
- Export & import to Anki
- Verify formatting
- Then do full export

---

## 🎯 Advanced: Mixed Content

**Notion structure:**
```
Page: Biology Chapter 1

▼ What is photosynthesis?
  The process by which plants convert light energy into chemical energy.
  
  <b>Equation:</b> 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂

▼ Photosynthesis occurs in {{c1::chloroplasts}}
  Which contain {{c2::chlorophyll}} that absorbs {{c3::light energy}}

▼ Parts of a plant cell
  <img src="plant-cell.png">
  Label: nucleus, chloroplast, cell wall, vacuole
```

**Result:**
- 1 Basic (explanation)
- 1 Cloze (3 cards)
- 1 Basic with image

Total: 3 notes, 5 cards

---

## 📱 Real-world Example

Một student học TOEFL có thể:

1. **Notion workspace:**
   - Page 1: Reading Vocabulary (200 words)
   - Page 2: Listening Phrases (150 phrases)
   - Page 3: Speaking Topics (50 topics)
   - Page 4: Writing Templates (20 templates)

2. **Export process:**
   - Export each page separately
   - Or export root page with "Include subpages"

3. **Result:**
   - 420 notes total
   - Mix of Basic and Cloze
   - Organized in 1 master deck or 4 separate decks

4. **Study:**
   - Review in Anki daily
   - Update Notion when needed
   - Re-export periodically

---

**Happy Learning! 📚✨**
