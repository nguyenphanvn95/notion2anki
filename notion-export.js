/**
 * Notion Export Module
 * Handles direct export from Notion API
 */

// IMPORTANT:
// Notion's internal API does NOT allow browser -> notion.so requests due to CORS.
// When deployed (e.g. on Vercel), call same-origin serverless functions that proxy
// requests to Notion with the provided token_v2 cookie.
//
// These endpoints are implemented in /api/notion/* (Vercel Functions).
const NOTION_ENQUEUE_TASK_ENDPOINT = "/api/notion/enqueueTask";
const NOTION_GET_TASK_ENDPOINT = "/api/notion/getTasks";
const MAX_RETRIES = 600;
const RETRY_TIME = 1000; // 1 second

// Extract page ID from URL or use as-is
function extractPageId(input) {
    input = input.trim();
    
    // If it's already a 32-character hex string, return it
    if (/^[a-f0-9]{32}$/i.test(input.replace(/-/g, ''))) {
        return input.replace(/-/g, '');
    }
    
    // Try to extract from URL
    const urlPatterns = [
        /notion\.so\/.*?([a-f0-9]{32})/i,
        /notion\.so\/.*?([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
    ];
    
    for (const pattern of urlPatterns) {
        const match = input.match(pattern);
        if (match) {
            return match[1].replace(/-/g, '');
        }
    }
    
    return null;
}

// Enqueue export task
async function enqueueExportTask(token, pageId, recursive) {
    const payload = {
        task: {
            eventName: "exportBlock",
            request: {
                block: { id: pageId },
                recursive: recursive,
                exportOptions: {
                    exportType: "html",
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    locale: "en",
                },
            },
        },
    };

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
        try {
            // Use same-origin backend proxy (Vercel Function) to avoid CORS.
            const response = await fetch(NOTION_ENQUEUE_TASK_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, payload }),
            });

            if (response.status === 401) {
                throw new Error('Invalid token. Please check your token_v2.');
            }

            if (response.status >= 500) {
                attempts++;
                updateProgress(10, `Server error, retrying... (${attempts}/${MAX_RETRIES})`);
                await new Promise(resolve => setTimeout(resolve, RETRY_TIME));
                continue;
            }

            const data = await response.json();
            
            if (!data.taskId) {
                throw new Error('No task ID in response');
            }

            return data.taskId;
        } catch (error) {
            if (error.message.includes('Invalid token')) {
                throw error;
            }
            
            // Network / proxy error
            if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
                throw new Error('Network/proxy error: Cannot reach backend proxy. If you deployed to Vercel, make sure the /api/notion functions are included and deployed.');
            }
            
            attempts++;
            if (attempts >= MAX_RETRIES) {
                throw new Error('Cannot submit export task after multiple retries');
            }
            await new Promise(resolve => setTimeout(resolve, RETRY_TIME));
        }
    }
}

// Get task result
async function getTaskResult(token, taskId) {
    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
        try {
            const response = await fetch(NOTION_GET_TASK_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, taskIds: [taskId] }),
            });

            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const result = data.results[0];
                
                if (result.error) {
                    throw new Error(result.error);
                }
                
                if (result.status) {
                    const status = result.status;
                    
                    if (status.type === 'complete') {
                        return status.exportURL;
                    }
                    
                    const progress = Math.min(20 + (attempts / MAX_RETRIES) * 60, 80);
                    updateProgress(progress, `Waiting for export... (${attempts}/${MAX_RETRIES})`);
                }
            }

            attempts++;
            await new Promise(resolve => setTimeout(resolve, RETRY_TIME));
        } catch (error) {
            throw error;
        }
    }
    
    throw new Error('Export task timeout. The page might be too large.');
}

// Download and extract ZIP from URL
async function downloadAndExtractZip(url) {
    updateProgress(85, 'Downloading exported file...');
    
    const response = await fetch(url);
    const blob = await response.blob();
    
    updateProgress(90, 'Extracting ZIP...');
    
    const zip = await JSZip.loadAsync(blob);
    
    // Find HTML file
    const htmlFile = Object.keys(zip.files).find(name => name.endsWith('.html'));
    if (!htmlFile) {
        throw new Error('No HTML file found in export');
    }
    
    const htmlContent = await zip.files[htmlFile].async('string');
    
    // Extract media files
    const media = {};
    for (const [filename, fileData] of Object.entries(zip.files)) {
        if (filename.match(/\.(png|jpg|jpeg|gif|webp|mp4|mp3|wav)$/i)) {
            const blob = await fileData.async('blob');
            media[filename] = blob;
        }
    }
    
    return { html: htmlContent, media: media };
}

// Export page from Notion
async function exportPageFromNotion(token, pageUrl, recursive) {
    updateProgress(5, 'Initializing...');
    
    const pageId = extractPageId(pageUrl);
    if (!pageId) {
        throw new Error('Invalid page URL or ID');
    }
    
    updateProgress(10, 'Submitting export task...');
    const taskId = await enqueueExportTask(token, pageId, recursive);
    
    updateProgress(20, 'Waiting for export to complete...');
    const exportUrl = await getTaskResult(token, taskId);
    
    if (!exportUrl) {
        throw new Error('No export URL returned');
    }
    
    const { html, media } = await downloadAndExtractZip(exportUrl);
    
    return { html, media };
}
