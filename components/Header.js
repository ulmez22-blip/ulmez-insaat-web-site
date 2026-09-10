'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LOCALES, LOCALE_LABELS } from '../lib/i18n';
import { useQuoteCart } from './QuoteCartContext';

export default function Header({ locale, dict }) {
  const [open, setOpen] = useState(false);
  const { items } = useQuoteCart();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  function switchLocale(next) {
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    const rest = window.location.pathname.split('/').slice(2).join('/');
    window.location.href = `/${next}/${rest}`;
  }

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/urunler`, label: dict.nav.products },
    { href: `/${locale}/projelerimiz`, label: dict.nav.projects },
    { href: `/${locale}/bayilerimiz`, label: dict.nav.dealers },
    { href: `/${locale}/emlak`, label: dict.nav.emlak },
    { href: `/${locale}/hakkimizda`, label: dict.nav.about },
    { href: `/${locale}/iletisim`, label: dict.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-charcoal text-paper border-b-2 border-brick">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-20">
        <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt=""
            className="h-12 w-12 object-contain shrink-0"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
          <span className="flex flex-col leading-none">
            <span className="font-display font-bold text-lg tracking-tight">
              Ülmez <span className="text-brick">İnşaat</span>
            </span>
            <span className="eyebrow text-paper/50 mt-1">{dict.headerTagline}</span>
          </span>
        </Link>

        <nav className="hidden xl:flex items-center flex-wrap justify-end gap-x-5 gap-y-1 font-body text-sm font-medium">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brick transition-colors text-center leading-tight">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            defaultValue={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="bg-transparent border border-paper/30 rounded text-xs px-2 py-1.5 hidden sm:block"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l} className="text-charcoal">
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>

          <Link
            href={`/${locale}/teklif`}
            className="relative bg-brick hover:bg-brickdark transition-colors text-charcoal text-sm font-medium px-3 py-2 rounded"
          >
            {dict.nav.quote}
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-ochre text-charcoal text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          <button
            className="xl:hidden p-2"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            <div className="w-5 h-0.5 bg-paper mb-1"></div>
            <div className="w-5 h-0.5 bg-paper mb-1"></div>
            <div className="w-5 h-0.5 bg-paper"></div>
          </button>
        </div>
      </div>

      {open && (
        <nav className="xl:hidden flex flex-col gap-1 px-5 pb-4 font-body text-sm border-t border-paper/10">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="py-2" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <select
            aria-label="Language"
            defaultValue={locale}
            onChange={(e) => switchLocale(e.target.value)}
            className="bg-transparent border border-paper/30 rounded text-xs px-2 py-1.5 mt-2 w-fit"
          >
            {LOCALES.map((l) => (
              <option key={l} value={l} className="text-charcoal">
                {LOCALE_LABELS[l]}
              </option>
            ))}
          </select>
        </nav>
      )}
    </header>
  );
}
