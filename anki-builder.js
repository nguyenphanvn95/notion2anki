/**
 * Anki APKG Builder Module
 * Parses HTML and builds Anki APKG files
 */

let SQL_INSTANCE = null;

// Initialize sql.js
async function ensureSqlReady() {
    if (SQL_INSTANCE) return SQL_INSTANCE;
    
    if (typeof initSqlJs === 'undefined') {
        throw new Error('sql.js not loaded');
    }
    
    SQL_INSTANCE = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    
    return SQL_INSTANCE;
}

// Parse HTML to notes with better toggle detection
function parseHtmlToNotes(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const notes = [];
    
    console.log('=== Starting HTML Parsing ===');
    console.log('HTML length:', html.length);
    
    // Method 1: Find <details> tags (standard toggle)
    let toggles = doc.querySelectorAll('details');
    console.log('Method 1 - Found <details> tags:', toggles.length);
    
    // Method 2: Find toggle-like structures with data attributes
    if (toggles.length === 0) {
        toggles = doc.querySelectorAll('[class*="toggle"], [data-block-id*="toggle"]');
        console.log('Method 2 - Found toggle-like elements:', toggles.length);
    }
    
    // Method 3: Find div structures that look like toggles
    if (toggles.length === 0) {
        // Look for common Notion toggle patterns
        const possibleToggles = doc.querySelectorAll('.notion-toggle-block, .notion-selectable.notion-toggle-block, div[data-block-id]');
        console.log('Method 3 - Found possible toggle elements:', possibleToggles.length);
        
        // Filter to only those that have toggle-like structure
        const filteredToggles = [];
        possibleToggles.forEach(el => {
            const hasHeader = el.querySelector('.notion-toggle__summary, summary, [role="button"]');
            const hasContent = el.querySelector('.notion-toggle__content, .notion-toggle__children');
            if (hasHeader || hasContent || el.children.length >= 2) {
                filteredToggles.push(el);
            }
        });
        toggles = filteredToggles;
        console.log('Method 3 - Filtered toggle elements:', toggles.length);
    }
    
    // Method 4: Look for any nested structure (fallback)
    if (toggles.length === 0) {
        console.log('Method 4 - Looking for generic nested structures...');
        const allDivs = doc.querySelectorAll('div');
        const nestedStructures = [];
        
        allDivs.forEach(div => {
            // Check if it has a header-like first child and content children
            if (div.children.length >= 2) {
                const firstChild = div.children[0];
                const hasHeaderText = firstChild.textContent.trim().length > 0;
                const hasOtherContent = div.children.length > 1;
                
                if (hasHeaderText && hasOtherContent) {
                    nestedStructures.push(div);
                }
            }
        });
        
        console.log('Method 4 - Found nested structures:', nestedStructures.length);
        toggles = nestedStructures.slice(0, 200); // Limit to avoid noise
    }
    
    console.log('Total toggles to process:', toggles.length);
    
    // Process each toggle
    toggles.forEach((toggle, index) => {
        try {
            let front = '';
            let back = '';
            
            // Extract front (question/summary)
            const summary = toggle.querySelector('summary, .notion-toggle__summary, [role="button"]');
            if (summary) {
                front = summary.textContent.trim();
            } else {
                // Fallback: use first child
                if (toggle.children.length > 0) {
                    front = toggle.children[0].textContent.trim();
                }
            }
            
            if (!front) {
                console.log(`Skip toggle ${index}: no front content`);
                return;
            }
            
            // Extract back (answer/content)
            const contentContainer = toggle.querySelector('.notion-toggle__content, .notion-toggle__children');
            if (contentContainer) {
                back = contentContainer.innerHTML.trim();
            } else {
                // Fallback: use all children except the first (which is the header)
                const contentElements = Array.from(toggle.children).filter((el, idx) => idx > 0);
                contentElements.forEach(el => {
                    back += el.outerHTML || el.textContent;
                });
            }
            
            // If still no back content, try to get text content
            if (!back && toggle.tagName === 'DETAILS') {
                const contentElements = Array.from(toggle.children).filter(el => el.tagName !== 'SUMMARY');
                contentElements.forEach(el => {
                    back += el.outerHTML || el.textContent;
                });
            }
            
            // Clean up back content
            back = back.trim();
            
            // Auto-detect cloze
            const isCloze = detectCloze(front + ' ' + back);
            
            // Extract media
            const media = extractMediaFromElement(toggle);
            
            const note = {
                front: front,
                back: back,
                isCloze: isCloze,
                media: media,
                tags: []
            };
            
            notes.push(note);
            
            if (index < 5) {
                console.log(`Note ${index}:`, {
                    front: front.substring(0, 50),
                    back: back.substring(0, 50),
                    isCloze
                });
            }
            
        } catch (err) {
            console.error(`Error parsing toggle ${index}:`, err);
        }
    });
    
    console.log('=== Parsing Complete ===');
    console.log('Total notes created:', notes.length);
    
    return notes;
}

