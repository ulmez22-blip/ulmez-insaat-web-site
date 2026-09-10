'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getDict } from '../../../lib/i18n';
import { useQuoteCart } from '../../../components/QuoteCartContext';
import Reveal from '../../../components/Reveal';

const inputClass = 'bg-navylight border border-paper/20 text-paper placeholder:text-paper/40 focus:border-brick outline-none rounded px-3 py-2.5 text-sm';

export default function QuoteCartPage() {
  const { locale } = useParams();
  const dict = getDict(locale);
  const { items, updateQuantity, removeItem, clearCart } = useQuoteCart();

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, items }),
      });
      if (!res.ok) throw new Error('failed');
      setStatus('success');
      clearCart();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-charcoal text-paper min-h-[60vh]">
        <Reveal className="max-w-xl mx-auto px-5 py-24 text-center">
          <h1 className="font-display text-2xl font-bold mb-3">{dict.quoteSuccessTitle}</h1>
          <p className="text-paper/70">{dict.quoteSuccessBody}</p>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="bg-charcoal text-paper min-h-[60vh]">
      <div className="max-w-4xl mx-auto px-5 py-12">
        <Reveal>
          <h1 className="font-display text-3xl font-bold mb-8">{dict.quoteCartTitle}</h1>
        </Reveal>

        {items.length === 0 ? (
          <p className="text-paper/60">{dict.quoteCartEmpty}</p>
        ) : (
          <>
            <Reveal className="border border-paper/10 rounded-lg overflow-hidden mb-10">
              {items.map((item) => (
                <div key={item.sku} className="flex items-center gap-4 p-4 border-b border-paper/10 last:border-b-0">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{item.name[locale]}</div>
                    <div className="eyebrow text-ochre">{item.sku} · {item.unit}</div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.sku, Number(e.target.value))}
                    className={`w-20 ${inputClass} py-1.5`}
                  />
                  <button
                    onClick={() => removeItem(item.sku)}
                    className="text-xs text-ochre hover:text-brick"
                  >
                    {dict.remove}
                  </button>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.1}>
              <h2 className="font-display text-xl font-bold mb-5">{dict.quoteFormTitle}</h2>
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                <input
                  required
                  name="name"
                  placeholder={`${dict.name} *`}
                  value={form.name}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-1`}
                />
                <input
                  required
                  name="phone"
                  placeholder={`${dict.phone} *`}
                  value={form.phone}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-1`}
                />
                <input
                  name="email"
                  type="email"
                  placeholder={dict.email}
                  value={form.email}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  name="address"
                  placeholder={dict.address}
                  value={form.address}
                  onChange={handleChange}
                  className={`${inputClass} sm:col-span-2`}
                />
                <textarea
                  name="message"
                  placeholder={dict.message}
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputClass} sm:col-span-2`}
                />
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="bg-brick hover:bg-brickdark transition-colors text-charcoal text-sm font-medium px-6 py-3 rounded sm:col-span-2 w-fit disabled:opacity-60"
                >
                  {status === 'sending' ? '...' : dict.submitQuote}
                </button>
                {status === 'error' && (
                  <p className="text-sm text-ochre sm:col-span-2">
                    {locale === 'tr' ? 'Bir hata oluştu, lütfen tekrar deneyin.' : locale === 'en' ? 'Something went wrong, please try again.' : 'Çewtiyek çêbû, ji kerema xwe dîsa biceribîne.'}
                  </p>
                )}
              </form>
            </Reveal>
          </>
        )}
      </div>
    </div>
  );
}
