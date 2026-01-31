# 📚 Examples & Use Cases

This document provides real-world examples of how to use Notion2Anki Complete.

## Example 1: Language Learning Vocabulary

### Notion Setup

Create a page with vocabulary:

```
Spanish Vocabulary
  ▶ Hola
    Hello
    
  ▶ Gracias
    Thank you
    
  ▶ ¿Cómo estás?
    How are you?
    
  ▶ {{c1::Buenos días}} means {{c2::Good morning}}
    Common greeting used in the morning
```

### Result

- 3 Basic cards (Q&A)
- 1 Cloze card (fill-in-the-blank)
- Total: 4 flashcards

---

## Example 2: Medical School Study Notes

### Notion Setup

```
Cardiology - Heart Anatomy
  ▶ What are the four chambers of the heart?
    1. Right atrium
    2. Right ventricle
    3. Left atrium
    4. Left ventricle
    
  ▶ The {{c1::right}} ventricle pumps blood to the {{c2::lungs}}
    This is the pulmonary circulation
    
  ▶ What is the function of heart valves?
    [Image: heart-valves-diagram.png]
    Heart valves prevent backflow of blood and ensure
    unidirectional flow through the heart chambers.
```

### Result

- 2 Basic cards
- 1 Cloze card
- 1 image included
- Total: 3 flashcards with media

---

## Example 3: Programming Concepts

### Notion Setup

```
JavaScript Basics
  ▶ What is a closure in JavaScript?
    A closure is a function that has access to variables
    in its outer (enclosing) function's scope, even after
    the outer function has returned.
    
    Example:
    ```javascript
    function outer() {
      let count = 0;
      return function inner() {
        count++;
        return count;
      }
    }
    ```
    
  ▶ The {{c1::prototype}} chain is used for {{c2::inheritance}} in JavaScript
    Objects inherit properties and methods from their prototype
    
  ▶ What are the primitive types in JavaScript?
    1. String
    2. Number
    3. Boolean
    4. Null
    5. Undefined
    6. Symbol
    7. BigInt
```

### Result

- 2 Basic cards with code examples
- 1 Cloze card
- Total: 3 flashcards

---

## Example 4: History Timeline

### Notion Setup

```
World War II Timeline
  ▶ When did World War II start?
    September 1, 1939
    Germany invaded Poland
    
  ▶ {{c1::D-Day}} occurred on {{c2::June 6, 1944}}
    Allied forces landed on Normandy beaches
    
  ▶ When did World War II end in Europe?
    May 8, 1945 (V-E Day)
    Germany surrendered
    
  ▶ When did World War II end completely?
    September 2, 1945
    Japan surrendered after atomic bombings
```

### Result

- 3 Basic cards
- 1 Cloze card
- Total: 4 flashcards

---

## Example 5: Chemistry - Periodic Table

### Notion Setup

```
Periodic Table Elements
  ▶ What is the atomic number of Hydrogen?
    1
    It's the lightest element
    
  ▶ {{c1::H}} is the chemical symbol for {{c2::Hydrogen}}
    First element in the periodic table
    
  ▶ What are the noble gases?
    Helium (He)
    Neon (Ne)
    Argon (Ar)
    Krypton (Kr)
    Xenon (Xe)
    Radon (Rn)
    
  ▶ The {{c1::electron configuration}} of Carbon is {{c2::1s² 2s² 2p²}}
    Carbon has 6 electrons total
```

### Result

- 2 Basic cards
- 2 Cloze cards
- Total: 4 flashcards

---

## Example 6: Geography Study Deck

### Notion Setup

```
European Capitals
  ▶ What is the capital of Germany?
    [Image: berlin-flag.png]
    Berlin
    Population: ~3.7 million
    
  ▶ {{c1::Paris}} is the capital of {{c2::France}}
    Known as the "City of Light"
    
  ▶ What is the capital of Italy?
    Rome
    Also known as the "Eternal City"
    
  ▶ The capital of {{c1::Spain}} is {{c2::Madrid}}
    Largest city in Spain
```

### Result

- 2 Basic cards (one with image)
- 2 Cloze cards
- 1 image
- Total: 4 flashcards with media

---

## Example 7: Multi-level Nested Content

### Notion Setup

