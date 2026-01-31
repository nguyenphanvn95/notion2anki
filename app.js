/**
 * Main Application Logic
 * Handles UI interactions and coordinates between modules
 */

// Global state
let uploadedFile = null;
let currentMediaFiles = {};

// ===== UTILITY FUNCTIONS =====

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type} show`;
    
    setTimeout(() => {
        statusEl.classList.remove('show');
    }, 5000);
}

function updateProgress(percent, text) {
    const progressCard = document.getElementById('progressCard');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressCard.classList.add('show');
    progressFill.style.width = percent + '%';
    progressFill.textContent = Math.round(percent) + '%';
    progressText.textContent = text;
}

function hideProgress() {
    document.getElementById('progressCard').classList.remove('show');
}

function updateStats(stats) {
    document.getElementById('totalNotes').textContent = stats.total || 0;
    document.getElementById('basicNotes').textContent = stats.basic || 0;
    document.getElementById('clozeNotes').textContent = stats.cloze || 0;
    document.getElementById('mediaCount').textContent = stats.media || 0;
    document.getElementById('statsCard').style.display = 'block';
}

// ===== TAB SWITCHING =====

function switchTab(tabName) {
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.tab-btn').classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'export') {
        document.getElementById('exportTab').classList.add('active');
    } else {
        document.getElementById('uploadTab').classList.add('active');
    }
    
    // Reset state
    hideProgress();
    document.getElementById('statsCard').style.display = 'none';
}

// ===== TOKEN VISIBILITY =====

function toggleTokenVisibility() {
    const tokenInput = document.getElementById('notionToken');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (tokenInput.type === 'password') {
        tokenInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        tokenInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

// ===== FILE UPLOAD HANDLING =====

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
        handleFileUpload(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    uploadedFile = file;
    
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = (file.size / 1024).toFixed(2) + ' KB';
    document.getElementById('fileType').textContent = file.name.endsWith('.zip') ? 'ZIP Archive' : 'HTML File';
    
    document.getElementById('fileInfo').classList.add('show');
    document.getElementById('processBtn').disabled = false;
    
    showStatus('File uploaded successfully. Click "Process & Export APKG" to continue.', 'success');
}

function resetUpload() {
    uploadedFile = null;
    currentMediaFiles = {};
    
    fileInput.value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('statsCard').style.display = 'none';
    document.getElementById('processBtn').disabled = true;
    
    hideProgress();
    showStatus('Reset complete. Upload a new file.', 'info');
}

// ===== EXPORT FROM NOTION =====

async function exportFromNotion() {
    const token = document.getElementById('notionToken').value.trim();
    const pageUrl = document.getElementById('notionPageUrl').value.trim();
    const recursive = document.getElementById('recursiveExport').checked;
    const deckName = document.getElementById('deckNameExport').value.trim() || 'Notion';
    
    // Validate inputs
    if (!token) {
        showStatus('Please enter your Notion token', 'error');
        return;
    }
    
    if (!pageUrl) {
        showStatus('Please enter a page URL or ID', 'error');
        return;
    }
    
    try {
        showStatus('Starting export from Notion...', 'info');
        updateProgress(0, 'Initializing...');
        
        // Export from Notion
        const { html, media } = await exportPageFromNotion(token, pageUrl, recursive);
        currentMediaFiles = media;
        
        updateProgress(92, 'Parsing HTML...');
        
        // Parse notes
        const parsedNotes = parseHtmlToNotes(html);
        
        if (parsedNotes.length === 0) {
            hideProgress();
            showStatus('No toggle blocks found. Please use toggle blocks in your Notion page.', 'error');
            return;
        }
        
        // Update stats
        const basicCount = parsedNotes.filter(n => !n.isCloze).length;
        const clozeCount = parsedNotes.filter(n => n.isCloze).length;
        
        updateStats({
            total: parsedNotes.length,
            basic: basicCount,
            cloze: clozeCount,
            media: Object.keys(media).length
        });
        
        updateProgress(95, 'Building APKG...');
        
        // Build APKG
        const result = await buildApkg(parsedNotes, media, deckName);
        
        hideProgress();
        showStatus(`✓ Success! Exported ${result.noteCount} notes to ${result.filename}`, 'success');
        
    } catch (error) {
        console.error('Export error:', error);
        hideProgress();
        
        let errorMessage = error.message;
        
        // Provide helpful error messages
        if (errorMessage.includes('CORS')) {
            errorMessage += '\n\n💡 Tip: Due to browser CORS restrictions, direct export may not work. Please either:\n1. Use the "Upload ZIP/HTML" tab and upload an exported file from Notion, OR\n2. Use our backend server (see README for setup)';
        }
        
        showStatus(`❌ Error: ${errorMessage}`, 'error');
    }
}

// ===== PROCESS UPLOADED FILE =====

async function processUploadedFile() {
    if (!uploadedFile) {
        showStatus('Please upload a file first', 'error');
        return;
    }
    
    const deckName = document.getElementById('deckNameUpload').value.trim() || 'Notion';
    
    try {
        updateProgress(0, 'Starting...');
        
        // Extract HTML
        let html;
        let media = {};
        
        if (uploadedFile.name.endsWith('.zip')) {
            updateProgress(5, 'Extracting ZIP...');
            
            const zip = await JSZip.loadAsync(uploadedFile);
            
            // Find HTML file
            const htmlFile = Object.keys(zip.files).find(name => name.endsWith('.html'));
            if (!htmlFile) {
                throw new Error('No HTML file found in ZIP');
            }
            
            html = await zip.files[htmlFile].async('string');
            
            // Extract media
            for (const [filename, fileData] of Object.entries(zip.files)) {
                if (filename.match(/\.(png|jpg|jpeg|gif|webp|mp4|mp3|wav)$/i)) {
                    const blob = await fileData.async('blob');
                    media[filename] = blob;
                }
            }
        } else {
            html = await uploadedFile.text();
        }
        
        updateProgress(10, 'Parsing HTML...');
        
        // Parse notes
        const parsedNotes = parseHtmlToNotes(html);
        
        if (parsedNotes.length === 0) {
            hideProgress();
            showStatus('No toggle blocks found. Please use toggle blocks in your Notion page.', 'error');
            return;
        }
        
        // Update stats
        const basicCount = parsedNotes.filter(n => !n.isCloze).length;
        const clozeCount = parsedNotes.filter(n => n.isCloze).length;
        
        updateStats({
            total: parsedNotes.length,
            basic: basicCount,
            cloze: clozeCount,
            media: Object.keys(media).length
        });
        
        // Build APKG
        const result = await buildApkg(parsedNotes, media, deckName);
        
        hideProgress();
        showStatus(`✓ Success! Exported ${result.noteCount} notes to ${result.filename}`, 'success');
        
    } catch (error) {
        console.error('Processing error:', error);
        hideProgress();
        showStatus(`❌ Error: ${error.message}`, 'error');
    }
}

// ===== INITIALIZATION =====

console.log('Notion2Anki Complete loaded successfully');
console.log('Version: 1.0.0');

// Show welcome message
setTimeout(() => {
    showStatus('Welcome to Notion2Anki! Choose a tab to get started.', 'info');
}, 500);
