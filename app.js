/**
 * Main Application Logic - Multi-Page Support
 * Handles UI interactions and coordinates between modules
 */

// Global state
let uploadedFile = null;
let currentMediaFiles = {};
let pages = []; // Array of page objects: { id, pageId, deckName, recursive }
let nextPageId = 1;

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
        
        let allNotes = [];
        let allMedia = {};
        const deckStats = [];
        const failedPages = [];
        
        // Export each page
        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const progress = ((i / pages.length) * 80).toFixed(0);
            
            updateProgress(progress, `Đang export page ${i + 1}/${pages.length}: ${page.deckName}...`);
            
            try {
                // Export from Notion
                const { html, media } = await exportPageFromNotion(token, page.pageId, page.recursive);
                
                // Parse notes
                const parsedNotes = parseHtmlToNotes(html);
                
                // Add deck name to each note
                const deckName = `${mainDeckName}::${page.deckName}`;
                parsedNotes.forEach(note => {
                    note.deck = deckName;
                });
                
                allNotes = allNotes.concat(parsedNotes);
                
                // Merge media
                Object.assign(allMedia, media);
                
                // Track stats for this deck
                const basicCount = parsedNotes.filter(n => !n.isCloze).length;
                const clozeCount = parsedNotes.filter(n => n.isCloze).length;
                
                deckStats.push({
                    name: page.deckName,
                    total: parsedNotes.length,
                    basic: basicCount,
                    cloze: clozeCount
                });
                
            } catch (error) {
                console.error(`Error exporting page ${page.deckName}:`, error);
                failedPages.push({ name: page.deckName, error: error?.message || String(error) });
                showStatus(`⚠️ Lỗi khi export page "${page.deckName}": ${error?.message || error}`, 'warning');
                // Continue with other pages
            }
        }
        
        if (allNotes.length === 0) {
            hideProgress();
            // If we failed to export any page, show a clearer error instead of 'no toggles'
            if (failedPages && failedPages.length > 0) {
                const first = failedPages[0];
                const hint = (first && first.error && String(first.error).includes('User cannot access block'))
                  ? `\n\nGợi ý: Page này không thuộc quyền truy cập của token_v2 hiện tại. Hãy mở page trên Notion bằng đúng tài khoản, hoặc Duplicate page sang workspace của bạn, hoặc Share page với tài khoản đó (Full access).`
                  : "";
                showStatus(`Không export được page nào. Lỗi mẫu: ${first.name || ''} - ${first.error || 'Unknown error'}${hint}`, 'error');
                return;
            }
            showStatus('Không tìm thấy toggle blocks nào. Nếu page không dùng toggle, hãy bật chế độ parse theo heading/block (sắp thêm).', 'error');
            return;
        }
        
        // Update stats
        const basicCount = allNotes.filter(n => !n.isCloze).length;
        const clozeCount = allNotes.filter(n => n.isCloze).length;
        
        updateStats({
            total: allNotes.length,
            basic: basicCount,
            cloze: clozeCount,
            media: Object.keys(allMedia).length,
            deckStats: deckStats
        });
        
        updateProgress(90, 'Đang xây dựng APKG...');
        
        // Build APKG
        const result = await buildApkg(allNotes, allMedia, mainDeckName);
        
        hideProgress();
        showStatus(`✓ Thành công! Đã export ${result.noteCount} notes từ ${pages.length} pages vào ${result.filename}`, 'success');
        
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
    if (!uploadedFile) {
        showStatus('Vui lòng upload file trước', 'error');
        return;
    }
    
    const deckName = document.getElementById('deckNameUpload').value.trim() || 'Notion';
    
    try {
        updateProgress(0, 'Đang bắt đầu...');
        
        // Extract HTML
        let html;
        let media = {};
        
        if (uploadedFile.name.endsWith('.zip')) {
            updateProgress(5, 'Đang giải nén ZIP...');
            
            const zip = await JSZip.loadAsync(uploadedFile);
            
            // Find HTML file
            const htmlFile = Object.keys(zip.files).find(name => name.endsWith('.html'));
            if (!htmlFile) {
                throw new Error('Không tìm thấy file HTML trong ZIP');
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
        
        updateProgress(10, 'Đang phân tích HTML...');
        
        // Parse notes
        const parsedNotes = parseHtmlToNotes(html);
        
        if (parsedNotes.length === 0) {
            hideProgress();
            showStatus('Không tìm thấy toggle blocks. Vui lòng sử dụng toggle blocks trong Notion page.', 'error');
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
