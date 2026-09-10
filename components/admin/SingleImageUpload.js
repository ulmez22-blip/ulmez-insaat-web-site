'use client';

import { useRef, useState } from 'react';

export default function SingleImageUpload({ value, onChange, placeholder = "Fotoğraf URL'si" }) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChosen(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yükleme başarısız');
      onChange(data.url);
    } catch (err) {
      setError(err.message || 'Yükleme başarısız');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={handleFileChosen}
        />
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 border border-charcoal/20 rounded px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Bilgisayardan yükle"
          className="text-xs px-2 py-2 rounded border border-charcoal/20 text-charcoal/60 hover:border-brick hover:text-goldtext shrink-0 disabled:opacity-50"
        >
          {uploading ? '…' : '📤 Yükle'}
        </button>
      </div>
      {error && <p className="text-xs text-goldtext">{error}</p>}
    </div>
  );
}
