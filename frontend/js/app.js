async function uploadFile(file, target) {
  const form = new FormData();
  form.append('file', file);
  form.append('target', target);

  const res = await fetch('/api/conversion/upload', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    body: form
  });
  return res.json();
}

async function loadRecent() {
  const res = await fetch('/api/conversion/recent', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  const data = await res.json();
  const box = document.getElementById('recent-box');
  box.innerHTML = '';
  if (!data.success || !data.items || data.items.length===0) { box.innerHTML = '<i>No recent conversions</i>'; return; }
  data.items.forEach(it => {
    const div = document.createElement('div');
    div.className = 'recent-item';
    const previewLink = `<a target="_blank" href="/api/conversion/preview/${it._id}">Preview</a>`;
    const downloadLink = `<a href="/api/conversion/download/${it._id}">Download</a>`;
    div.innerHTML = `<b>${it.type}</b> — ${new Date(it.date).toLocaleString()} — ${previewLink} | ${downloadLink}`;
    box.appendChild(div);
  });
}

// wire upload form
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileEl = document.getElementById('fileInput');
      const target = document.getElementById('targetFormat').value;
      if (!fileEl.files.length) return alert('Select file');
      const resp = await uploadFile(fileEl.files[0], target);
      if (resp.success) {
        alert('Converted!');
        // Direct download - no new tab
        const link = document.createElement('a');
        link.href = resp.downloadUrl;
        link.download = '';
        link.target = '_self';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        loadRecent();
      } else {
        alert('Error: ' + (resp.message || 'Server error'));
      }
    });
  }
  // load recent if logged in
  if (auth.isAuth()) loadRecent();
});
