/**
 * Main Application Logic - Multi-Page Support
 * Handles UI interactions and coordinates between modules
 */

// Global state
let uploadedFiles = []; // Array<File>
let currentMediaFiles = {};
let pages = []; // Array of page objects: { id, pageId, deckName, recursive }
let nextPageId = 1;

// Export links collected from Notion (for user to download in browser)
let lastExportLinks = []; // Array<{deckName, exportUrl}>

// ===== LOCAL STORAGE =====

function savePages() {
    localStorage.setItem('notion2anki_pages', JSON.stringify(pages));
}

function loadPages() {
    const saved = localStorage.getItem('notion2anki_pages');
    if (saved) {
        try {
            pages = JSON.parse(saved);
            nextPageId = Math.max(...pages.map(p => p.id), 0) + 1;
            renderPages();
        } catch (e) {
            console.error('Error loading saved pages:', e);
        }
    }
}

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
    
    // Update deck-specific stats if available
    if (stats.deckStats) {
        renderDeckStats(stats.deckStats);
    }
}

function renderDeckStats(deckStats) {
    const container = document.getElementById('deckStatsContainer');
    if (!deckStats || deckStats.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="deck-stats"><h3>📊 Thống kê theo Deck</h3>';
    
    deckStats.forEach(deck => {
        html += `
            <div class="deck-stat-item">
                <h4>${deck.name}</h4>
                <div class="deck-stat-grid">
                    <div>
                        <strong>${deck.total}</strong>
                        <span>Tổng</span>
                    </div>
                    <div>
                        <strong>${deck.basic}</strong>
                        <span>Basic</span>
                    </div>
                    <div>
                        <strong>${deck.cloze}</strong>
                        <span>Cloze</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
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

// Programmatic tab switch (without relying on click event)
function activateTab(tabName) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    // Pick correct button
    const btn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    if (tabName === 'export') {
        document.getElementById('exportTab').classList.add('active');
    } else {
        document.getElementById('uploadTab').classList.add('active');
    }

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

// ===== PAGE MANAGEMENT =====

function extractPageId(input) {
    // Extract page ID from URL or just return if it's already an ID
    if (!input) return '';
    
    // If it's a URL, extract the ID
    const urlMatch = input.match(/([a-f0-9]{32})|([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (urlMatch) {
        return urlMatch[0].replace(/-/g, '');
    }
    
    // Otherwise, assume it's already an ID
    return input.replace(/-/g, '');
}

function addPage() {
    const pageIdInput = document.getElementById('newPageId').value.trim();
    const deckName = document.getElementById('newPageDeckName').value.trim();
    const recursive = document.getElementById('newPageRecursive').checked;
    
    if (!pageIdInput) {
        showStatus('Vui lòng nhập Page URL hoặc ID', 'error');
        return;
    }
    
    if (!deckName) {
        showStatus('Vui lòng nhập tên sub-deck', 'error');
        return;
    }
    
    const pageId = extractPageId(pageIdInput);
    
    // Check for duplicates
    if (pages.some(p => p.pageId === pageId)) {
        showStatus('Page này đã tồn tại trong danh sách', 'warning');
        return;
    }
    
    const page = {
        id: nextPageId++,
        pageId: pageId,
        deckName: deckName,
        recursive: recursive
    };
    
    pages.push(page);
    savePages();
    renderPages();
    
    // Clear form
    document.getElementById('newPageId').value = '';
    document.getElementById('newPageDeckName').value = '';
    document.getElementById('newPageRecursive').checked = true;
    
    showStatus('✓ Đã thêm page thành công', 'success');
}

function deletePage(id) {
    if (!confirm('Bạn có chắc muốn xóa page này?')) return;
    
    pages = pages.filter(p => p.id !== id);
    savePages();
    renderPages();
    showStatus('✓ Đã xóa page', 'success');
}

function editPage(id) {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    
    page.editing = true;
    renderPages();
}

function savePage(id) {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    
    const deckName = document.getElementById(`edit-deck-${id}`).value.trim();
    const recursive = document.getElementById(`edit-recursive-${id}`).checked;
    
    if (!deckName) {
        showStatus('Tên deck không được để trống', 'error');
        return;
    }
    
    page.deckName = deckName;
    page.recursive = recursive;
    page.editing = false;
    
    savePages();
    renderPages();
    showStatus('✓ Đã lưu thay đổi', 'success');
}

function cancelEdit(id) {
    const page = pages.find(p => p.id === id);
    if (!page) return;
    
    page.editing = false;
    renderPages();
}

function clearAllPages() {
    if (pages.length === 0) {
        showStatus('Danh sách đã trống', 'info');
        return;
    }
    
    if (!confirm('Bạn có chắc muốn xóa tất cả pages?')) return;
    
    pages = [];
    savePages();
    renderPages();
    showStatus('✓ Đã xóa tất cả pages', 'success');
}

function renderPages() {
    const container = document.getElementById('pagesContainer');
    const countEl = document.getElementById('pagesCount');
    const exportBtn = document.getElementById('exportAllBtn');
    
    countEl.textContent = pages.length;
    exportBtn.disabled = pages.length === 0;
    
    if (pages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>Chưa có page nào. Thêm page đầu tiên của bạn!</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    pages.forEach(page => {
        const editClass = page.editing ? 'editing' : '';
        html += `
            <div class="page-item ${editClass}">
                <div class="page-header">
                    <div class="page-info">
                        <div class="page-title">
                            <i class="fas fa-file-alt"></i> ${page.deckName}
                        </div>
                        <div class="page-deck-name">
                            Sub-deck: ${page.deckName}
                        </div>
                        <div class="page-id-display">
                            ID: ${page.pageId.substring(0, 8)}...${page.pageId.substring(page.pageId.length - 4)}
                        </div>
                    </div>
                    <div class="page-actions">
                        ${!page.editing ? `
                            <button class="btn-edit" onclick="editPage(${page.id})">
                                <i class="fas fa-edit"></i> Sửa
                            </button>
                            <button class="btn-delete" onclick="deletePage(${page.id})">
                                <i class="fas fa-trash"></i> Xóa
                            </button>
                        ` : `
                            <button class="btn-save" onclick="savePage(${page.id})">
                                <i class="fas fa-check"></i> Lưu
                            </button>
                            <button class="btn-cancel" onclick="cancelEdit(${page.id})">
                                <i class="fas fa-times"></i> Hủy
                            </button>
                        `}
                    </div>
                </div>
                
                <div class="page-metadata">
                    <label>
                        <i class="fas fa-layer-group"></i>
                        ${page.recursive ? 'Có subpages' : 'Chỉ page chính'}
                    </label>
                </div>
                
                ${page.editing ? `
                    <div class="edit-form show">
                        <div class="input-group">
                            <label>Tên Sub-Deck</label>
                            <input type="text" id="edit-deck-${page.id}" value="${page.deckName}">
                        </div>
                        <div class="checkbox-group">
                            <label>
                                <input type="checkbox" id="edit-recursive-${page.id}" ${page.recursive ? 'checked' : ''}>
                                <span>Export đệ quy (bao gồm subpages)</span>
                            </label>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
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
    if (files && files.length > 0) {
        handleFileUpload(files);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
        handleFileUpload(e.target.files);
    }
});

function handleFileUpload(file) {
    // Backwards-compatible: accept a single File or a FileList/Array
    const list = (file instanceof FileList) ? Array.from(file) : (Array.isArray(file) ? file : [file]);
    uploadedFiles = list.filter(Boolean);

    const totalBytes = uploadedFiles.reduce((sum, f) => sum + (f?.size || 0), 0);
    const names = uploadedFiles.map(f => f.name).join(', ');

    document.getElementById('fileName').textContent = uploadedFiles.length === 1 ? names : `${uploadedFiles.length} files: ${names}`;
    document.getElementById('fileSize').textContent = (totalBytes / 1024).toFixed(2) + ' KB';
    document.getElementById('fileType').textContent = uploadedFiles.every(f => f.name.endsWith('.zip'))
        ? 'ZIP Archive(s)'
        : 'ZIP/HTML Files';
    
    document.getElementById('fileInfo').classList.add('show');
    document.getElementById('processBtn').disabled = false;
    
    showStatus('Đã upload file. Bấm "Xử lý & Export APKG" để tiếp tục.', 'success');
}

function resetUpload() {
    uploadedFiles = [];
    currentMediaFiles = {};
    
    fileInput.value = '';
    document.getElementById('fileInfo').classList.remove('show');
    document.getElementById('statsCard').style.display = 'none';
    document.getElementById('processBtn').disabled = true;
    
    hideProgress();
    showStatus('Reset complete. Upload a new file.', 'info');
}

// ===== EXPORT LINKS UI =====

function renderExportLinksBox(links) {
    const box = document.getElementById('exportLinksBox');
    const list = document.getElementById('exportLinksList');
    if (!box || !list) return;

    list.innerHTML = '';
    links.forEach((it, idx) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = it.exportUrl;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = `${idx + 1}. ${it.deckName}`;
        li.appendChild(a);
        list.appendChild(li);
    });

    box.style.display = 'block';
}

function openFirstExportLink(links) {
    if (!links || links.length === 0) return;
    // Try to open the first link automatically. If pop-up blocked, user can click links list.
    try {
        window.open(links[0].exportUrl, '_blank', 'noopener');
    } catch (_) {
        // ignore
    }
}

// ===== EXPORT ALL PAGES FROM NOTION =====

async function exportAllPages() {
    const token = document.getElementById('notionToken').value.trim();
    const mainDeckName = document.getElementById('mainDeckName').value.trim() || 'Notion Collection';
    
    // Validate inputs
    if (!token) {
        showStatus('Vui lòng nhập Notion token', 'error');
        return;
    }
    
    if (pages.length === 0) {
        showStatus('Vui lòng thêm ít nhất một page', 'error');
        return;
    }
    
    try {
        showStatus('Bắt đầu export từ Notion...', 'info');
        updateProgress(0, 'Đang khởi tạo...');
        
        // We only fetch export links here (Notion blocks cloud/serverless from downloading the ZIP).
        // After links are ready, we open them for the user to download, then user uploads the ZIP(s)
        // in the Upload tab to build the APKG.
        lastExportLinks = [];
        
        // Export each page
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const progress = ((i / pages.length) * 80).toFixed(0);
            
            updateProgress(progress, `Đang export page ${i + 1}/${pages.length}: ${page.deckName}...`);
            
            try {
                const { exportUrl } = await exportPageFromNotion(token, page.pageId, page.recursive);
                lastExportLinks.push({
                    deckName: page.deckName,
                    exportUrl,
                });
            } catch (error) {
                console.error(`Error exporting page ${page.deckName}:`, error);
                showStatus(`⚠️ Lỗi khi export page "${page.deckName}": ${error.message}`, 'warning');
            }
        }

        if (lastExportLinks.length === 0) {
            hideProgress();
            showStatus('Không export được page nào. Kiểm tra lại token/page quyền truy cập.', 'error');
            return;
        }

        updateProgress(90, 'Đã có link tải ZIP. Đang mở link...');
        renderExportLinksBox(lastExportLinks);
        openFirstExportLink(lastExportLinks);

        hideProgress();
        showStatus('✅ Đã mở link tải ZIP. Tải xong, chuyển sang tab Upload để upload ZIP và tạo APKG.', 'success');

        // Switch to Upload tab and prefill deck name
        activateTab('upload');
        document.getElementById('deckNameUpload').value = mainDeckName;
        
    } catch (error) {
        console.error('Export error:', error);
        hideProgress();
        
        let errorMessage = error.message;
        
        // Provide helpful error messages
        if (errorMessage.includes('CORS')) {
            errorMessage += '\n\n💡 Tip: Do hạn chế CORS của trình duyệt, export trực tiếp có thể không hoạt động. Vui lòng:\n1. Sử dụng tab "Upload ZIP/HTML" và upload file đã export từ Notion, HOẶC\n2. Sử dụng backend server của chúng tôi (xem README để cài đặt)';
        }
        
        showStatus(`❌ Lỗi: ${errorMessage}`, 'error');
    }
}

// ===== PROCESS UPLOADED FILE =====

async function processUploadedFile() {
    if (!uploadedFiles || uploadedFiles.length === 0) {
        showStatus('Vui lòng upload file trước', 'error');
        return;
    }
    
    const deckName = document.getElementById('deckNameUpload').value.trim() || 'Notion';
    const sanitizeDeckPart = (s) => (s || '')
        .replace(/\.(zip|html?)$/i, '')
        .replace(/[\\/]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim() || 'Page';
    
    try {
        updateProgress(0, 'Đang bắt đầu...');
        
        // Extract HTML (merge multiple uploads into one APKG)
        let allNotes = [];
        let allMedia = {};

        for (let i = 0; i < uploadedFiles.length; i++) {
            const file = uploadedFiles[i];
            updateProgress(5 + (i / uploadedFiles.length) * 30, `Đang đọc file ${i + 1}/${uploadedFiles.length}: ${file.name}`);

            // Each uploaded ZIP/HTML will become a subdeck of the main deck.
            // - If user uploads multiple ZIPs: each ZIP -> one subdeck
            // - If user uploads a *combined* ZIP with multiple folders: each top-level folder -> one subdeck
            let html;
            let media = {};
            const fileSubdeck = sanitizeDeckPart(file.name);

            if (file.name.toLowerCase().endsWith('.zip')) {
                const zip = await JSZip.loadAsync(file);

                const allHtmlFiles = Object.keys(zip.files).filter(name => name.toLowerCase().endsWith('.html'));
                if (allHtmlFiles.length === 0) {
                    throw new Error(`Không tìm thấy file HTML trong ZIP: ${file.name}`);
                }

                // Detect top-level folders. If present, we treat each folder as a subdeck.
                // Example: "Page A2/index.html", "Page A2/images/x.png".
                const topFolders = new Set();
                allHtmlFiles.forEach(p => {
                    const parts = p.split('/').filter(Boolean);
                    if (parts.length >= 2) topFolders.add(parts[0]);
                });

                const processOneGroup = async (groupName, htmlFilesInGroup, mediaPrefix) => {
                    // Pick largest HTML in group
                    let best = null;
                    let bestLen = -1;
                    for (const p of htmlFilesInGroup) {
                        const content = await zip.files[p].async('string');
                        if (content.length > bestLen) {
                            bestLen = content.length;
                            best = { path: p, html: content };
                        }
                    }
                    if (!best) return;

                    // Extract and rename media to avoid collisions across pages
                    // We'll rename to: "<mediaPrefix>__<basename>"
                    const renameMap = new Map();
                    for (const [filename, fileData] of Object.entries(zip.files)) {
                        if (!fileData || fileData.dir) continue;
                        // Only media under this group (if groupName exists)
                        if (groupName) {
                            if (!filename.startsWith(groupName + '/')) continue;
                        }
                        if (filename.match(/\.(png|jpg|jpeg|gif|webp|mp4|mp3|wav)$/i)) {
                            const base = filename.split('/').pop();
                            const renamed = `${mediaPrefix}__${base}`;
                            renameMap.set(filename, renamed);
                            const blob = await fileData.async('blob');
                            allMedia[renamed] = blob;
                            media[renamed] = blob;
                        }
                    }

                    // Rewrite HTML references to renamed media
                    let rewrittenHtml = best.html;
                    for (const [origPath, renamed] of renameMap.entries()) {
                        const base = origPath.split('/').pop();
                        // replace both "origPath" and "base" occurrences
                        rewrittenHtml = rewrittenHtml.split(origPath).join(renamed);
                        rewrittenHtml = rewrittenHtml.split(base).join(renamed);
                    }

                    const parsedNotes = parseHtmlToNotes(rewrittenHtml);
                    const sub = sanitizeDeckPart(groupName || fileSubdeck);
                    parsedNotes.forEach(n => n.deck = `${deckName}::${sub}`);
                    allNotes = allNotes.concat(parsedNotes);
                };

                if (topFolders.size >= 2) {
                    // Combined ZIP: each top-level folder -> subdeck
                    const folders = Array.from(topFolders);
                    for (const folder of folders) {
                        const htmlFiles = allHtmlFiles.filter(p => p.startsWith(folder + '/'));
                        const mediaPrefix = sanitizeDeckPart(folder);
                        await processOneGroup(folder, htmlFiles, mediaPrefix);
                    }
                } else {
                    // Single page ZIP: one subdeck
                    const mediaPrefix = fileSubdeck;
                    await processOneGroup(null, allHtmlFiles, mediaPrefix);
                }
            } else {
                html = await file.text();
                const parsedNotes = parseHtmlToNotes(html);
                parsedNotes.forEach(n => n.deck = `${deckName}::${fileSubdeck}`);
                allNotes = allNotes.concat(parsedNotes);
            }
        }

        updateProgress(40, 'Đang phân tích HTML...');

        if (allNotes.length === 0) {
            hideProgress();
            showStatus('Không tìm thấy toggle blocks. Vui lòng sử dụng toggle blocks trong Notion page.', 'error');
            return;
        }
        
        // Update stats
        const basicCount = allNotes.filter(n => !n.isCloze).length;
        const clozeCount = allNotes.filter(n => n.isCloze).length;
        
        updateStats({
            total: allNotes.length,
            basic: basicCount,
            cloze: clozeCount,
            media: Object.keys(allMedia).length
        });
        
        // Build APKG
        updateProgress(70, 'Đang xây dựng APKG...');
        const result = await buildApkg(allNotes, allMedia, deckName);
        
        hideProgress();
        showStatus(`✓ Thành công! Đã export ${result.noteCount} notes vào ${result.filename}`, 'success');
        
    } catch (error) {
        console.error('Processing error:', error);
        hideProgress();
        showStatus(`❌ Lỗi: ${error.message}`, 'error');
    }
}

// ===== INITIALIZATION =====

console.log('Notion2Anki Complete Multi-Page loaded successfully');
console.log('Version: 2.0.0 - Multi-Page Support');

// Load saved pages on startup
loadPages();

// Show welcome message
setTimeout(() => {
    showStatus('Chào mừng đến với Notion2Anki! Chọn tab để bắt đầu.', 'info');
}, 500);
