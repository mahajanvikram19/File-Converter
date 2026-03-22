// ============================================
// File Converter - Main Conversion Functions
// ============================================

const API_BASE_URL = 'http://localhost:4000/api';  // Backend URL

// --------------------------------------------
// Helper Functions
// --------------------------------------------

/**
 * Get authentication token from localStorage
 */
function getAuthToken() {
    return localStorage.getItem('token');
}

/**
 * Create headers with optional auth token
 */
function createHeaders(includeAuth = true) {
    const headers = {};
    if (includeAuth) {
        const token = getAuthToken();
        if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Show error message to user
 */
function showError(message) {
    alert('Error: ' + message);
    // You can also display in a dedicated error div
}

/**
 * Simulate progress for demo (real app would get from server)
 */
function simulateProgress(callback, duration = 3000) {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 10;
        callback(progress);
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, duration / 10);
}

// --------------------------------------------
// Image Conversion
// --------------------------------------------

/**
 * Convert image file to target format
 * @param {File} file - Selected image file
 * @param {string} targetFormat - 'jpg', 'png', 'webp', etc.
 * @param {number} quality - 1-100 (default 85)
 * @param {function} onProgress - callback(percent)
 * @returns {Promise} - Resolves with download URL
 */
async function convertImage(file, targetFormat, quality = 85, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    formData.append('quality', quality);

    try {
        // Simulate progress if no real progress available
        if (onProgress) simulateProgress(onProgress, 3000);

        const response = await fetch(`${API_BASE_URL}/convert/image`, {
            method: 'POST',
            headers: createHeaders(true),
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Conversion failed');
        
        return data; // { success: true, downloadUrl: '/converted/file.jpg' }
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// --------------------------------------------
// Video Conversion
// --------------------------------------------

/**
 * Convert video file
 * @param {File} file - Video file
 * @param {string} targetFormat - 'mp4', 'mov', 'avi', etc.
 * @param {object} options - { resolution, bitrate, fps, codec, removeAudio }
 * @param {function} onProgress - callback(percent)
 */
async function convertVideo(file, targetFormat, options = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    // Add optional settings
    if (options.resolution) formData.append('resolution', options.resolution);
    if (options.bitrate) formData.append('bitrate', options.bitrate);
    if (options.fps) formData.append('fps', options.fps);
    if (options.codec) formData.append('codec', options.codec);
    if (options.removeAudio) formData.append('removeAudio', 'true');
    if (options.trimStart) formData.append('trimStart', options.trimStart);
    if (options.trimEnd) formData.append('trimEnd', options.trimEnd);

    try {
        if (onProgress) simulateProgress(onProgress, 5000); // video takes longer

        const response = await fetch(`${API_BASE_URL}/convert/video`, {
            method: 'POST',
            headers: createHeaders(true),
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Video conversion failed');
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// --------------------------------------------
// Audio Conversion
// --------------------------------------------

/**
 * Convert audio file
 * @param {File} file - Audio file
 * @param {string} targetFormat - 'mp3', 'wav', 'flac', etc.
 * @param {object} options - { bitrate, sampleRate, channels, metadata }
 * @param {function} onProgress
 */
async function convertAudio(file, targetFormat, options = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    if (options.bitrate) formData.append('bitrate', options.bitrate);
    if (options.sampleRate) formData.append('sampleRate', options.sampleRate);
    if (options.channels) formData.append('channels', options.channels);
    
    // Metadata
    if (options.metadata) {
        formData.append('title', options.metadata.title || '');
        formData.append('artist', options.metadata.artist || '');
        formData.append('album', options.metadata.album || '');
        formData.append('genre', options.metadata.genre || '');
        formData.append('year', options.metadata.year || '');
    }

    try {
        if (onProgress) simulateProgress(onProgress, 4000);

        const response = await fetch(`${API_BASE_URL}/convert/audio`, {
            method: 'POST',
            headers: createHeaders(true),
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Audio conversion failed');
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// --------------------------------------------
// Document Conversion
// --------------------------------------------

/**
 * Convert document file
 * @param {File} file - Document file
 * @param {string} targetFormat - 'pdf', 'docx', 'txt', etc.
 * @param {object} options - { pageRange, imageQuality, ocr, password }
 * @param {function} onProgress
 */
async function convertDocument(file, targetFormat, options = {}, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    
    if (options.pageRange) formData.append('pageRange', options.pageRange);
    if (options.imageQuality) formData.append('imageQuality', options.imageQuality);
    if (options.ocr) formData.append('ocr', options.ocr);
    if (options.password) formData.append('password', options.password);
    if (options.embedFonts) formData.append('embedFonts', 'true');

    try {
        if (onProgress) simulateProgress(onProgress, 3000);

        const response = await fetch(`${API_BASE_URL}/convert/document`, {
            method: 'POST',
            headers: createHeaders(true),
            body: formData
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Document conversion failed');
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
}

// --------------------------------------------
// Batch Conversion
// --------------------------------------------

/**
 * Convert multiple files (same type)
 * @param {File[]} files - Array of files
 * @param {string} type - 'image', 'video', 'audio', 'document'
 * @param {string} targetFormat
 * @param {object} options
 * @param {function} onProgress - callback(percent, index)
 */
async function batchConvert(files, type, targetFormat, options = {}, onProgress = null) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        let result;
        try {
            switch (type) {
                case 'image':
                    result = await convertImage(file, targetFormat, options.quality);
                    break;
                case 'video':
                    result = await convertVideo(file, targetFormat, options);
                    break;
                case 'audio':
                    result = await convertAudio(file, targetFormat, options);
                    break;
                case 'document':
                    result = await convertDocument(file, targetFormat, options);
                    break;
                default:
                    throw new Error('Invalid type');
            }
            results.push({ file: file.name, success: true, data: result });
        } catch (err) {
            results.push({ file: file.name, success: false, error: err.message });
        }
        if (onProgress) onProgress(Math.round(((i + 1) / files.length) * 100), i);
    }
    return results;
}

// --------------------------------------------
// Download Helpers
// --------------------------------------------

/**
 * Trigger download of converted file
 * @param {string} downloadUrl - URL from API response
 * @param {string} filename - Optional filename
 */
function downloadFile(downloadUrl, filename = '') {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = downloadUrl.startsWith('http') ? downloadUrl : `${API_BASE_URL}${downloadUrl}`;
    if (filename) link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --------------------------------------------
// Export for use in HTML pages
// --------------------------------------------
window.convertImage = convertImage;
window.convertVideo = convertVideo;
window.convertAudio = convertAudio;
window.convertDocument = convertDocument;
window.batchConvert = batchConvert;
window.downloadFile = downloadFile;
window.formatBytes = formatBytes;