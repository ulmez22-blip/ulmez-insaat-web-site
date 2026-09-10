'use client';

import { useState } from 'react';
import { useQuoteCart } from './QuoteCartContext';

export default function AddToQuoteButton({ product, dict }) {
  const { addItem } = useQuoteCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        min="1"
        value={qty}
        onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
        className="w-20 bg-navylight border border-paper/20 text-paper focus:border-brick outline-none rounded px-2 py-2.5 text-sm"
        aria-label={dict.quantity}
      />
      <button
        onClick={handleAdd}
        className="bg-brick hover:bg-brickdark transition-colors text-charcoal text-sm font-medium px-5 py-2.5 rounded"
      >
        {added ? dict.added : dict.addToQuote}
      </button>
    </div>
  );
}
