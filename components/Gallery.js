'use client';

import { useState } from 'react';
import MaterialSwatch from './MaterialSwatch';
import Lightbox from './Lightbox';

export default function Gallery({ images = [], alt, color, sku, className = '' }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const pics = (images || []).filter(Boolean);

  if (pics.length === 0) {
    // no real photos yet — fall back to the color-swatch placeholder
    return <MaterialSwatch color={color} sku={sku} className={className} />;
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        aria-label={alt}
        className={`block w-full overflow-hidden rounded-lg bg-white border border-charcoal/10 cursor-zoom-in ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={pics[active]} alt={alt} className="w-full h-full object-cover" />
      </button>
      {pics.length > 1 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {pics.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${alt} ${i + 1}`}
              className={`w-16 h-16 rounded overflow-hidden border-2 shrink-0 transition-colors ${
                i === active ? 'border-brick' : 'border-charcoal/10 hover:border-charcoal/30'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {lightboxOpen && (
        <Lightbox
          images={pics}
          alt={alt}
          index={active}
          onNavigate={setActive}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
