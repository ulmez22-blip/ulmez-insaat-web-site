'use client';

import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, categories, locale, dict, initialCategory = 'all' }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === 'all' || p.category === category;
      const matchesQuery =
        query.trim() === '' ||
        p.name[locale].toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [products, category, query, locale]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="text"
          placeholder={dict.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-navylight border border-paper/20 text-paper placeholder:text-paper/40 focus:border-brick outline-none rounded px-3 py-2 text-sm flex-1"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-navylight border border-paper/20 text-paper focus:border-brick outline-none rounded px-3 py-2 text-sm"
        >
          <option value="all" className="text-charcoal">{dict.filterAll}</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug} className="text-charcoal">
              {c.name[locale]}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-paper/60 text-sm">—</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} locale={locale} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
