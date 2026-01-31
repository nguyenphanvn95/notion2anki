# Ví Dụ Sử Dụng - Notion2Anki Multi-Page

## 📚 Các ví dụ thực tế

### Ví dụ 1: Học tiếng Nhật từ đầu

#### Cấu trúc Notion
```
📁 Japanese Learning (Main Page)
├── 📄 N5 Vocabulary (Page ID: abc123...)
│   ├── ▶ おはよう
│   │   Good morning
│   ├── ▶ ありがとう
│   │   Thank you
│   └── ...
├── 📄 N5 Grammar (Page ID: def456...)
│   ├── ▶ は particle
│   │   Topic marker. Example: 私は学生です
│   └── ...
└── 📄 Basic Kanji (Page ID: ghi789...)
    ├── ▶ 日
    │   Sun, day. Readings: にち、ひ、か
    └── ...
```

#### Setup trong Tool

**Bước 1**: Nhập Token
```
Notion Token: v02%3Auser_token_goes_here...
```

**Bước 2**: Nhập Deck Chính
```
Main Deck Name: Japanese Study
```

**Bước 3**: Thêm Pages

Page 1:
- Page URL/ID: `abc123...` (N5 Vocabulary)
- Sub-Deck Name: `N5::Vocabulary`
- Recursive: ☑️

Page 2:
- Page URL/ID: `def456...` (N5 Grammar)
- Sub-Deck Name: `N5::Grammar`
- Recursive: ☑️

Page 3:
- Page URL/ID: `ghi789...` (Basic Kanji)
- Sub-Deck Name: `Kanji::N5`
- Recursive: ☑️

#### Kết quả trong Anki
```
Japanese Study/
├── N5::Vocabulary (50 cards)
├── N5::Grammar (30 cards)
└── Kanji::N5 (45 cards)
Total: 125 cards
```

---

### Ví dụ 2: Lập trình Python

#### Cấu trúc Notion
```
📁 Python Course
├── 📄 Basics
│   ├── ▶ What is a variable?
│   │   A container for storing data values
│   ├── ▶ Python uses {{c1::indentation}} to define code blocks
│   │   Not curly braces like other languages
│   └── ...
├── 📄 Data Structures
│   ├── ▶ List vs Tuple
│   │   Lists are mutable, tuples are immutable
│   └── ...
└── 📄 OOP
    ├── ▶ What is a class?
    │   A blueprint for creating objects
    └── ...
```

#### Setup

```
Main Deck: Programming::Python
```

Pages:
1. Basics → `Python::Fundamentals`
2. Data Structures → `Python::Data Structures`
3. OOP → `Python::OOP`

#### Kết quả
```
Programming::Python/
├── Python::Fundamentals (40 cards)
├── Python::Data Structures (25 cards)
└── Python::OOP (30 cards)
```

---

### Ví dụ 3: Ôn thi IELTS

#### Cấu trúc
```
📁 IELTS Preparation
├── 📄 Vocabulary - Academic
│   ├── ▶ accumulate
│   │   (v) to gather or collect, often gradually
│   │   Example: Data accumulates over time
│   └── ...
├── 📄 Vocabulary - General
│   └── ...
├── 📄 Grammar Rules
│   ├── ▶ Present Perfect is used for {{c1::actions started in past}} that {{c2::continue to present}}
│   └── ...
├── 📄 Speaking Topics
│   └── ...
└── 📄 Writing Templates
    └── ...
```

#### Setup

```
Main Deck: IELTS Preparation
```

Pages:
1. Vocabulary - Academic → `Vocabulary::Academic`
2. Vocabulary - General → `Vocabulary::General`
3. Grammar Rules → `Grammar`
4. Speaking Topics → `Speaking`
5. Writing Templates → `Writing`

---

### Ví dụ 4: Lịch sử Việt Nam

#### Cấu trúc
```
📁 Vietnamese History
├── 📄 Ancient Period
│   ├── ▶ When did the Hùng Kings establish Văn Lang?
│   │   2879 BC (traditional date)
│   └── ...
├── 📄 Medieval Period
│   ├── ▶ The {{c1::Lý Dynasty}} ruled Vietnam from {{c2::1009}} to {{c3::1225}}
│   └── ...
├── 📄 French Colonial
│   └── ...
└── 📄 Modern Vietnam
    └── ...
```

#### Setup

```
Main Deck: History::Vietnam
```

Pages:
1. Ancient Period → `Ancient::Kings`
2. Medieval Period → `Medieval::Dynasties`
3. French Colonial → `Colonial::French`
4. Modern Vietnam → `Modern::20th Century`

---

### Ví dụ 5: Medical School Study

