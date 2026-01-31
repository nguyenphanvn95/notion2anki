// ===== GLOBAL STATE =====
let SQL_INSTANCE = null;
let uploadedFile = null;
let parsedNotes = [];
let mediaFiles = {};

// ===== UTILITY FUNCTIONS =====
function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 4000);
}

function updateProgress(percent, text) {
    const progressCard = document.getElementById('progressCard');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressCard.classList.add('show');
    progressFill.style.width = percent + '%';
    progressFill.textContent = percent + '%';
    progressText.textContent = text;
}

function hideProgress() {
    document.getElementById('progressCard').classList.remove('show');
}

function sha1ish(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

// ===== FILE HANDLING =====
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');

dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    uploadedFile = file;
    
    const fileInfo = document.getElementById('fileInfo');
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = (file.size / 1024).toFixed(2) + ' KB';
    document.getElementById('fileType').textContent = file.name.endsWith('.zip') ? 'ZIP Archive' : 'HTML File';
    
    fileInfo.classList.add('show');
    document.getElementById('processBtn').disabled = false;
    
    showStatus('File đã được tải lên. Click "Xử lý & Export APKG" để tiếp tục.', 'success');
}

function reset() {
    uploadedFile = null;
    parsedNotes = [];
    mediaFiles = {};
    
    fileInput.value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('statsCard').style.display = 'none';
    document.getElementById('processBtn').disabled = true;
    
    hideProgress();
    showStatus('Đã reset. Hãy upload file mới.', 'info');
}

// ===== HTML PARSING =====
async function extractHtmlFromZip(zipFile) {
    const zip = await JSZip.loadAsync(zipFile);
    
    // Find HTML file
    const htmlFile = Object.keys(zip.files).find(name => name.endsWith('.html'));
    if (!htmlFile) {
        throw new Error('Không tìm thấy file HTML trong ZIP');
    }
    
    const htmlContent = await zip.files[htmlFile].async('string');
    
    // Extract media files
    for (const [filename, fileData] of Object.entries(zip.files)) {
        if (filename.match(/\.(png|jpg|jpeg|gif|webp|mp4|mp3|wav)$/i)) {
            const blob = await fileData.async('blob');
            mediaFiles[filename] = blob;
        }
    }
    
    return htmlContent;
}

function parseHtmlToNotes(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const notes = [];
    
    // Find all toggle blocks (Notion toggles)
    const toggles = doc.querySelectorAll('details');
    
    toggles.forEach((toggle, index) => {
        try {
            const summary = toggle.querySelector('summary');
            if (!summary) return;
            
            const front = summary.textContent.trim();
            if (!front) return;
            
            // Get back content (everything after summary)
            let back = '';
            const contentElements = Array.from(toggle.children).filter(el => el.tagName !== 'SUMMARY');
            
            contentElements.forEach(el => {
                back += el.outerHTML || el.textContent;
            });
            
            // Auto-detect note type
            const isCloze = detectCloze(front + ' ' + back);
            
            // Extract media
            const media = extractMedia(toggle);
            
            notes.push({
                front: front,
                back: back.trim(),
                isCloze: isCloze,
                media: media,
                tags: []
            });
        } catch (err) {
            console.error('Error parsing toggle:', err);
        }
    });
    
    return notes;
}

function detectCloze(text) {
    // Detect Anki cloze pattern: {{c1::text}}
    const clozePattern = /\{\{c\d+::.+?\}\}/;
    return clozePattern.test(text);
}