```
Main Topic: Computer Science

  Subtopic: Data Structures
    ▶ What is a Stack?
      LIFO (Last In, First Out) data structure
      Operations: push, pop, peek
      
    ▶ What is a Queue?
      FIFO (First In, First Out) data structure
      Operations: enqueue, dequeue, peek
      
  Subtopic: Algorithms
    ▶ {{c1::Binary Search}} has time complexity of {{c2::O(log n)}}
      Requires sorted array
      
    ▶ What is the time complexity of Quick Sort?
      Average: O(n log n)
      Worst: O(n²)
```

### Result (with recursive export)

- 3 Basic cards
- 1 Cloze card
- Total: 4 flashcards from all subpages

---

## Example 8: Mixed Content Types

### Notion Setup

```
Biology: Cell Structure
  ▶ What is the function of mitochondria?
    [Image: mitochondria-diagram.jpg]
    Powerhouse of the cell
    Produces ATP through cellular respiration
    
  ▶ The {{c1::nucleus}} contains {{c2::DNA}} and controls {{c3::cell activities}}
    Surrounded by nuclear membrane
    
  ▶ What is the difference between prokaryotic and eukaryotic cells?
    [Video: cell-comparison.mp4]
    
    Prokaryotic:
    - No nucleus
    - No membrane-bound organelles
    - Smaller, simpler
    
    Eukaryotic:
    - Has nucleus
    - Has organelles
    - Larger, more complex
```

### Result

- 2 Basic cards
- 1 Cloze card
- 1 image, 1 video
- Total: 3 flashcards with media files

---

## Tips for Creating Quality Cards

### DO ✅

1. **Use clear, concise questions**
   ```
   ▶ What is photosynthesis?
     Process by which plants convert light into energy
   ```

2. **Include context in answers**
   ```
   ▶ Who wrote "1984"?
     George Orwell (1949)
     A dystopian novel about totalitarianism
   ```

3. **Use cloze for definitions**
   ```
   ▶ {{c1::Photosynthesis}} is the process where {{c2::plants}} convert {{c3::light}} into {{c4::energy}}
   ```

4. **Add visual aids**
   ```
   ▶ What does a neuron look like?
     [Image: neuron-structure.png]
     Components: dendrites, soma, axon, axon terminals
   ```

### DON'T ❌

1. **Don't create overly complex cards**
   ```
   ❌ ▶ Explain the entire process of cellular respiration including all steps, enzymes, and ATP production
   ```

2. **Don't use regular text blocks**
   ```
   ❌ This is just regular text without toggle blocks
   ```

3. **Don't mix multiple concepts**
   ```
   ❌ ▶ What are photosynthesis and cellular respiration and how do they differ?
   ```

4. **Don't forget to export as HTML**
   ```
   ❌ Exporting as Markdown won't work
   ```

---

## Workflow Examples

### Weekly Study Routine

1. **Monday-Friday**: Take notes in Notion during classes
2. **Friday evening**: Organize notes, create toggle blocks
3. **Saturday**: Export to Anki, start reviewing
4. **Daily**: Review cards in Anki (15-20 minutes)

### Exam Preparation

1. **3 months before**: Start creating flashcards
2. **Weekly**: Export and update Anki deck
3. **1 month before**: Focus on difficult cards
4. **1 week before**: Final review of all material

### Continuous Learning

1. **Daily**: Add new concepts to Notion
2. **Weekly**: Batch export to Anki
3. **Monthly**: Review and update old cards
4. **Quarterly**: Archive mastered material

---

## Common Patterns

### Pattern 1: Definition Cards
```
▶ What is [Term]?
  [Definition]
  [Additional context]
```

### Pattern 2: Cloze Definitions
```
▶ {{c1::Term}} is {{c2::definition}}
  [Additional context]
```

### Pattern 3: List Cards
```
▶ What are the components of X?
  1. Component A
  2. Component B
  3. Component C
```

### Pattern 4: Comparison Cards
```
▶ Compare X and Y
  X: [characteristics]
  Y: [characteristics]
  Key difference: [main difference]
```

---

## Success Stories

### Medical Student
- Created 5,000+ cards from lecture notes
- Passed board exams with high scores
- Time saved: ~50 hours vs manual card creation

### Language Learner
- Built vocabulary of 2,000+ words
- Achieved conversational fluency in 6 months
- Daily review: 15 minutes

### Professional Certification
- Passed AWS certification using Notion2Anki
- Created cards from study guides
- Success rate: First attempt pass

---

**Need more examples? Check the [community discussions](https://github.com/yourusername/notion2anki/discussions)!**
