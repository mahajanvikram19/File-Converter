const HIS_API = "http://localhost:4000";

// Helper function to get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

document.addEventListener("DOMContentLoaded", async () => {

    const historyBox = document.querySelector("#historyList");
    if (!historyBox) return;

    let token = getToken();
    if (!token) {
        historyBox.innerHTML = "<p>Please login to see your converted files.</p>";
        return;
    }

    const res = await fetch(`${HIS_API}/api/conversion/recent`, {
        headers: { "Authorization": "Bearer " + token }
    });

    const data = await res.json();

    if (!data.success || !data.items || data.items.length === 0) {
        historyBox.innerHTML = "<p>No history found.</p>";
        return;
    }

    let html = "";
    data.items.forEach(file => {
        // Get icon based on file type
        let icon = 'fa-image';
        let typeLabel = 'Image';
        if (file.file_type === 'video') {
            icon = 'fa-video';
            typeLabel = 'Video';
        } else if (file.file_type === 'audio') {
            icon = 'fa-music';
            typeLabel = 'Audio';
        } else if (file.file_type === 'document') {
            icon = 'fa-file-alt';
            typeLabel = 'Document';
        } else if (file.file_type === 'video-to-audio') {
            icon = 'fa-headphones-alt';
            typeLabel = 'Video to Audio';
        }
        
        html += `
            <div class="history-item">
                <i class="fas ${icon}"></i>
                <span class="file-type">${typeLabel}</span>
                <p>${file.filename} ➜ ${file.converted_filename}</p>
                <button class="download-btn" onclick="downloadFromHistory('${file.converted_filename}')">Download</button>
            </div>
        `;
    });

    historyBox.innerHTML = html;

});

// Download function - directly downloads without opening new tab
function downloadFromHistory(filename) {
    const url = `${HIS_API}/api/files/converted/${filename}`;
    
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            // Create blob URL and download
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
        })
        .catch(error => {
            console.error('Download failed:', error);
            // Fallback - open in new tab as download
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
}