function extractMedia(element) {
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

// ===== ANKI APKG BUILDER =====
async function ensureSqlReady() {
    if (SQL_INSTANCE) return SQL_INSTANCE;
    
    if (typeof initSqlJs === 'undefined') {
        throw new Error('sql.js chưa được tải');
    }
    
    SQL_INSTANCE = await initSqlJs({
        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
    });
    
    return SQL_INSTANCE;
}

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

async function buildApkg(notes, deckName) {
    updateProgress(10, 'Khởi tạo SQLite database...');
    
    await ensureSqlReady();
    
    if (typeof JSZip === 'undefined') {
        throw new Error('JSZip chưa được tải');
    }
    
    updateProgress(20, 'Tạo cấu trúc database...');
    
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
    
    updateProgress(30, 'Tạo note types...');
    
    // Separate notes by type
    const basicNotes = notes.filter(n => !n.isCloze);
    const clozeNotes = notes.filter(n => n.isCloze);
    
    const models = {};
    const decks = {
        "1": {id: 1, mod: 0, name: "Default", usn: 0, lrnToday: [0, 0], revToday: [0, 0], newToday: [0, 0], timeToday: [0, 0], collapsed: true, browserCollapsed: true, desc: "", dyn: 0, conf: 1, extendNew: 0, extendRev: 0}
    };
    
    const deckId = nowMs + 1;
    decks[String(deckId)] = {
        id: deckId,
        mod: nowSec,
        name: deckName,
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
    
    // Basic model
    if (basicNotes.length > 0) {
        const basicModelId = nowMs;
        models[basicModelId] = {
            id: basicModelId,
            name: "Notion2Anki-Basic",
            type: 0,
            mod: nowSec,
            usn: -1,
            sortf: 0,
            did: deckId,
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
    
    // Cloze model
    if (clozeNotes.length > 0) {
        const clozeModelId = nowMs + 100;
        models[clozeModelId] = {
            id: clozeModelId,
            name: "Notion2Anki-Cloze",
            type: 1, // Cloze type
            mod: nowSec,
            usn: -1,
            sortf: 0,
            did: deckId,
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
    
    updateProgress(40, 'Tạo configuration...');
    
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
        activeDecks: [deckId],
        newSpread: 0,
        timeLim: 0,
        curDeck: deckId,
        curModel: Object.keys(models)[0] ? parseInt(Object.keys(models)[0]) : deckId,
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
    
    updateProgress(50, `Thêm ${notes.length} notes...`);
    
    // Add notes and cards
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
            cardId, noteId, deckId, 0, nowSec, -1,
            0, 0, noteIndex + 1,
            0, 0, 0, 0, 0, 0, 0, 0, "{}"
        ]);
        
        noteIndex++;
        
        if (idx % 10 === 0) {
            updateProgress(50 + (idx / basicNotes.length) * 20, `Thêm basic notes: ${idx}/${basicNotes.length}`);
        }
    });
    
    // Add cloze notes
    const clozeModelId = nowMs + 100;
    clozeNotes.forEach((note, idx) => {
        const noteId = nowMs + 1000 + noteIndex;
        
        // Combine front and back for cloze
        const clozeText = note.front + (note.back ? '<br>' + note.back : '');
        const fields = [clozeText, ''];
        
        const sfld = fields[0] || '';
        const csum = sha1ish(sfld);
        const guid = 'g' + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
        
        db.run(`INSERT INTO notes VALUES (?,?,?,?,?,?,?,?,?,?,?)`, [
            noteId, guid, clozeModelId, nowSec, -1, "",
            fields.join('\u001f'), sfld, csum, 0, "{}"
        ]);
        
        // Cloze cards - count number of cloze deletions
        const clozeCount = (clozeText.match(/\{\{c\d+::/g) || []).length;
        const maxCloze = Math.max(1, clozeCount);
        
        for (let ord = 0; ord < maxCloze; ord++) {
            const cardId = nowMs + 500000 + noteIndex * 10 + ord;
            
            db.run(`INSERT INTO cards VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
                cardId, noteId, deckId, ord, nowSec, -1,
                0, 0, noteIndex + 1,
                0, 0, 0, 0, 0, 0, 0, 0, "{}"
            ]);
        }
        
        noteIndex++;
        
        if (idx % 10 === 0) {
            updateProgress(70 + (idx / clozeNotes.length) * 20, `Thêm cloze notes: ${idx}/${clozeNotes.length}`);
        }
    });
    
    updateProgress(90, 'Tạo file .apkg...');
    
    // Export database and create ZIP
    const data = db.export();
    const zip = new JSZip();
    zip.file("collection.anki2", data);
    
    // Add media files
    const mediaJson = {};
    let mediaIndex = 0;
    
    for (const [filename, blob] of Object.entries(mediaFiles)) {
        mediaJson[mediaIndex] = filename;
        zip.file(mediaIndex.toString(), blob);
        mediaIndex++;
    }
    
    zip.file("media", JSON.stringify(mediaJson));
    
    updateProgress(95, 'Nén file...');
    
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const filename = `notion_${deckName.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_')}_${stamp}_${notes.length}notes.apkg`;
    
    const blob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {level: 9}
    });
    
    updateProgress(100, 'Hoàn tất!');
    
    // Download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    return filename;
}

// ===== MAIN PROCESS =====
async function processAndExport() {
    if (!uploadedFile) {
        showStatus('Vui lòng upload file trước', 'error');
        return;
    }
    
    try {
        const deckName = document.getElementById('deckName').value.trim() || 'Notion';
        
        updateProgress(0, 'Bắt đầu xử lý...');
        
        // Extract HTML
        let html;
        if (uploadedFile.name.endsWith('.zip')) {
            updateProgress(5, 'Giải nén ZIP...');
            html = await extractHtmlFromZip(uploadedFile);
        } else {
            html = await uploadedFile.text();
        }
        
        updateProgress(10, 'Parse HTML...');
        
        // Parse notes
        parsedNotes = parseHtmlToNotes(html);
        
        if (parsedNotes.length === 0) {
            hideProgress();
            showStatus('Không tìm thấy toggle blocks nào trong file. Hãy đảm bảo bạn đã sử dụng toggle blocks trong Notion.', 'error');
            return;
        }
        
        // Update stats
        const basicCount = parsedNotes.filter(n => !n.isCloze).length;
        const clozeCount = parsedNotes.filter(n => n.isCloze).length;
        const mediaCount = Object.keys(mediaFiles).length;
        
        document.getElementById('totalNotes').textContent = parsedNotes.length;
        document.getElementById('basicNotes').textContent = basicCount;
        document.getElementById('clozeNotes').textContent = clozeCount;
        document.getElementById('mediaCount').textContent = mediaCount;
        document.getElementById('statsCard').style.display = 'block';
        
        // Build APKG
        const filename = await buildApkg(parsedNotes, deckName);
        
        hideProgress();
        showStatus(`✓ Thành công! Đã export ${parsedNotes.length} notes vào file ${filename}`, 'success');
        
    } catch (error) {
        console.error('Error:', error);
        hideProgress();
        showStatus('Lỗi: ' + error.message, 'error');
    }
}

// ===== INITIALIZATION =====
console.log('Notion2Anki Web MVP loaded');
