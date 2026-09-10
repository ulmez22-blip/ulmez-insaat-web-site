'use client';

import { useRef, useState } from 'react';

export default function ImageListEditor({ images, onChange, label = 'Fotoğraflar' }) {
  const list = images.length ? images : [''];
  const mainIndex = list.findIndex((url) => url && url.trim());
  const fileInputRef = useRef(null);
  const pendingIndex = useRef(null);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [error, setError] = useState('');

  function updateAt(i, value) {
    const next = [...list];
    next[i] = value;
    onChange(next);
  }

  function removeAt(i) {
    const next = list.filter((_, idx) => idx !== i);
    onChange(next.length ? next : []);
  }

  function makeMain(i) {
    const next = [...list];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    onChange(next);
  }

  function addRow() {
    onChange([...list, '']);
  }

  function triggerUpload(i) {
    pendingIndex.current = i;
    setError('');
    fileInputRef.current?.click();
  }

  async function handleFileChosen(e) {
    const file = e.target.files?.[0];
    const i = pendingIndex.current;
    e.target.value = ''; // allow picking the same file again later
    if (!file || i === null) return;

    setUploadingIndex(i);
    setError('');
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Yükleme başarısız');
      updateAt(i, data.url);
    } catch (err) {
      setError(err.message || 'Yükleme başarısız');
    } finally {
      setUploadingIndex(null);
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm text-charcoal/70">{label}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileChosen}
      />
      {list.map((url, i) => {
        const hasValue = !!(url && url.trim());
        const isMain = hasValue && i === mainIndex;
        return (
          <div key={i} className="border border-charcoal/10 rounded p-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-charcoal/40 w-5 shrink-0">{i + 1}</span>
              <input
                placeholder="Fotoğraf URL'si"
                value={url}
                onChange={(e) => updateAt(i, e.target.value)}
                className="flex-1 min-w-0 border border-charcoal/20 rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap pl-7">
              <button
                type="button"
                onClick={() => triggerUpload(i)}
                disabled={uploadingIndex === i}
                title="Bilgisayardan yükle"
                className="text-xs px-2 py-2 rounded border border-charcoal/20 text-charcoal/60 hover:border-brick hover:text-goldtext shrink-0 disabled:opacity-50"
              >
                {uploadingIndex === i ? '…' : '📤 Yükle'}
              </button>
              <button
                type="button"
                onClick={() => makeMain(i)}
                disabled={isMain || !hasValue}
                title={hasValue ? 'Ana fotoğraf yap' : 'Önce bir fotoğraf ekleyin'}
                className={`text-xs px-2 py-2 rounded border shrink-0 ${
                  isMain
                    ? 'border-brick bg-brick/10 text-goldtext cursor-default'
                    : hasValue
                      ? 'border-charcoal/20 text-charcoal/60 hover:border-brick hover:text-goldtext'
                      : 'border-charcoal/10 text-charcoal/30 cursor-not-allowed'
                }`}
              >
                {isMain ? '★ Ana' : '☆ Ana Yap'}
              </button>
              <button
                type="button"
                onClick={() => removeAt(i)}
                title="Kaldır"
                className="text-xs px-2 py-2 rounded border border-charcoal/20 text-charcoal/60 hover:border-brick hover:text-goldtext shrink-0"
              >
                ✕ Kaldır
              </button>
            </div>
          </div>
        );
      })}
      {error && <p className="text-xs text-goldtext">{error}</p>}
      <p className="text-xs text-charcoal/40">Boş satırlar otomatik olarak yok sayılır; ★ işaretli fotoğraf ana fotoğraf olarak gösterilir.</p>
      <button
        type="button"
        onClick={addRow}
        className="text-xs px-3 py-2 rounded border border-dashed border-charcoal/30 text-charcoal/60 hover:border-brick hover:text-goldtext w-full"
      >
        + Fotoğraf Ekle
      </button>
    </div>
  );
}