#### Cấu trúc
```
📁 Medical Studies
├── 📄 Anatomy - Cardiovascular
│   ├── ▶ The heart has {{c1::four}} chambers
│   │   2 atria and 2 ventricles
│   ├── ▶ Largest artery in body?
│   │   Aorta
│   └── ...
├── 📄 Anatomy - Respiratory
│   └── ...
├── 📄 Pharmacology - Antibiotics
│   └── ...
├── 📄 Pathology - Infections
│   └── ...
└── 📄 Clinical Cases
    └── ...
```

#### Setup

```
Main Deck: Medical School::Year 2
```

Pages:
1. Anatomy - Cardiovascular → `Anatomy::Cardiovascular`
2. Anatomy - Respiratory → `Anatomy::Respiratory`
3. Pharmacology - Antibiotics → `Pharmacology::Antibiotics`
4. Pathology - Infections → `Pathology::Infectious`
5. Clinical Cases → `Clinical::Cases`

---

## 🎯 Best Practices

### 1. Tổ chức Deck có hệ thống

**Tốt:**
```
Subject::Topic::Subtopic
```

**Ví dụ:**
```
Math::Calculus::Derivatives
Math::Calculus::Integrals
Math::Linear Algebra::Matrices
```

### 2. Sử dụng Cloze cho thông tin phức tạp

**Thay vì:**
```
▶ What are the three types of muscle?
  Skeletal, smooth, and cardiac
```

**Tốt hơn:**
```
▶ The three types of muscle are {{c1::skeletal}}, {{c2::smooth}}, and {{c3::cardiac}}
  Additional info here...
```

### 3. Nhóm nội dung liên quan

**Ví dụ:**
```
Chemistry::Organic::Reactions
Chemistry::Organic::Mechanisms
Chemistry::Organic::Synthesis
```

Thay vì rải rác:
```
Chemistry::Reactions
Chemistry::Mechanisms
Chemistry::Synthesis
```

---

## 🔧 Workflow Suggestions

### Workflow 1: Daily Study

1. **Sáng**: Tạo toggle blocks trong Notion khi học
2. **Tối**: Export batch pages về Anki
3. **Review**: Dùng Anki để ôn tập

### Workflow 2: Exam Preparation

1. **Week 1-2**: Tổng hợp notes trong Notion
2. **Week 3**: Organize thành pages theo chủ đề
3. **Week 4**: Export tất cả vào Anki
4. **Week 5+**: Intensive review với Anki

### Workflow 3: Language Learning

**Daily:**
- Add new vocab vào Notion
- Update grammar rules

**Weekly:**
- Export new pages
- Import vào Anki deck

**Monthly:**
- Review deck structure
- Reorganize nếu cần

---

## 📝 Template Pages

### Template 1: Vocabulary Page

```
📄 [Topic] Vocabulary

▶ word1
  definition
  example sentence
  synonyms: ...

▶ word2
  definition
  example sentence

...
```

### Template 2: Q&A Page

```
📄 [Topic] Questions

▶ Question 1?
  Answer 1
  Additional explanation...

▶ Question 2?
  Answer 2

...
```

### Template 3: Cloze Page

```
📄 [Topic] Fill-in-blanks

▶ Statement with {{c1::answer1}} and {{c2::answer2}}
  Context or explanation

▶ Another statement with {{c1::key term}}
  More info

...
```

---

## 🎨 Advanced Examples

### Example: Multi-level Deck

```
Main: Computer Science Degree

Pages:
1. CS Fundamentals → CS::Fundamentals
2. Data Structures → CS::Fundamentals::Data Structures
3. Algorithms → CS::Fundamentals::Algorithms
4. OOP → CS::Programming::OOP
5. Databases → CS::Systems::Databases
6. Networks → CS::Systems::Networks
```

Result in Anki:
```
Computer Science Degree/
├── CS::Fundamentals (base concepts)
├── CS::Fundamentals::Data Structures
├── CS::Fundamentals::Algorithms
├── CS::Programming::OOP
├── CS::Systems::Databases
└── CS::Systems::Networks
```

### Example: Cross-subject Study

```
Main: Final Exam 2024

Pages:
1. Math - Calculus → Math::Calculus
2. Math - Statistics → Math::Statistics
3. Physics - Mechanics → Physics::Mechanics
4. Physics - E&M → Physics::Electromagnetics
5. Chemistry - Organic → Chemistry::Organic
```

---

## 💡 Pro Tips

1. **Batch Export**: Tập hợp nhiều pages cùng topic trước khi export
2. **Naming Convention**: Giữ pattern nhất quán cho dễ quản lý
3. **Regular Updates**: Export định kỳ thay vì đợi đến cuối
4. **Backup**: Notion tự động backup, nhưng nên export APKG định kỳ
5. **Testing**: Export nhỏ trước để test format

---

Chúc bạn học tập hiệu quả! 📚✨
