'use client';

import Link from 'next/link';
import { useState } from 'react';
import MaterialSwatch from './MaterialSwatch';
import { useQuoteCart } from './QuoteCartContext';

export default function ProductCard({ product, locale, dict }) {
  const { addItem } = useQuoteCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="notch-card bg-white text-charcoal border border-charcoal/10 flex flex-col h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <Link href={`/${locale}/urunler/${product.sku}`}>
        {product.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.images[0]} alt={product.name[locale]} className="h-36 w-full object-cover" />
        ) : (
          <MaterialSwatch color={product.color} sku={product.sku} className="h-36 w-full" />
        )}
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="eyebrow text-steel mb-1">{product.sku}</div>
        <Link href={`/${locale}/urunler/${product.sku}`} className="font-display font-medium leading-snug hover:text-goldtext">
          {product.name[locale]}
        </Link>
        <p className="text-xs text-charcoal/60 font-mono mt-1">{product.spec} · {product.unit}</p>
        <div className="mt-auto pt-4 flex gap-2">
          <Link
            href={`/${locale}/urunler/${product.sku}`}
            className="flex-1 text-center text-xs border border-charcoal/20 rounded px-2 py-2 hover:border-brick hover:text-goldtext transition-colors"
          >
            {dict.viewProduct}
          </Link>
          <button
            onClick={handleAdd}
            className="flex-1 text-xs bg-brick text-charcoal rounded px-2 py-2 hover:bg-brickdark transition-colors"
          >
            {added ? dict.added : dict.addToQuote}
          </button>
        </div>
      </div>
    </div>
  );
}