// Detect if note is cloze type
function detectCloze(text) {
    const clozePattern = /\{\{c\d+::.+?\}\}/;
    return clozePattern.test(text);
}

// Extract media from element
function extractMediaFromElement(element) {
    const media = [];
    
    const images = element.querySelectorAll('img');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            media.push({
                type: 'image',
                src: src,
                filename: src.split('/').pop()
            });
        }
    });
    
    const videos = element.querySelectorAll('video');
    videos.forEach(video => {
        const src = video.getAttribute('src');
        if (src) {
            media.push({
                type: 'video',
                src: src,
                filename: src.split('/').pop()
            });
        }
    });
    
    return media;
}

// Simple hash function
function sha1ish(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

// Build field objects for note type
function buildFieldObjects(names) {
    return names.map((name, idx) => ({
        name,
        ord: idx,
        sticky: false,
        rtl: false,
        font: "Arial",
        size: 20,
        description: "",
        plainText: false,
        collapsed: false,
        excludeFromSearch: false,
        media: []
    }));
}

// Build APKG file
async function buildApkg(notes, mediaFiles, deckName) {
    updateProgress(10, 'Initializing SQLite...');
    
    await ensureSqlReady();
    
    if (typeof JSZip === 'undefined') {
        throw new Error('JSZip not loaded');
    }
    
    updateProgress(20, 'Creating database structure...');
    
    const nowMs = Date.now();
    const nowSec = Math.floor(nowMs / 1000);
    
    const SQL = SQL_INSTANCE;
    const db = new SQL.Database();
    
    // Create tables
    db.run(`CREATE TABLE col (id INTEGER PRIMARY KEY, crt INTEGER NOT NULL, mod INTEGER NOT NULL, scm INTEGER NOT NULL, ver INTEGER NOT NULL, dty INTEGER NOT NULL, usn INTEGER NOT NULL, ls INTEGER NOT NULL, conf TEXT NOT NULL, models TEXT NOT NULL, decks TEXT NOT NULL, dconf TEXT NOT NULL, tags TEXT NOT NULL);`);
    db.run(`CREATE TABLE notes (id INTEGER PRIMARY KEY, guid TEXT NOT NULL, mid INTEGER NOT NULL, mod INTEGER NOT NULL, usn INTEGER NOT NULL, tags TEXT NOT NULL, flds TEXT NOT NULL, sfld TEXT NOT NULL, csum INTEGER NOT NULL, flags INTEGER NOT NULL, data TEXT NOT NULL);`);
    db.run(`CREATE TABLE cards (id INTEGER PRIMARY KEY, nid INTEGER NOT NULL, did INTEGER NOT NULL, ord INTEGER NOT NULL, mod INTEGER NOT NULL, usn INTEGER NOT NULL, type INTEGER NOT NULL, queue INTEGER NOT NULL, due INTEGER NOT NULL, ivl INTEGER NOT NULL, factor INTEGER NOT NULL, reps INTEGER NOT NULL, lapses INTEGER NOT NULL, left INTEGER NOT NULL, odue INTEGER NOT NULL, odid INTEGER NOT NULL, flags INTEGER NOT NULL, data TEXT NOT NULL);`);
    db.run(`CREATE TABLE revlog (id INTEGER PRIMARY KEY, cid INTEGER NOT NULL, usn INTEGER NOT NULL, ease INTEGER NOT NULL, ivl INTEGER NOT NULL, lastIvl INTEGER NOT NULL, factor INTEGER NOT NULL, time INTEGER NOT NULL, type INTEGER NOT NULL);`);
    db.run(`CREATE TABLE graves (usn INTEGER NOT NULL, oid INTEGER NOT NULL, type INTEGER NOT NULL);`);
    db.run(`CREATE INDEX ix_notes_usn ON notes (usn);`);
    db.run(`CREATE INDEX ix_cards_usn ON cards (usn);`);
    db.run(`CREATE INDEX ix_revlog_usn ON revlog (usn);`);
    db.run(`CREATE INDEX ix_cards_nid ON cards (nid);`);
    db.run(`CREATE INDEX ix_cards_sched ON cards (did, queue, due);`);
    db.run(`CREATE INDEX ix_revlog_cid ON revlog (cid);`);
    db.run(`CREATE INDEX ix_notes_csum ON notes (csum);`);
    
    updateProgress(30, 'Creating note types...');
    
    // Separate notes by type
    const basicNotes = notes.filter(n => !n.isCloze);
    const clozeNotes = notes.filter(n => n.isCloze);
    
    // Handle deck hierarchy (Main::Sub)
    const deckParts = deckName.split('::');
    const decks = {};
    
    // Create parent decks
    let currentDeckName = '';
    let parentDeckId = null;
    
    deckParts.forEach((part, index) => {
        currentDeckName = currentDeckName ? `${currentDeckName}::${part}` : part;
        const deckId = nowMs + index;
        
        decks[deckId] = {
            id: deckId,
            mod: nowSec,
            name: currentDeckName,
            usn: -1,
            lrnToday: [0, 0],
            revToday: [0, 0],
            newToday: [0, 0],
            timeToday: [0, 0],
            collapsed: false,
            browserCollapsed: false,
            desc: "",
            dyn: 0,
            conf: 1,
            extendNew: 0,
            extendRev: 0
        };
        
        parentDeckId = deckId;
    });
    
    const targetDeckId = parentDeckId || nowMs;
    
    const models = {};
    
    // Basic note type
    if (basicNotes.length > 0) {
        models[nowMs] = {
            id: nowMs,
            name: "Basic",
            type: 0,
            mod: nowSec,
            usn: -1,
            sortf: 0,
            did: targetDeckId,
            tmpls: [{
                name: "Card 1",
                ord: 0,
                qfmt: "{{Front}}",
                afmt: "{{FrontSide}}<hr id=answer>{{Back}}",
                bqfmt: "",
                bafmt: "",
                did: null,
                bfont: "",
                bsize: 0,
                id: 0
            }],
            flds: buildFieldObjects(["Front", "Back"]),
            css: `.card {
 font-family: arial;
 font-size: 20px;
 text-align: center;
 color: black;
 background-color: white;
}`,
            latexPre: "",
            latexPost: "",
            latexsvg: false,
            req: [[0, "all", [0]]]
        };
    }
    
    // Cloze note type
    if (clozeNotes.length > 0) {
        models[nowMs + 100] = {
            id: nowMs + 100,
            name: "Cloze",
            type: 1,
            mod: nowSec,
            usn: -1,
            sortf: 0,
            did: targetDeckId,
            tmpls: [{
                name: "Cloze",
                ord: 0,
                qfmt: "{{cloze:Text}}",
                afmt: "{{cloze:Text}}<br>{{Extra}}",
                bqfmt: "",
                bafmt: "",
                did: null,
                bfont: "",
                bsize: 0,
                id: 0
            }],
            flds: buildFieldObjects(["Text", "Extra"]),
            css: `.card {
 font-family: arial;
 font-size: 20px;
 text-align: center;
 color: black;
 background-color: white;
}
.cloze {
 font-weight: bold;
 color: blue;
}`,
            latexPre: "",
            latexPost: "",
            latexsvg: false,
            req: [[0, "any", [0]]]
        };
    }
    
    updateProgress(40, 'Creating configuration...');
    
    const conf = {
        schedVer: 2,
        sched2021: true,
        addToCur: true,
        sortBackwards: false,
        dueCounts: true,
        collapseTime: 1200,
        estTimes: true,
        nextPos: 1,
        sortType: "noteFld",
        activeDecks: [targetDeckId],
        newSpread: 0,
        timeLim: 0,
        curDeck: targetDeckId,
        curModel: Object.keys(models)[0] ? parseInt(Object.keys(models)[0]) : targetDeckId,
        dayLearnFirst: false,
        creationOffset: -420
    };
    
    const dconf = {
        1: {
            id: 1,
            mod: 0,
            name: "Default",
            usn: 0,
            maxTaken: 60,
            autoplay: true,
            timer: 0,
            replayq: true,
            new: {bury: false, delays: [1, 10], initialFactor: 2500, ints: [1, 4, 0], order: 1, perDay: 20},
            rev: {bury: false, ease4: 1.3, ivlFct: 1, maxIvl: 36500, perDay: 200, hardFactor: 1.2},
            lapse: {delays: [10], leechAction: 1, leechFails: 8, minInt: 1, mult: 0}
        }
    };
    
    db.run(`INSERT INTO col VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
        1, nowSec, nowSec, nowSec, 11, 0, 0, 0,
        JSON.stringify(conf),
        JSON.stringify(models),
        JSON.stringify(decks),
        JSON.stringify(dconf),
        "{}"
    ]);
    
    updateProgress(50, `Adding ${notes.length} notes...`);
    
    let noteIndex = 0;
    
    // Add basic notes
    const basicModelId = nowMs;
    basicNotes.forEach((note, idx) => {
        const noteId = nowMs + 1000 + noteIndex;
        const cardId = nowMs + 500000 + noteIndex;
        
        const fields = [note.front, note.back];
        const sfld = fields[0] || '';
        const csum = sha1ish(sfld);
        const guid = 'g' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
        
        db.run(`INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
            noteId, guid, basicModelId, nowSec, -1, "",
            fields.join('\u001f'), sfld, csum, 0, "{}"
        ]);
        
        db.run(`INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            cardId, noteId, targetDeckId, 0, nowSec, -1,
            0, 0, noteIndex + 1,
            0, 0, 0, 0, 0, 0, 0, 0, "{}"
        ]);
        
        noteIndex++;
        
        if (idx % 10 === 0) {
            updateProgress(50 + (idx / basicNotes.length) * 20, `Adding basic notes: ${idx}/${basicNotes.length}`);
        }
    });
    
    // Add cloze notes
    const clozeModelId = nowMs + 100;
    clozeNotes.forEach((note, idx) => {
        const noteId = nowMs + 1000 + noteIndex;
        
        const clozeText = note.front + (note.back ? '<br>' + note.back : '');
        const fields = [clozeText, ''];
        
        const sfld = fields[0] || '';
        const csum = sha1ish(sfld);
        const guid = 'g' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
        
        db.run(`INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
            noteId, guid, clozeModelId, nowSec, -1, "",
            fields.join('\u001f'), sfld, csum, 0, "{}"
        ]);
        
        const clozeCount = (clozeText.match(/\{\{c\d+::/g) || []).length;
        const maxCloze = Math.max(1, clozeCount);
        
        for (let ord = 0; ord < maxCloze; ord++) {
            const cardId = nowMs + 500000 + noteIndex * 10 + ord;
            
            db.run(`INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                cardId, noteId, targetDeckId, ord, nowSec, -1,
                0, 0, noteIndex + 1,
                0, 0, 0, 0, 0, 0, 0, 0, "{}"
            ]);
        }
        
        noteIndex++;
        
        if (idx % 10 === 0) {
            updateProgress(70 + (idx / clozeNotes.length) * 20, `Adding cloze notes: ${idx}/${clozeNotes.length}`);
        }
    });
    
    updateProgress(90, 'Creating APKG file...');
    
    // Export database
    const data = db.export();
    const zip = new JSZip();
    zip.file("collection.anki2", data);
    
    // Add media
    const mediaJson = {};
    let mediaIndex = 0;
    
    for (const [filename, blob] of Object.entries(mediaFiles || {})) {
        mediaJson[mediaIndex] = filename;
        zip.file(mediaIndex.toString(), blob);
        mediaIndex++;
    }
    
    zip.file("media", JSON.stringify(mediaJson));
    
    updateProgress(95, 'Compressing...');
    
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `notion_${deckName.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_')}_${stamp}_${notes.length}notes.apkg`;
    
    const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {level: 9}
    });
    
    updateProgress(100, 'Complete!');
    
    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    return { filename, noteCount: notes.length, basicCount: basicNotes.length, clozeCount: clozeNotes.length };
}
