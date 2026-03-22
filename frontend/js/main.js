// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

if (themeToggle && themeIcon) {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        
        if (newTheme === 'dark') {
            themeIcon.className = 'fas fa-moon';
        } else {
            themeIcon.className = 'fas fa-sun';
        }
        
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'light') {
        themeIcon.className = 'fas fa-sun';
    }
}

// File Converter Logic
class FileConverter {
    constructor() {
        this.API_URL = 'http://localhost:4000/api';
    }

    async convertImage(file, targetFormat) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('targetFormat', targetFormat);

        try {
            const response = await fetch(`${this.API_URL}/convert/image`, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('Conversion error:', error);
            return { success: false, error: 'Conversion failed' };
        }
    }
}

const converter = new FileConverter();

// Drag and drop functionality
function initializeDragAndDrop(uploadAreaId, inputId) {
    const uploadArea = document.getElementById(uploadAreaId);
    const fileInput = document.getElementById(inputId);

    if (!uploadArea || !fileInput) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.style.backgroundColor = 'rgba(138, 43, 226, 0.2)';
    }

    function unhighlight() {
        uploadArea.style.backgroundColor = '';
    }

    uploadArea.addEventListener('drop', handleDrop, false);
    uploadArea.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const files = e.target.files;
        if (files.length > 0) {
            const fileName = files[0].name;
            uploadArea.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <h3>${fileName}</h3>
                <p>Ready for conversion</p>
            `;
        }
    }
}

// Load stats from backend
async function loadStats() {
    try {
        const res = await fetch('http://localhost:4000/api/admin/stats');
        const data = await res.json();
        
        if (data.success && data.stats) {
            // Update stats on index page
            const filesConvertedEl = document.getElementById('filesConvertedCount');
            if (filesConvertedEl) {
                filesConvertedEl.textContent = data.stats.total_conversions + '+';
            }
            
            // Update login users count (from users API)
            loadUserCount();
        }
    } catch (err) {
        console.log('Could not load stats:', err);
        // Keep default values if backend not running
    }
}

// Load user count
async function loadUserCount() {
    try {
        const res = await fetch('http://localhost:4000/api/admin/users');
        const data = await res.json();
        
        if (data.success && data.users) {
            const usersEl = document.getElementById('loginUsersCount');
            if (usersEl) {
                usersEl.textContent = data.users.length + '+';
            }
        }
    } catch (err) {
        console.log('Could not load users:', err);
    }
}

// Load conversions from API
function loadRecentConversions() {
    const conversionsList = document.getElementById('conversionsList');
    if (!conversionsList) return;

    fetch('http://localhost:4000/api/conversion/recent', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(data => {
        if (data.success && data.items && data.items.length > 0) {
            conversionsList.innerHTML = data.items.slice(0, 5).map(item => `
                <div class="glass-conversion-item">
                    <div class="file-info">
                        <h4><i class="fas fa-file"></i> ${item.filename}</h4>
                        <p>Converted to ${item.converted_filename || 'N/A'}</p>
                    </div>
                    <div class="file-status">
                        <span class="status-success">Completed</span>
                    </div>
                </div>
            `).join('');
        } else {
            loadFromLocalStorage();
        }
    })
    .catch(() => {
        loadFromLocalStorage();
    });

    function loadFromLocalStorage() {
        const conversions = JSON.parse(localStorage.getItem('conversions')) || [];
        
        if (conversions.length === 0) {
            conversionsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-file-import"></i>
                    <p>No recent conversions</p>
                </div>
            `;
            return;
        }

        conversionsList.innerHTML = conversions.slice(0, 5).map(conv => `
            <div class="glass-conversion-item">
                <div class="file-info">
                    <h4><i class="fas fa-file"></i> ${conv.fileName}</h4>
                    <p>${conv.from} → ${conv.to}</p>
                </div>
                <div class="file-status">
                    <span class="status-success">Completed</span>
                </div>
            </div>
        `).join('');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRecentConversions();
    loadStats(); // Load actual stats from backend
    
    if (document.getElementById('imageUploadArea')) {
        initializeDragAndDrop('imageUploadArea', 'imageFileInput');
    }
});
