'use client';

import { useState } from 'react';
import Lightbox from './Lightbox';

export default function ListingCard({ listing, locale, dict, phones = [] }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = (listing.images || []).filter(Boolean);
  const phone = phones[0];

  return (
    <div className="bg-white text-charcoal border border-charcoal/10 rounded-lg overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      {images.length > 0 ? (
        <button
          type="button"
          onClick={() => { setActive(0); setLightboxOpen(true); }}
          aria-label={listing.title[locale]}
          className="block w-full h-40 cursor-zoom-in relative group"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={listing.title[locale]} className="w-full h-40 object-cover" />
          {images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-charcoal/80 text-paper text-xs rounded-full px-2 py-0.5">
              +{images.length - 1}
            </span>
          )}
        </button>
      ) : (
        <div className="h-1 w-10 bg-brick rounded-full m-5 mb-0" />
      )}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mb-2">
          <span className="bg-charcoal text-paper text-xs rounded-full px-3 py-1">
            {dict.listingType[listing.type]}
          </span>
          <span className="border border-charcoal/20 text-charcoal/70 text-xs rounded-full px-3 py-1">
            {dict.listingStatus[listing.status]}
          </span>
        </div>
        <h3 className="font-display font-medium mb-1">{listing.title[locale]}</h3>
        <p className="text-xs text-charcoal/50 mb-2">{listing.location}</p>
        {listing.desc[locale] && (
          <p className="text-sm text-charcoal/60 leading-relaxed flex-1">{listing.desc[locale]}</p>
        )}
        {listing.price && (
          <div className="font-display font-bold text-goldtext mt-3">{listing.price}</div>
        )}
        {phone && (
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            className="mt-4 inline-block text-center bg-brick hover:bg-brickdark transition-colors text-charcoal text-sm font-medium px-4 py-2 rounded"
          >
            {dict.emlakCallCta}
          </a>
        )}
      </div>

      {lightboxOpen && (
        <Lightbox
          images={images}
          alt={listing.title[locale]}
          index={active}
          onNavigate={setActive}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
